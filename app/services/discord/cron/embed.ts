require('dotenv').config();

import { discordConfig } from "../../../config/index";


export default {
    name: 'tome',
    description: 'tome bot',
    interval: 10000,
    enabled: discordConfig.salesChannel != null,
    async execute(client: any) {

        console.log(client)

    }
};
