import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import DiscordBot from 'DiscordBot';
import env from 'helpers/env';

dotenv.config({
  path: path.resolve(process.cwd(), env.isDevelopment ? '.dev.env' : '.env'),
});

const app = express();
const PORT_DEFAULT = 5000;
const PORT = Number(process.env.PORT) || PORT_DEFAULT;

app.listen(PORT, () => {
  new DiscordBot();
});
