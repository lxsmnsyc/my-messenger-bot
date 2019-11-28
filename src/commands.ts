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

export default (client: MessengerClient) => {
  client.addCommand('/greet <greet>')
    .description('greet with the given message')
    .action((greeting: string) => {
      console.log(client.current);
      if (client.current) {
        client.sendMessage(client.current.threadId, `Alexis greets: ${greeting}`);
      }
    });

  client.addCommand('/numbers [number]')
    .option('-r, --random', 'uses a random number as a basis')
    .option('-t, --trivia', 'uses a trivia')
    .action((number, cmdObj) => {
      let request = 'http://numbersapi.com'
      if (cmdObj.random) {
        request = `${request}/random`;
      } else {
        request = `${request}/${number}`;
      }
      if (cmdObj.trivia) {
        request = `${request}/trivia`;
      }

      if (client.current) {
        const thread = client.current.threadId;
        axios.get(request).then(({ data }) => {
          client.sendMessage(thread, data);
        });
      }
    });

  client.addCommand('/roll [min] [max]')
    .action((min: number = 100, max: number) => {
      if (client.current) {
        const thread = client.current.threadId;
        if (max) {
          client.sendMessage(thread, `You rolled ${(Math.random() * (max - min)) | 0}`);
        } else {
          client.sendMessage(thread, `You rolled ${(Math.random() * min) | 0}`);
        }
      }
    });

  client.addCommand('/toss')
    .action(() => {
      if (client.current) {
        const flip = Math.random() < 0.5 ? 'Tails' : 'Heads';
        client.sendMessage(client.current.threadId, `You flipped ${flip}.`);
      }
    });
}