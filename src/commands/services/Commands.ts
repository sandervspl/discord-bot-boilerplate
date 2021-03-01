import fs from 'fs';
import { Service } from 'typedi';

import DiscordCommand, { DiscordCommandService } from 'commands/Command';

@Service()
export default class Commands {
  readonly excludedCommands = ['commands'];

  readonly commandNames = fs.readdirSync(__dirname)
    .map((filename) => filename.toLowerCase().replace(/.[jt]sx?/, ''))
    .filter((name) => !name.includes('index'))
    .filter((name) => !this.excludedCommands.includes(name));

  constructor(
    @DiscordCommand('commands', { prefix: '!' }) private command: DiscordCommandService,
  ) {
    this.command.onCommand((msg) => {
      if (this.commandNames.length > 0) {
        msg.channel.send(`Available commands: ${this.commandNames.join(', ')}`);
      }
    });
  }
}
