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
import { Mention } from 'libfb';
import MessengerClient from '../../utils/client';

interface BlessedDogData {
  fileSizeBytes: number,
  url: string,
}

interface BlessedFoxData {
  image: string,
  link: string,
}

interface BlessedCatData {
  file: string,
}

interface BlessedDogResponse {
  data: BlessedDogData,
}

interface BlessedFoxResponse {
  data: BlessedFoxData,
}

interface BlessedCatResponse {
  data: BlessedCatData
}

export default (client: MessengerClient) => 
  client.addCommand('/blessed <tag>')
    .action(async (tag: string) => {
      if (client.current) {
        if (tag === 'dog') {
          const authorId = client.current.authorId;
          const thread = client.current.threadId;

          const { data }: BlessedDogResponse = await axios.get('https://random.dog/woof.json');

          if (data && data.url) {
            const user = await client.getUserInfo(authorId);

            const mentions: Mention[] = [
              { offset: 3, length: user.name.length + 1, id: authorId },
            ];
            await client.sendMessage(thread, `Hi @${user.name}, here's your blessed link: ${data.url}`, {
              mentions,
            });
          }
        }

        if (tag === 'cat') {
          const authorId = client.current.authorId;
          const thread = client.current.threadId;

          const { data }: BlessedCatResponse = await axios.get('https://aws.random.cat/meow');

          if (data && data.file) {
            const user = await client.getUserInfo(authorId);

            const mentions: Mention[] = [
              { offset: 3, length: user.name.length + 1, id: authorId },
            ];
            await client.sendMessage(thread, `Hi @${user.name}, here's your blessed link: ${data.file}`, {
              mentions,
            });
          }
        }

        if (tag === 'fox') {
          const authorId = client.current.authorId;
          const thread = client.current.threadId;

          const { data }: BlessedFoxResponse = await axios.get('https://randomfox.ca/floof/');

          if (data && data.image) {
            const user = await client.getUserInfo(authorId);

            const mentions: Mention[] = [
              { offset: 3, length: user.name.length + 1, id: authorId },
            ];
            await client.sendMessage(thread, `Hi @${user.name}, here's your blessed link: ${data.image}`, {
              mentions,
            });
          }
        }
      }
    });