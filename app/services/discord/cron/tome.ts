import { visir_chat, blobert_chat } from "../../../../app/server";
import { discordConfig } from "../../../config";
import { DiscordMessage } from "../class";

export default {
    name: 'tome',
    description: 'tome bot',
    enabled: discordConfig.salesChannel != null,
    async execute(client: any) {

        let key = 0;

        const discord_message = new DiscordMessage(client, discordConfig.raidsChannel);

        let question = "";
        let response = "";


       

            try {

                const blobert_response = await blobert_chat.getResponse(key == 0 ? `You are interviewing Gandalf. What's your question to Gandalf? Introduce gandalf first and explaining what you will be talking about.` : `Gandalf answered: ${response}. What do you think about this, and ask another question keeping the conversation going?`);


                await discord_message.sendMessage({
                    title: `Blobert`,
                    description: `${blobert_response.response}`,
                    thumbnail: {
                        url: 'https://media.discordapp.net/attachments/884213909106589716/1077582008143855616/AB41B2F9-A8EC-439E-83DF-76633A959BAF.png?width=599&height=899',
                    },
                });

                question = blobert_response.response;



            } catch (e) {
                console.error(
                    `Error sending raid message at timestamp`,
                    e
                );
            }

            

            try {

                const visir_response = await visir_chat.getResponse(`Blobert asked: ${question}. What's your answer, be detailed, passionate and descriptive?`);

                await discord_message.sendMessage({
                    title: `Gandalf`,
                    description: `${visir_response.response}`,
                    thumbnail: {
                        url: 'https://static.wikia.nocookie.net/lotr/images/e/e7/Gandalf_the_Grey.jpg',
                    },
                });

                key++;

                response = visir_response.response;

            } catch (e) {
                console.error(
                    `Error sending raid message at timestamp`,
                    e
                );
            }


        


    
    }
};