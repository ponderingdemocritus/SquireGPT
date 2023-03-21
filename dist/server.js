"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blobert_chat = exports.visir_chat = exports.pinecone = void 0;
require('dotenv').config();
const pinecone_1 = require("@pinecone-database/pinecone");
const express_1 = __importDefault(require("express"));
const agents_1 = require("./agents");
const router_1 = __importDefault(require("./router"));
const discord_1 = require("./services/discord");
const deploy_1 = require("./services/discord/deploy");
// import { Database } from 'sqlite3';
// import { createUsersTable } from './sqlite';
// import { Client as PostgresClient } from 'pg';
const app = (0, express_1.default)();
const port = 3000;
discord_1.client;
(0, deploy_1.setupDiscordCommands)();
exports.pinecone = new pinecone_1.PineconeClient();
// export const db = new Database('db.sqlite');
// export const client = new PostgresClient({
//     host: 'app-1de1be1e-ff98-4f77-a735-68b1c35ad66c-do-user-10698562-0.b.db.ondigitalocean.com',
//     user: 'doadmin',
//     password: 'tQ8dnc03mOBrSjfx',
//     database: 'squire',
//     port: 25060,
//     ssl: true
// });
async function main() {
    await exports.pinecone.init({
        environment: "us-central1-gcp",
        apiKey: process.env.PINECONE_KEY || "",
    });
}
main();
exports.visir_chat = new agents_1.ConversationAgent(agents_1.visir);
exports.blobert_chat = new agents_1.ConversationAgent(agents_1.blobert);
app.use(express_1.default.json());
app.use("/", router_1.default);
app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
//# sourceMappingURL=server.js.map