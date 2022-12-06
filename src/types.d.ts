import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string;
      CLIENT_ID: string;
      GUILD_ID: string;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, DiscordCommand>;
  }

  export interface DiscordEvent {
    name: keyof ClientEvents;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (...args: any[]) => Promise<void>;
  }

  export interface DiscordCommand {
    data:
      | SlashCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder
      | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  }
}
