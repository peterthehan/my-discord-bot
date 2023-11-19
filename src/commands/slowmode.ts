import {
  ChatInputCommandInteraction,
  DiscordCommand,
  GuildTextBasedChannel,
  SlashCommandBuilder,
} from "discord.js";

const MIN_DELAY_IN_SECONDS = 0;
const MAX_DELAY_IN_SECONDS = 21_600; // 6 hours

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set the message rate limit for this channel.")
    .addIntegerOption((option) =>
      option
        .setName("delay")
        .setDescription("The new rate limit in seconds")
        .setRequired(true)
        .setMinValue(MIN_DELAY_IN_SECONDS)
        .setMaxValue(MAX_DELAY_IN_SECONDS),
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const delay = interaction.options.getInteger("delay", true);
    await (interaction.channel as GuildTextBasedChannel).setRateLimitPerUser(
      delay,
    );
    await interaction.reply({
      content: `Slowmode set to ${delay}s.`,
      ephemeral: true,
    });
  },
};

module.exports = command;
