import { Client, DiscordEvent, Events } from "discord.js";

const event: DiscordEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  },
};

module.exports = event;
