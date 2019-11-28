/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2019
 */
import axios from 'axios';
import MessengerClient from './utils/client';
import commander from 'commander';
import { Mention } from 'libfb';

export default (client: MessengerClient) => {
  /**
   * API integration for numbers API
   */
  client.addCommand('/numbers [number]')
    .description('Outputs trivia for numbers.')
    .action((number: number) => {
      let request = 'http://numbersapi.com'
      if(number) {
        request = `${request}/${number}`;
      } else {
        request = `${request}/random`;
      }
      
      request = `${request}/trivia`;

      if (client.current) {
        const thread = client.current.threadId;
        axios.get(request).then(({ data }) => {
          client.sendMessage(thread, data);
        });
      }
    });

  /**
   *
   */
  client.addCommand('/roll [min] [max]')
    .description('Rolls a number.')
    .action((min: string = '100', max: string) => {
      if (client.current) {
        const thread = client.current.threadId;

        const parsedMin = Number.parseInt(min);
        const parsedMax = Number.parseInt(max);

        const result = (parsedMax
          ? (parsedMin + (Math.random() * (parsedMax - parsedMin)))
          : Math.random() * parsedMin
        ) | 0;

        console.log(`Random: ${result}`);
        client.sendMessage(thread, `You rolled ${result}.`);
      }
    });

  client.addCommand('/toss')
    .description('Flip a coin.')
    .action(() => {
      if (client.current) {
        const flip = Math.random() < 0.5 ? 'Tails' : 'Heads';
        client.sendMessage(client.current.threadId, `You flipped ${flip}.`);
      }
    });

  client.addCommand('/wiki <query>')
    .description('Perform a wikipedia search.')
    .action((query: string) => {
      if (client.current) {
        const thread = client.current.threadId;

        axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`).then(({ data }) => {
          let result = `Search results for '${data[0]}':`;

          const dataMax = Math.min(data[1].length, 5);

          if (dataMax > 1) {
            const articles = data[1].slice(0, dataMax);
            const summary = data[2].slice(0, dataMax);
            // const links = data[3].slice(0, 5);
  
            console.log(data);
  
            for (let i = 0; i < dataMax; i++) {
              result = `${result}

${i + 1}. ${articles[i]}
- ${summary[i]}`
            };
          } else {
            result = `${result}
            
No results found :(`;
          }

          client.sendMessage(thread, result);
        });
      }
    });

  client.addCommand('/dadjoke')
    .action(() => {
      if (client.current) {
        const thread = client.current.threadId;

        axios.get('https://icanhazdadjoke.com/', {
          headers: {
            'Accept': 'text/plain',
            'User-Agent': 'My Messenger Bot (https://github.com/LXSMNSYC/my-messenger-bot)'
          }
        }).then(({ data }) => {
          client.sendMessage(thread, data);
        });
      }
    });

  client.addCommand('/insult')
    .action(() => {
      if (client.current) {
        const thread = client.current.threadId;

        const source = Math.random() < 0.5
          ? 'https://evilinsult.com/generate_insult.php?lang=en'
          : 'https://insult.mattbas.org/api/insult';

        axios.get(source).then(({ data }) => {
          client.sendMessage(thread, data);
        });
      }
    });

  client.addCommand('/bored')
    .option('-t, --type <category>', 'category for activity')
    .option('-p, --participants <value>', 'Number of participants')
    .action((cmdObj) => {
      if (client.current) {
        const thread = client.current.threadId;

        axios.get('http://www.boredapi.com/api/activity/', {
          data: {
            type: cmdObj.type,
            participants: cmdObj.participants,
          }
        }).then(({ data }) => {
          client.sendMessage(thread, data.activity);
        });
      }
    });

  client.addCommand('/quotes:prog')
    .action(() => {
      if (client.current) {
        const thread = client.current.threadId;

        axios.get('https://programming-quotes-api.herokuapp.com/quotes/random').then(({ data }) => {
          client.sendMessage(thread, `'${data.en}'
- ${data.author}`);
        });
      }
    });

  client.addCommand('/hello')
    .action(() => {
      if (client.current) {
        const mentions = client.current.mentions;
        const thread = client.current.threadId;

        if (mentions) {
          const id = mentions[0].id;
          const length = mentions[0].length
          client.getUserInfo(id).then((user) => {
            const mentions: Mention[] = [
              { offset: 6, id: id, length },
            ];
            client.sendMessage(thread, `Hello @${user.name}`, {
              mentions,
            });
          });
        }
      }
    });
}