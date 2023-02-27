export class DiscordMessage {
    private client: any;
    private channel: string;

    constructor(client: any, channel: string) {
        this.client = client;
        this.channel = channel;
    }

    async sendMessage(embed: any) {
        try {
            const channel = await this.client.channels.fetch(this.channel);

            await channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error sending message', error);
        }
    }
}