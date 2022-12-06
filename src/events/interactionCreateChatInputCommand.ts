import { CacheType, DiscordEvent, Events, Interaction } from "discord.js";

const event: DiscordEvent = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction<CacheType>): Promise<void> {
    if (!interaction.isChatInputCommand()) {
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
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`, error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};

module.exports = event;
