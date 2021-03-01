import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { Container } from 'typedi';

import env from 'utils/env';
import DiscordClientService from 'core/services/DiscordClientService';
import CommandsModule from 'core/modules/CommandsModule';
// import ServicesModule from 'core/modules/ServicesModule';

dotenv.config({
  path: path.resolve(process.cwd(), env.isDevelopment ? '.dev.env' : '.env'),
});

const app = express();
const PORT_DEFAULT = 5000;
const PORT = Number(process.env.PORT) || PORT_DEFAULT;

app.listen(PORT, () => {
  const discordBot = Container.get(DiscordClientService);
  discordBot.bootstrap();

  const commandsModule = Container.get(CommandsModule);
  commandsModule.bootstrap();

  // const servicesModule = Container.get(ServicesModule);
  // servicesModule.bootstrap();
});
