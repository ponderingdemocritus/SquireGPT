"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const client_1 = __importDefault(require("./services/client"));
const app = (0, express_1.default)();
const port = 3000;
client_1.default;
app.use(express_1.default.json());
app.use("/", routes_1.default);
app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});
//# sourceMappingURL=server.js.map