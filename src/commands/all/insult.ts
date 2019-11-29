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
import MessengerClient from '../../utils/client';
import Axios from 'axios';

interface InsultData {
  data: string,
}

export default (client: MessengerClient) =>
  client.addCommand('/insult')
    .action(async () => {
      if (client.current) {
        const thread = client.current.threadId;
        const mentions = client.current.mentions;

        const source = Math.random() < 0.5
          ? 'https://evilinsult.com/generate_insult.php?lang=en'
          : 'https://insult.mattbas.org/api/insult';

        const { data }: InsultData = await Axios.get(source);

        if (mentions && mentions.length > 0) {
          const mention = mentions[0];

          const user = await client.getUserInfo(mention.id);

          let base = data;
          if (data.endsWith('.')) {
            base = data.substring(0, data.length - 1);
          }

          const result = `${base}, @${user.name}`;

          await client.sendMessage(thread, result, {
            mentions: [
              { offset: base.length + 3, length: user.name.length + 1, id: mention.id },
            ],
          })
        } else {
          await client.sendMessage(thread, data);
        }
      }
    });