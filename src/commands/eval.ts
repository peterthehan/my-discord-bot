import {
  ChatInputCommandInteraction,
  DiscordCommand,
  SlashCommandBuilder,
} from "discord.js";
import prettier from "prettier";

async function tryCatch(
  callback: () => Promise<string>,
  errorOverride = "",
): Promise<string> {
  try {
    return (await callback()).toString();
  } catch (error) {
    return errorOverride ? errorOverride : (error as Error).toString();
  }
}

function wrapCodeBlocks(code: string, language = ""): string {
  return "```" + `${language}\n${code}` + "```";
}

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate JavaScript code.")
    .addStringOption((option) =>
      option
        .setName("script")
        .setDescription(
          "A string representing a JavaScript expression, statement, or sequence of statements",
        )
        .setRequired(true),
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const script = interaction.options.getString("script", true);

    const input = await tryCatch(
      () => prettier.format(script, { parser: "babel" }),
      script,
    );
    const output = await tryCatch(() => eval(input));

    await interaction.reply({ content: wrapCodeBlocks(input, "js") });
    await interaction.followUp({ content: wrapCodeBlocks(output) });
  },
};

module.exports = command;
