"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help = "\n```\nCommands for Alexis (Stupid Bot)\n/blessed [category] = Retrieves a blessed url. Categories: fox, dog, cat\n/bored = Outputs an interesting activity.\n/dadjoke = Outputs a dad joke.\n/flip = Do a coin toss.\n/hello = Greet the bot by mentioning it.\n/help = Output list of commands\n/insult (@user) = Insults a mentioned user.\n/numbers [value] = Outputs a trivia about a number\n/quotes -c [category] = Outputs a random quote from a category. Categories: programming\n/raffle [event] = Raffle event. Events: start = start the raffle, join = join the raffle, end = end the raffle.\n/roll [min] [max] = Outputs a random number.\n/wiki <query> = Outputs a list of Wikipedia summary related to the query.\n```\n";
exports.default = (function (client) {
    return client.addCommand('/help:alexis')
        .action(function () {
        if (client.current) {
            client.sendMessage(client.current.threadId, help);
        }
    });
});
