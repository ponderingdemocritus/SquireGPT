require('dotenv').config();
const { MessageAttachment } = require('discord.js');

const exampleReg = {
  tokens: "100",
  type: 1,
}

export const appRouter = (app, fs, client) => {

  const file = new MessageAttachment('./img/lightning-strikes-sweet-dreams.gif');

  app.get('/attack', (req, res) => {
    console.log("hello");

    const exampleEmbed = {
      title: 'Light has Boosted',
      image: {
        url: 'attachment://lightning-strikes-sweet-dreams.gif',
      },
    };

    client.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
      channel.send({ embeds: [exampleEmbed], files: [file] });
    })
    .catch(console.error);
    res.send("hello");
  });

};