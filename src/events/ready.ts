import { Client, DiscordEvent, Events } from "discord.js";

const event: DiscordEvent = {
  async execute(client: Client): Promise<void> {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
  name: Events.ClientReady,
  once: true,
};

module.exports = event;
