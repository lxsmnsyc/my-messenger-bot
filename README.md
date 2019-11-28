# my-messenger-bot
My personal Facebook Messenger Bot

## Configure

Create a `.env` file at the root and add the fields `FB_USER` and `FB_PASS`.

### Monitoring threads

Go to `/src/threads` and the thread ids you want to watch for.

### Adding commands

To add your commands, go to `/src/commands` and follow the pattern. Commands uses the [commander](https://www.npmjs.com/package/commander) package for creating CLI.

## Building

### Installing

Yarn
```bash
yarn
``

NPM
```bash
npm install
```

### Building and running source
```
yarn build && yarn start
```

npm
```
npm run build && npm run start
```

