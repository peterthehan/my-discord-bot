import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
import path from "node:path";

import {
  Client,
  Collection,
  DiscordCommand,
  DiscordEvent,
  GatewayIntentBits,
} from "discord.js";

import("./utils/keepAlive");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// load commands
(async (): Promise<void> => {
  client.commands = new Collection();
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)) as DiscordCommand;
    client.commands.set(command.data.name, command);
  }
})();

// load events
(async (): Promise<void> => {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(filePath)) as DiscordEvent;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
})();

client.login(process.env.DISCORD_BOT_TOKEN);
