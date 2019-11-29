import MessengerClient from "../../utils/client";
import { Mention } from "libfb";

type Thread = string;
type User = string;
type Name = string;

type UserInfo = [User, Name];

type Records = Map<Thread, UserInfo[]>;
type Owners = Map<Thread, UserInfo>;

function shuffle(array: any[]) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function getRandomSplice(array: UserInfo[], amount: number) {
  return shuffle(array).slice(0, amount);
}

export default (client: MessengerClient) => {
  const record: Records = new Map();
  const owners: Owners = new Map();

  client.addCommand('/raffle <flag> [amount]')
    .action(async (flag: string, amt: string = '1') => {
      if (client.current) {
        const thread = client.current.threadId;
        const authorId = client.current.authorId;

        if (flag === 'start') {
          if (record.has(thread)) {
            const owner = owners.get(thread);

            if (owner) {
              const [user, name] = owner;
              const mentions: Mention[] = [
                { offset: 0, id: user, length: name.length + 1 }
              ];

              await client.sendMessage(thread, `@${name} has already started a raffle.`, {
                mentions,
              });
            }
  
          } else {
            record.set(thread, []);
  
            const user = await client.getUserInfo(authorId);

            owners.set(thread, [authorId, user.name]);
  
            const mentions: Mention[] = [
              { offset: 0, id: authorId, length: user.name.length + 1 }
            ];
  
            client.sendMessage(thread, `@${user.name} started a raffle. Type '/raffle join' to participate.`, {
              mentions,
            });
          }
        }

        if (flag === 'join') {
          const list = record.get(thread);
          if (list) {
            if (!list.some(([user]) => user === authorId)) {
              const user = await client.getUserInfo(authorId);

              list.push([authorId, user.name]);
            }
          }
        }

        if (flag === 'end') {
          const amount = Number.parseInt(amt);
          const owner = owners.get(thread);

          if (owner) {
            const [user, name] = owner;

            if (user === authorId) {
              const mentions: Mention[] = [
                { offset: 0, id: authorId, length: name.length + 1 }
              ];

              let result = `@${name} ended the raffle.`

              const list = record.get(thread);

              if (list) {
                if (list.length > 0) {
                  const selected = getRandomSplice(list, amount)
                    .map((value, index) => `${index + 1}. ${value[1]}`)
                    
                  if (selected.length > 0) {
                    const phrase = selected.reduce((acc, x) => `${acc}
${x}`);
                    result = `${result}

List of selected participants:
${phrase}`;
                  }
                } else {
                  result = `${result}
                  
There were no participants :/.`;
                }
              }

              await client.sendMessage(thread, result, {
                mentions,
              })

              record.delete(thread);
              owners.delete(thread);
            }
          }
        }
      }
    });
}