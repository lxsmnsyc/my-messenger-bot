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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function getRandomSplice(array, amount) {
    return shuffle(array).slice(0, amount);
}
exports.default = (function (client) {
    var record = new Map();
    var owners = new Map();
    client.addCommand('/raffle <flag> [amount]')
        .action(function (flag, amt) {
        if (amt === void 0) { amt = '1'; }
        return __awaiter(void 0, void 0, void 0, function () {
            var thread, authorId_1, owner, user, name_1, mentions, user, mentions, list, user, amount, owner, user, name_2, mentions, result, list, selected, phrase;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!client.current) return [3, 9];
                        thread = client.current.threadId;
                        authorId_1 = client.current.authorId;
                        if (!(flag === 'start')) return [3, 5];
                        if (!record.has(thread)) return [3, 3];
                        owner = owners.get(thread);
                        if (!owner) return [3, 2];
                        user = owner[0], name_1 = owner[1];
                        mentions = [
                            { offset: 0, id: user, length: name_1.length + 1 }
                        ];
                        return [4, client.sendMessage(thread, "@" + name_1 + " has already started a raffle.", {
                                mentions: mentions,
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3, 5];
                    case 3:
                        record.set(thread, []);
                        return [4, client.getUserInfo(authorId_1)];
                    case 4:
                        user = _a.sent();
                        owners.set(thread, [authorId_1, user.name]);
                        mentions = [
                            { offset: 0, id: authorId_1, length: user.name.length + 1 }
                        ];
                        client.sendMessage(thread, "@" + user.name + " started a raffle. Type '/raffle join' to participate.", {
                            mentions: mentions,
                        });
                        _a.label = 5;
                    case 5:
                        if (!(flag === 'join')) return [3, 7];
                        list = record.get(thread);
                        if (!list) return [3, 7];
                        if (!!list.some(function (_a) {
                            var user = _a[0];
                            return user === authorId_1;
                        })) return [3, 7];
                        return [4, client.getUserInfo(authorId_1)];
                    case 6:
                        user = _a.sent();
                        list.push([authorId_1, user.name]);
                        _a.label = 7;
                    case 7:
                        if (!(flag === 'end')) return [3, 9];
                        amount = Number.parseInt(amt);
                        owner = owners.get(thread);
                        if (!owner) return [3, 9];
                        user = owner[0], name_2 = owner[1];
                        if (!(user === authorId_1)) return [3, 9];
                        mentions = [
                            { offset: 0, id: authorId_1, length: name_2.length + 1 }
                        ];
                        result = "@" + name_2 + " ended the raffle.";
                        list = record.get(thread);
                        if (list) {
                            if (list.length > 0) {
                                selected = getRandomSplice(list, amount)
                                    .map(function (value, index) { return index + 1 + ". " + value[1]; });
                                if (selected.length > 0) {
                                    phrase = selected.reduce(function (acc, x) { return acc + "\n" + x; });
                                    result = result + "\n\nList of selected participants:\n" + phrase;
                                }
                            }
                            else {
                                result = result + "\n                  \nThere were no participants :/.";
                            }
                        }
                        return [4, client.sendMessage(thread, result, {
                                mentions: mentions,
                            })];
                    case 8:
                        _a.sent();
                        record.delete(thread);
                        owners.delete(thread);
                        _a.label = 9;
                    case 9: return [2];
                }
            });
        });
    });
});
