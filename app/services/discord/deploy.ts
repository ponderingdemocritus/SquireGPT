import fs from 'node:fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9';
import { discordConfig } from '../../config'

export const setupDiscordCommands = () => {
    const commands = [];
    const commandFiles = fs.readdirSync('app/services/discord/commands').filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        let name = file.replace(".ts", ".js")
        const command = require(`./commands/${name}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(discordConfig.token);

    rest.put(Routes.applicationGuildCommands(discordConfig.client_id, discordConfig.guild_id), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
}

