"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinecone = void 0;
require('dotenv').config();
const pinecone_1 = require("@pinecone-database/pinecone");
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const discord_1 = require("./services/discord");
const deploy_1 = require("./services/discord/deploy");
const cli_1 = require("./cli");
const config_1 = require("./config");
const app = (0, express_1.default)();
const port = 3000;
if (config_1.discordConfig.token) {
    discord_1.client;
    (0, deploy_1.setupDiscordCommands)();
}
exports.pinecone = new pinecone_1.PineconeClient();
async function main() {
    await exports.pinecone.init({
        environment: process.env.PINECONE_ENVIROMENT || "us-central1-gcp",
        apiKey: process.env.PINECONE_API_KEY || "",
    });
}
main();
app.use(express_1.default.json());
app.use("/", router_1.default);
const server = app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
if (process.argv.includes('--cli')) {
    (0, cli_1.startReadline)(server);
}
//# sourceMappingURL=server.js.map