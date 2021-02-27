import Discord from 'discord.js';
import moment from 'moment';
import _ from 'lodash';
import { O } from 'ts-toolbelt';
import { Options, CommandCallback } from './types';

type ListenFn = (msg: Discord.Message, trimmedMsg: string) => boolean | Promise<boolean>;

export default abstract class Command {
  private cooldowns = new Discord.Collection();
  protected readonly options: O.Required<Options, 'cooldown'> = {
    cooldown: 3000,
  };

  constructor(
    protected readonly client: Discord.Client,
    readonly listen: string | ListenFn,
    options?: Options,
  ) {
    this.options = {
      ...this.options,
      ...options,
    };
  }


  protected onCommand = (cb: CommandCallback) => this.client.on('message', async (msg) => {
    // Clean up message
    const content = msg.content
      .toLowerCase()
      .trim();

    let message = content;

    // Check if message starts with the command prefix
    if (this.options.prefix) {
      if (!message.startsWith(this.options.prefix)) {
        return;
      }

      // Remove prefix
      message = content.slice(1);
    }

    // Check if the message we received is the same as what we listen to
    let match = false;

    if (typeof this.listen === 'function') {
      match = await this.listen(msg, message);
    }

    if (typeof this.listen == 'string') {
      match = message.startsWith(this.listen);
    }

    if (match) {
      // Channel check
      if (this.options.channels && this.options.channels.length > 0) {
        if (!this.options.channels.includes(msg.channel.id)) {
          if (this.options.prefix && msg.author.id !== process.env.BOT_ID) {
            msg.author.send('This command does not work in this channel.');
            console.error({
              listen: this.listen,
              msgContent: msg.content,
              message,
              author: msg.author,
              channels: this.options.channels,
              channel: msg.channel.id,
            });
          }

          return;
        }
      }

      const hasRole = await this.hasRequiredRole(msg);

      if (!hasRole) {
        if (this.options.prefix && msg.author.id !== process.env.BOT_ID) {
          console.error('Error (Command): Incorrect permissions.');
          console.error({
            listen: this.listen,
            msgContent: msg.content,
            message,
            author: msg.author,
            hasRole,
          });

          msg.author.send('You do not have the permissions for this command.');
        }

        return;
      }

      if (this.cooldowns.has(this.listen)) {
        if (this.options.prefix && msg.author.id !== process.env.BOT_ID) {
          msg.author.send('This command is on cooldown. Please wait and then try again.');
          console.error({
            listen: this.listen,
            msgContent: msg.content,
            message,
            author: msg.author,
            cooldowns: this.cooldowns,
          });
        }

        return;
      }

      cb(msg, this.getArgs(msg.content));

      this.startCooldown();
    }
  });

  protected getArgs = (content: string): string[] => {
    return content.split(' ').slice(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected onError = (msg: Discord.Message) => {
    msg.channel.send('Oops, something went wrong. 🤖 The server admin has been notified.');
    console.error({
      listen: this.listen,
      msgContent: msg.content,
      author: msg.author,
      channels: this.options.channels,
      msg,
    });
  }

  protected sendDMToAdmin = (...messages: (string | undefined)[]) => {
    this.client.users.fetch(process.env.ADMIN_ID!).then((user) => {
      user.send(messages.join('\n'));
    });
  }


  private hasRequiredRole = async (msg: Discord.Message): Promise<boolean> => {
    if (this.options.roles && msg.guild) {
      const member = await msg.guild.members.fetch(msg.author.id);

      if (!member) {
        return false;
      }

      const memberRoleIds = member.roles.cache.map((role) => role.id);
      const hasRequiredRole = _.intersection(this.options.roles, memberRoleIds).length > 0;

      return hasRequiredRole;
    }

    return true;
  }

  private startCooldown = (): void => {
    const now = moment();

    this.cooldowns.set(this.listen, now);

    setTimeout(() => this.cooldowns.delete(this.listen), this.options.cooldown);
  }
}
