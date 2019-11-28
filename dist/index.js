"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = __importDefault(require("./utils/client"));
var dotenv_1 = __importDefault(require("dotenv"));
var threads_1 = __importDefault(require("./threads"));
var commands_1 = __importDefault(require("./commands"));
dotenv_1.default.config();
console.log(process.env);
var client = new client_1.default(process.env.FB_USER || '', process.env.FB_PASS || '', threads_1.default);
commands_1.default(client);
client.start();
