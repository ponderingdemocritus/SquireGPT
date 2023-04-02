import { prompt } from 'enquirer';
import { ConversationAgent } from './agents/index';
import { processDocuments } from './agents/loaders/utils';
import { agentConfig } from './config/index';

export async function startReadline(server: any) {
    while (true) {
        const response = await prompt<{ option: string }>({
            type: 'select', // Change this line to use 'list' instead of 'select'
            name: 'option',
            message: 'Please choose an option:',
            choices: [
                { name: '1', message: '1. Load documents via directory' },
                { name: '2', message: '2. Chat with agent' }, // Add this line
                { name: '3', message: '3. Kill server' }, // Add this line
            ],
        });

        // Process the command
        const shouldExit = await processCommand(response.option, server);

        if (shouldExit) {
            break;
        }
    }
}

// Function to process CLI commands
async function processCommand(command: string, server: any): Promise<boolean> {

    const ora = await import('ora');


    switch (command) {
        case '1':
            const dirPath = await prompt<{ message: string }>({
                type: 'input',
                name: 'message',
                message: 'Enter the path of the directory to index:',
            });
            await processDocuments(dirPath.message);
            break;
        case '2':
            const chatResponse = await prompt<{ message: string }>({
                type: 'input',
                name: 'message',
                message: 'Chat with Agent:',
            });
            const chat = new ConversationAgent(agentConfig.context);

            const spinner = ora.default('Processing your message...').start();

            const response = await chat.getResponse(chatResponse.message);

            spinner.stop();

            // add line
            console.log(`Agent: ------------------------------------`);

            console.log(`${response}`);

            console.log(`----------------------------------------`);
            break;
        case '3':
            console.log('Stopping the server...');
            server.close(() => {
                console.log('Server stopped.');
                process.exit(0);
            });
            return true;
        default:
            console.log('Invalid option. Please enter a valid option number.');
    }

    return false;
}