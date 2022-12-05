import {
  ChatInputCommandInteraction,
  DiscordCommand,
  GuildTextBasedChannel,
  SlashCommandBuilder,
} from "discord.js";

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set the rate limit per user for this channel.")
    .addIntegerOption((option) =>
      option
        .setName("delay")
        .setDescription("The new rate limit in seconds")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const delay = interaction.options.getInteger("delay", true);
    await (interaction.channel as GuildTextBasedChannel).setRateLimitPerUser(
      delay
    );
    await interaction.reply({
      content: `Slowmode set to ${delay}s.`,
      ephemeral: true,
    });
  },
};

module.exports = command;
