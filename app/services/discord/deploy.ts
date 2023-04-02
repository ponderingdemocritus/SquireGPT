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
            await rest.put(
                Routes.applicationCommands(discordConfig.client_id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    })();
}
