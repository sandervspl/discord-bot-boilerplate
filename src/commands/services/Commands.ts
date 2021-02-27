import Discord from 'discord.js';

import Command from 'commands/Command';

import commands from '.';

export class Commands extends Command {
  readonly excludedCommands = ['commands'];

  readonly commandNames = commands
    .map((cmd) => cmd.name.toLowerCase())
    .filter((cmd) => !this.excludedCommands.includes(cmd));

  constructor(discordClient: Discord.Client) {
    super(
      discordClient,
      'commands',
      {
        prefix: '!',
      },
    );

    this.onCommand((msg) => {
      if (this.commandNames.length > 0) {
        msg.channel.send(`Available commands: ${this.commandNames.join(', ')}`);
      }
    });
  }
}
