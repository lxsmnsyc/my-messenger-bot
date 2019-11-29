"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var all_1 = __importDefault(require("./all"));
exports.default = (function (client) {
    for (var i = 0; i < all_1.default.length; i++) {
        all_1.default[i](client);
    }
});
