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
import { Mention } from 'libfb';
import MessengerClient from '../../utils/client';

const UUID = process.env.FB_UUID || '';

export default (client: MessengerClient) =>
  client.addCommand('/hello')
  .action(async () => {
    if (client.current) {
      const mentions = client.current.mentions;
      const authorId = client.current.authorId;
      const thread = client.current.threadId;

      if (mentions && mentions.find(m => m.id === UUID)) {
        const user = await client.getUserInfo(authorId);
        const mentions: Mention[] = [
          { offset: 6, id: authorId, length: user.name.length + 1 },
        ];
        await client.sendMessage(thread, `Hello @${user.name}`, {
          mentions,
        });
      }
    }
  });