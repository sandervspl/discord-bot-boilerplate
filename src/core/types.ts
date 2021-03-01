import Discord from 'discord.js';

export type CommandCallback = (msg: Discord.Message, args: string[]) => void;

export type ListenFn = (msg: Discord.Message, trimmedMsg: string) => boolean | Promise<boolean>;

export type Options = {
  prefix?: string;
  cooldown?: number;
  roles?: string[];
  channels?: string[];
}
