require('dotenv').config();

import { discordConfig } from "../../../config";
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1'
});

const bucketName = 'realms-squire-dump';

async function extractImages(channel: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const messages = await channel.messages.fetch({
        limit: 100,
        after: today.getTime()
    });
    const imageMessages = messages.filter((message: any) => message.author.username === "Midjourney Bot").map((content: any) => {
        return {
            id: content.id,
            prompt: content.content.match(/\*\*(.+?)\*\*/)?.[1],
            url: content.attachments.first().url,
            user: content.attachments.first().url.match(/\/(\w+)_/)?.[1].split('_')[0],
            timestamp: content.createdTimestamp,
            reactions: content.reactions.cache.map((reaction: any) => {
                return {
                    name: reaction.emoji.name,
                    count: reaction.count
                }
            })
        }
    });
    return imageMessages;
}

export = {
    name: 'tome',
    description: 'tome bot',
    interval: 10000,
    enabled: discordConfig.salesChannel != null,
    async execute(client: any) {

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        try {
            for (const channelId of discordConfig.imgCrawlChannels) {

                const targetChannel = client.channels.cache.get(channelId);
                // Call the extractImages function initially
                extractImages(targetChannel).then(imageUrls => {
                    console.log(`Extracted ${imageUrls.length} images.`);

                    const params = {
                        Bucket: bucketName,
                        Key: `${year}_${month}_${day}_${channelId}.json`,
                        Body: JSON.stringify(imageUrls),
                        ContentType: 'application/json'
                    };

                    s3.upload(params, function (err: any, data: any) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('JSON file uploaded successfully to ' + data.Location);
                        }
                    });
                }).catch(error => {
                    console.error(error);
                });
            }

        } catch (e) {
            console.error(
                `Error sending raid message at timestamp`,
                e
            );
        }

    }
};
