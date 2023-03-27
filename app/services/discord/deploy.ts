import fs from 'node:fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9';
import { discordConfig } from '../../config'

export const setupDiscordCommands = () => {
    const commands: any = [];
    const commandFiles = fs.readdirSync('app/services/discord/commands').filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        let name = file.replace(".ts", ".js")
        const command = require(`./commands/${name}`);
        commands.push(command.default.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(discordConfig.token);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data: any = await rest.put(
                Routes.applicationCommands(discordConfig.client_id),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
