require('dotenv').config();

import { discordConfig } from "../../../config";
import { getLLM } from "../../../services/utils/helpers";

const entity_memory_conversation = '/docs/conversation'
const ask_a_question = '/docs/prompter'

const entityPrompt = 'create a new character that has not been seen before in this world. The character could be a anything and be a protagonist or antagonist.'

const tellMeAStory = 'tell me a story about all the characters in this world. Make it complex and interesting. Use Jrr Tolkien as a reference.'


export = {
    name: 'tome',
    description: 'tome bot',
    interval: 10000,
    enabled: discordConfig.salesChannel != null,
    async execute(client: any) {

        let count = 0;
        try {

            const new_character = await getLLM(entityPrompt, ask_a_question);

            console.log(new_character)

            await getLLM(new_character, entity_memory_conversation);

            const tell_me_a_story = await getLLM(count == 0 ? tellMeAStory : "Keep the story going in a new direction", entity_memory_conversation);

            console.log(tell_me_a_story)

            client.channels
                .fetch(discordConfig.raidsChannel)
                .then((channel: any) => {
                    channel.send({
                        embeds: [{
                            title: 'Story Time',
                            description: tell_me_a_story
                        }],
                    });
                })
                .catch((e: any) => {
                    console.error(
                        `Error sending raid message at timestamp`,
                        e
                    );
                });

            count++;


        } catch (e) {
            console.error(
                `Error sending raid message at timestamp`,
                e
            );
        }

    }
};
