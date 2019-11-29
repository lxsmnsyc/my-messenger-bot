
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

type WikipediaData = [
  string,
  string[],
  string[],
  string[],
];

interface WikipediaResponse {
  data: WikipediaData,
}

export default (client: MessengerClient) =>
client.addCommand('/wiki <query>')
  .description('Perform a wikipedia search.')
  .action(async (query: string) => {
    if (client.current) {
      const thread = client.current.threadId;

      /**
       * Request data
       */
      const { data }: WikipediaResponse = await Axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`);
      
      /**
       * Header
       */
      let result = `Search results for '${data[0]}':`;

      /**
       * Fetch 6 data
       */
      const dataMax = Math.min(data[1].length, 6);

      /**
       * Check if there is more than one data
       */
      if (dataMax > 1) {
        const articles = data[1].slice(0, dataMax);
        const summary = data[2].slice(0, dataMax);

        let start = 0;
        let end = dataMax - 1;
        if (summary[0].endsWith('may refer to:')) {
          start = 1;
          end = dataMax;

          result = `${result}
${summary[0]}`;
        }

        let items = 0;
        for (let i = start; i < end; i++) {
          result = `${result}

${++items}. ${articles[i]}`;

          if (summary[i] !== '') {
            result = `${result}
-${summary[i]}`;
          }
        };
      } else {
        result = `${result}
        
No results found :(`;
      }

      await client.sendMessage(thread, result);
    }
  });