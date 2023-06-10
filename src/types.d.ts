import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  Collection,
  SlashCommandBuilder,
} from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      DISCORD_BOT_TOKEN: string;
      GUILD_IDS: string;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, DiscordCommand>;
  }

  export interface DiscordEvent {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => Promise<void>;
    name: keyof ClientEvents;
    once?: boolean;
  }

  export interface DiscordCommand {
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
}
