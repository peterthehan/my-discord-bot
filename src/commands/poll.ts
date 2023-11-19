import {
  ChatInputCommandInteraction,
  DiscordCommand,
  SlashCommandBuilder,
} from "discord.js";

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a simple poll for Yes/No questions.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("A Yes/No question to poll")
        .setRequired(true),
    )
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);
    const response = await interaction.reply({ content: question });
    const message = await response.fetch();
    ["👍", "👎"].forEach(async (emoji) => await message.react(emoji));
  },
};

module.exports = command;
