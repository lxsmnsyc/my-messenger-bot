"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
exports.default = (function (client) {
    client.addCommand('/numbers [number]')
        .description('Outputs trivia for numbers.')
        .action(function (number) {
        var request = 'http://numbersapi.com';
        if (number) {
            request = request + "/" + number;
        }
        else {
            request = request + "/random";
        }
        request = request + "/trivia";
        if (client.current) {
            var thread_1 = client.current.threadId;
            axios_1.default.get(request).then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_1, data);
            });
        }
    });
    client.addCommand('/roll [min] [max]')
        .description('Rolls a number.')
        .action(function (min, max) {
        if (min === void 0) { min = '100'; }
        if (client.current) {
            var thread = client.current.threadId;
            var parsedMin = Number.parseInt(min);
            var parsedMax = Number.parseInt(max);
            var result = (parsedMax
                ? (parsedMin + (Math.random() * (parsedMax - parsedMin)))
                : Math.random() * parsedMin) | 0;
            console.log("Random: " + result);
            client.sendMessage(thread, "You rolled " + result + ".");
        }
    });
    client.addCommand('/toss')
        .description('Flip a coin.')
        .action(function () {
        if (client.current) {
            var flip = Math.random() < 0.5 ? 'Tails' : 'Heads';
            client.sendMessage(client.current.threadId, "You flipped " + flip + ".");
        }
    });
    client.addCommand('/wiki <query>')
        .description('Perform a wikipedia search.')
        .action(function (query) {
        if (client.current) {
            var thread_2 = client.current.threadId;
            axios_1.default.get("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + query).then(function (_a) {
                var data = _a.data;
                var result = "Search results for '" + data[0] + "':";
                var dataMax = Math.min(data[1].length, 5);
                if (dataMax > 1) {
                    var articles = data[1].slice(0, dataMax);
                    var summary = data[2].slice(0, dataMax);
                    console.log(data);
                    for (var i = 0; i < dataMax; i++) {
                        result = result + "\n\n" + (i + 1) + ". " + articles[i] + "\n- " + summary[i];
                    }
                    ;
                }
                else {
                    result = result + "\n            \nNo results found :(";
                }
                client.sendMessage(thread_2, result);
            });
        }
    });
    client.addCommand('/dadjoke')
        .action(function () {
        if (client.current) {
            var thread_3 = client.current.threadId;
            axios_1.default.get('https://icanhazdadjoke.com/', {
                headers: {
                    'Accept': 'text/plain',
                    'User-Agent': 'My Messenger Bot (https://github.com/LXSMNSYC/my-messenger-bot)'
                }
            }).then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_3, data);
            });
        }
    });
    client.addCommand('/insult')
        .action(function () {
        if (client.current) {
            var thread_4 = client.current.threadId;
            var source = Math.random() < 0.5
                ? 'https://evilinsult.com/generate_insult.php?lang=en'
                : 'https://insult.mattbas.org/api/insult';
            axios_1.default.get(source).then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_4, data);
            });
        }
    });
    client.addCommand('/bored')
        .option('-t, --type <category>', 'category for activity')
        .option('-p, --participants <value>', 'Number of participants')
        .action(function (cmdObj) {
        if (client.current) {
            var thread_5 = client.current.threadId;
            axios_1.default.get('http://www.boredapi.com/api/activity/', {
                data: {
                    type: cmdObj.type,
                    participants: cmdObj.participants,
                }
            }).then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_5, data.activity);
            });
        }
    });
    client.addCommand('/quotes:prog')
        .action(function () {
        if (client.current) {
            var thread_6 = client.current.threadId;
            axios_1.default.get('https://programming-quotes-api.herokuapp.com/quotes/random').then(function (_a) {
                var data = _a.data;
                client.sendMessage(thread_6, "'" + data.en + "'\n- " + data.author);
            });
        }
    });
    client.addCommand('/hello')
        .action(function () {
        if (client.current) {
            var mentions = client.current.mentions;
            var thread_7 = client.current.threadId;
            if (mentions) {
                var id_1 = mentions[0].id;
                var length_1 = mentions[0].length;
                client.getUserInfo(id_1).then(function (user) {
                    var mentions = [
                        { offset: 6, id: id_1, length: length_1 },
                    ];
                    client.sendMessage(thread_7, "Hello " + user.name, {
                        mentions: mentions,
                    });
                });
            }
        }
    });
});
