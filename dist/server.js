"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router"));
const discord_1 = __importDefault(require("./services/discord"));
const deploy_1 = require("./services/discord/deploy");
const sqlite3_1 = require("sqlite3");
const sqlite_1 = require("./sqlite");
const app = (0, express_1.default)();
const port = 3000;
discord_1.default;
(0, deploy_1.setupDiscordCommands)();
exports.db = new sqlite3_1.Database('db.sqlite');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, sqlite_1.createUsersTable)();
    });
}
main();
app.use(express_1.default.json());
app.use("/", router_1.default);
app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
//# sourceMappingURL=server.js.map