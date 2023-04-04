require('dotenv').config();
import { ConversationAgent } from "..";
import { pinecone } from "../../server";

type Task = {
    task_id: number;
    task_name: string;
};

let table_name: any = process.env.TASKER_TABLE;

async function get_ada_embedding(text: string): Promise<number[]> {
    const { OpenAIEmbeddings } = await import("langchain/embeddings");

    const embeddings = new OpenAIEmbeddings({batchSize: 1});

    text = text.replace("\n", " ");
    return embeddings.embedDocuments([text]).then((result) => result[0]);
}

async function task_creation_agent(objective: string, result: any, task_description: string, task_list: string[]): Promise<Task[]> {
    let prompt = `You are an task creation AI that uses the result of an execution agent to create new tasks with the following objective: ${objective}, The last completed task has the result: ${result}. This result was based on this task description: ${task_description}. These are incomplete tasks: ${task_list.join(", ")}. Based on the result, create new tasks to be completed by the AI system that do not overlap with incomplete tasks. Only  return the tasks as an array as I will be parsing this information, I do not need any text other than the tasks. Format like this ["task 1", "task 2", "task 3"]`;

    const agent = new ConversationAgent(prompt)

    let response = await agent.getResponseWithoutContext("")

    const tasks = JSON.parse(response.match(/(\[.*\])/)[0]);

    // let new_tasks = response.choices[0].text.trim().split("\n");

    return tasks.map((task_name: Task, index: string) => ({ task_id: index, task_name: task_name }));
}

async function prioritization_agent(objective: string, task_list: Task[], this_task_id: number) {
    let task_names = task_list.map((t: any) => t.task_name);
    let next_task_id = this_task_id + 1;
    let prompt = `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks: ${task_names.join(", ")}. Consider the ultimate objective of your team: ${objective}. Do not remove any tasks. Return the result as a numbered list, like:
    #. First task
    #. Second task
    Start the task list with number ${next_task_id}. Only return the tasks as an array as I will be parsing this information, I do not need any text other than the tasks. Format like this ["task 1", "task 2", "task 3"]`;

    const agent = new ConversationAgent(prompt)

    let response = await agent.getResponseWithoutContext("");

    const new_tasks = JSON.parse(response.match(/(\[.*\])/)[0]);
    task_list = []
    for (let task_string of new_tasks) {
        let task_parts = task_string.trim().split(".", 1);
        if (task_parts.length === 2) {
            let task_id = parseInt(task_parts[0].trim());
            let task_name = task_parts[1].trim();
            task_list.push({ task_id, task_name });
        }
    }
}

async function execution_agent(objective: string, task: string): Promise<string> {
    let context = await context_agent(objective, table_name, 5);

    let prompt = `You are an AI who performs one task based on the following objective: ${objective}.\nTake into account these previously completed tasks: ${context.join(", ")}\nYour task: ${task}\nResponse: `

    const agent = new ConversationAgent(prompt)
    return agent.getResponseWithoutContext("")
}

async function context_agent(query: string, index_name: string, n: number): Promise<string[]> {
    let query_embedding = await get_ada_embedding(query);
    let index = pinecone.Index(index_name);
    let results = await index.query({ queryRequest: { vector: query_embedding, topK: n, includeMetadata: true } });
    let sorted_results = results.matches?.sort((a: any, b: any) => b.score - a.score);
    return sorted_results?.map((item: any) => item.metadata.task as string) || ["no results"];
}



export async function runTask(objective: string) {
    let task_list: Task[] = [];

    let index = pinecone.Index(table_name);

    let first_task: Task = {
        task_id: 1,
        task_name: "Develop a task list."
    };
    
    task_list.push(first_task);

    while (true) {
        if (task_list.length > 0) {
            console.log("\n");
            console.log("*****TASK LIST*****");
            console.log("\n");
            for (let t of task_list) {
                console.log(t.task_id + ": " + t.task_name);
            }
            let task = task_list.shift();
            console.log("\n");
            console.log("*****NEXT TASK*****");
            console.log("\n");
            console.log(task?.task_id + ": " + task?.task_name);

            let result = await execution_agent(objective, task?.task_name || "");
            let this_task_id = task?.task_id;
            console.log("\n");
            console.log("*****TASK RESULT*****");
            console.log("\n");
            console.log(result);

            let enriched_result = { data: result };
            let result_id = `result_${task?.task_id}`;
            let vector = enriched_result.data;
            await index.upsert({ 
                upsertRequest: { 
                    vectors: [
                        { id: result_id, values: await get_ada_embedding(vector), metadata: { task: task?.task_name, result } }
                    ] 
                } 
            });

            let new_tasks = await task_creation_agent(objective, enriched_result, task?.task_name || "", task_list.map((t: any) => t.task_name));

            for (let new_task of new_tasks) {
                new_task.task_id = task_list.length ? task_list[task_list.length - 1].task_id + 1 : 1;
                task_list.push(new_task);
            }

            await prioritization_agent(objective, task_list, this_task_id ? this_task_id : 0);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

    }
}
