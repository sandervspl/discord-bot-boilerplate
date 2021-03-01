import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { Container } from 'typedi';

import env from 'helpers/env';
import CommandServices from 'commands/services';
import DiscordBot from 'DiscordBot';

dotenv.config({
  path: path.resolve(process.cwd(), env.isDevelopment ? '.dev.env' : '.env'),
});

const app = express();
const PORT_DEFAULT = 5000;
const PORT = Number(process.env.PORT) || PORT_DEFAULT;

app.listen(PORT, () => {
  const discordBot = Container.get(DiscordBot);
  discordBot.bootstrap();

  const commandsService = Container.get(CommandServices);
  commandsService.bootstrap();
});
