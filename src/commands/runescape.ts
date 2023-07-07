import {
  ChatInputCommandInteraction,
  DiscordCommand,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import getRuneScapeText from "runescape-text";

const MAX_MESSAGE_LENGTH = 280;
const MAX_PATTERN_LENGTH = 8;
const WIDTH = 35;
const PADDING_TOP = 8;
const PADDING_RIGHT = 8;
const PADDING_BOTTOM = 8;
const PADDING_LEFT = 8;

function applyCommonRequiredSubcommandOptions(
  subcommand: SlashCommandSubcommandBuilder
) {
  return subcommand.addStringOption((option) =>
    option
      .setName("message")
      .setDescription(
        "The message to convert to a text image with RuneScape chat effects"
      )
      .setRequired(true)
      .setMaxLength(MAX_MESSAGE_LENGTH)
  );
}

function applyCommonOptionalSubcommandOptions(
  subcommand: SlashCommandSubcommandBuilder
) {
  return subcommand
    .addStringOption((option) =>
      option
        .setName("motion")
        .setDescription("Motion effect to apply to the message")
        .addChoices(
          { name: "scroll", value: "scroll" },
          { name: "shake", value: "shake" },
          { name: "slide", value: "slide" },
          { name: "wave", value: "wave" },
          { name: "wave2", value: "wave2" }
        )
    )
    .addBooleanOption((option) =>
      option.setName("spoiler").setDescription("Send text image as a spoiler")
    );
}

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("runescape")
    .setDescription("Convert text to a text image with RuneScape chat effects.")
    .addSubcommand((subcommand) => {
      applyCommonRequiredSubcommandOptions(subcommand)
        .setName("default")
        .setDescription("Use a color effect")
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Color effect to apply to the message")
            .addChoices(
              { name: "flash1", value: "flash1" },
              { name: "flash2", value: "flash2" },
              { name: "flash3", value: "flash3" },
              { name: "glow1", value: "glow1" },
              { name: "glow2", value: "glow2" },
              { name: "glow3", value: "glow3" },
              { name: "cyan", value: "cyan" },
              { name: "green", value: "green" },
              { name: "purple", value: "purple" },
              { name: "rainbow", value: "rainbow" },
              { name: "red", value: "red" },
              { name: "white", value: "white" },
              { name: "yellow", value: "yellow" }
            )
        );
      return applyCommonOptionalSubcommandOptions(subcommand);
    })
    .addSubcommand((subcommand) => {
      applyCommonRequiredSubcommandOptions(subcommand)
        .setName("pattern")
        .setDescription("Use a pattern effect")
        .addStringOption((option) =>
          option
            .setName("pattern")
            .setDescription("Pattern effect to apply to the message")
            .setRequired(true)
            .setMaxLength(MAX_PATTERN_LENGTH)
        );
      return applyCommonOptionalSubcommandOptions(subcommand);
    })
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString("message", true);
    const color = interaction.options.getString("color");
    const pattern = interaction.options.getString("pattern");
    const motion = interaction.options.getString("motion");
    const spoiler = interaction.options.getBoolean("spoiler");

    await interaction.deferReply();

    const options = {
      maxMessageLength: MAX_MESSAGE_LENGTH,
      paddingBottom: PADDING_BOTTOM,
      paddingLeft: PADDING_LEFT,
      paddingRight: PADDING_RIGHT,
      paddingTop: PADDING_TOP,
    };
    const wordWrapOptions = { width: WIDTH };

    try {
      const { data, extension } = getRuneScapeText(
        [color, pattern && `pattern${pattern}`, motion, message]
          .filter(Boolean)
          .join(":"),
        options,
        wordWrapOptions
      );
      const name =
        spoiler === true ? `SPOILER_image.${extension}` : `image.${extension}`;

      await interaction.editReply({
        files: [{ attachment: Buffer.from(data), name }],
      });
    } catch {
      await interaction.editReply({ content: "Invalid message, try again." });
    }
  },
};

module.exports = command;
