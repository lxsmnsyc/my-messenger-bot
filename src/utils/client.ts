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
import { ClientOptions, Client, Message, MessageOptions } from 'libfb';
import commander from 'commander';
import stringArgv from 'string-argv';

commander.exitOverride(console.error);

type Optional<T> = T | null | undefined;

export default class MessengerClient {
  private client: Client;
  private email: string;
  private password: string;
  private threads: string[];
  private currentMessage: Optional<Message>;

  constructor(email: string, password: string, threads: string[], options?: ClientOptions) {
    console.log(email, password);
    this.client = new Client(options);
    this.email = email;
    this.password = password;
    this.threads = threads;
  }

  public async start() {
    return this.client.login(this.email, this.password).then(() => {
      console.log('Up and running..');
      this.client.on('message', (message: Message) => {
        console.log('Received:', message)
        if (this.threads.includes(message.threadId)) {
          this.currentMessage = message;
          this.parse(message.message);
          this.currentMessage = null;
        }
      });
    });
  }

  public parse(message: string) {
    commander.parse(stringArgv(message, 'node', 'test'));
  }

  public addCommand(pattern: string) {
    return commander.command(pattern);
  }

  public get current(): Optional<Message> {
    return this.currentMessage;
  }

  public async sendMessage(threadId: string, message: string, options?: MessageOptions) {
    await this.client.sendTypingState(threadId, true);
    const parsed = `${message}
          
(I am a bot 🤖, beep boop)`;
    await this.client.sendMessage(threadId, parsed, options);
    await this.client.sendTypingState(threadId, false);
  }
}