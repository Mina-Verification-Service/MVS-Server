## How to build

1. Clone this git repository and change to the oracle directory

```bash
git clone https://github.com/t4top/mina-wordle-game.git
cd mina-wordle-game/oracle
```

2. Install project dependencies

```bash
npm install
```

3. For local development, start a development server.

```bash
npm run dev
```

4. Open a browser and navigate to `localhost:3000/wordle` to get a JSON response from the server.

## Launch the server for production

Run below command to start the oracle server as a background service.

```bash
npm start
```

To stop the server, run below command.

```bash
npm stop
```
