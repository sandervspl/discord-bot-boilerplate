import Discord from 'discord.js';

import Command from 'commands/Command';

export class Ping extends Command {
  constructor(discordClient: Discord.Client) {
    super(
      discordClient,
      'ping',
      {
        prefix: '!',
      },
    );

    this.onCommand((msg) => {
      msg.channel.send('Pong!');
    });
  }
}
