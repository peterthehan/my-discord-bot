import { CacheType, DiscordEvent, Events, Interaction } from "discord.js";

const event: DiscordEvent = {
  async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isAutocomplete()) {
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      command.autocomplete && (await command.autocomplete(interaction));
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`, error);
    }
  },
  name: Events.InteractionCreate,
};

module.exports = event;
