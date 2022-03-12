import fetch from 'node-fetch';

import { SlashCommandBuilder } from '@discordjs/builders'

// import { DiscordMessage } from '../../../types';

const fetchRealm = async (id: number) => {
  let url = `https://realms.digital/api/token/` + id

  let res = await fetch(url);
  if (res.status == 404 || res.status == 400) {
    throw new Error("Error retrieving collection stats.");
  }
  if (res.status != 200) {
    throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
  }

  let data = await res.json();
  console.log(data)

  return data
}

export = {
  data: new SlashCommandBuilder()
    .setName('realm').setDescription('Replies with Pong!').addIntegerOption(option => option.setName('int').setDescription('Enter an integer')),
  async execute(interaction: any) {
    const integer = interaction.options.getInteger('int');
    const res = await fetchRealm(integer)
    await interaction.reply({
      embeds: [{
        title: res.name,
        color: '#000',
        image: {
          url: `https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${integer}.webp`,
        },
        timestamp: new Date(),
        url: 'https://beta.bibliothecadao.xyz',
      }]
    });
  },
};
