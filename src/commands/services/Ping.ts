import { Service } from 'typedi';

import DiscordCommand, { DiscordCommandService } from 'commands/Command';


@Service()
export default class Ping {
  constructor(
    @DiscordCommand('ping', { prefix: '!' }) private command: DiscordCommandService,
  ) {
    this.command.onCommand((msg) => {
      msg.channel.send('Pong!');
    });
  }
}
