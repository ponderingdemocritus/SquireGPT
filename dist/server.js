"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
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
// export const db = new Database('db.sqlite');
// export const client = new PostgresClient({
//     host: 'app-1de1be1e-ff98-4f77-a735-68b1c35ad66c-do-user-10698562-0.b.db.ondigitalocean.com',
//     user: 'doadmin',
//     password: 'tQ8dnc03mOBrSjfx',
//     database: 'squire',
//     port: 25060,
//     ssl: true
// });
// async function main(): Promise<void> {
//     await createUsersTable();
// }
// main();
app.use(express_1.default.json());
app.use("/", router_1.default);
app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
//# sourceMappingURL=server.js.map