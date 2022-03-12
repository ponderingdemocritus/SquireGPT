"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const discord_1 = __importDefault(require("./services/discord"));
const deploy_1 = require("./services/discord/deploy");
const app = (0, express_1.default)();
const port = 3000;
discord_1.default;
(0, deploy_1.setupDiscordCommands)();
app.use(express_1.default.json());
app.use("/", routes_1.default);
app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
//# sourceMappingURL=server.js.map