"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (client) {
    return client.addCommand('/roll [min] [max]')
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
});
