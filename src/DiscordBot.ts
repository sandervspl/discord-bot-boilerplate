import Discord from 'discord.js';
import { Service } from 'typedi';

@Service()
export default class DiscordBot {
  readonly client = new Discord.Client();

  bootstrap() {
    this.client.login(process.env.BOT_TOKEN);

    this.client.on('ready', () => {
      console.info('Discord bot activated.');

      if (this.client.user) {
        this.client.user.setStatus('online');
        this.client.user.setPresence({
          activity: {
            name: '!commands',
            type: 'LISTENING',
          },
        });
      }
    });
  }
}
