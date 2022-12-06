import {
  AutocompleteInteraction,
  BaseInteraction,
  ChatInputCommandInteraction,
  Collection,
  DiscordCommand,
  GuildEmoji,
  SlashCommandBuilder,
} from "discord.js";

import { range } from "../utils/range";

function getAnimatedEmojis(
  interaction: BaseInteraction
): Collection<string, GuildEmoji> {
  return (
    interaction.guild?.emojis.cache.filter(
      (emoji) => emoji.animated && Boolean(emoji.name)
    ) ?? new Collection()
  );
}

const optionsRange = range(1, 3);

const data = new SlashCommandBuilder()
  .setName("nitro")
  .setDescription("Send animated emoji(s).");

optionsRange.forEach((i) => {
  data.addStringOption((option) => {
    if (i === 1) {
      option.setRequired(true);
    }

    return option
      .setName(`emoji-${i}`)
      .setDescription(`Animated emoji ${i}`)
      .setAutocomplete(true);
  });
});

const command: DiscordCommand = {
  data,
  async autocomplete(interaction: AutocompleteInteraction) {
    const animatedEmojis = getAnimatedEmojis(interaction);
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = animatedEmojis
      .filter(
        (emoji) => emoji.name && emoji.name.toLowerCase().includes(focusedValue)
      )
      .map((emoji) => emoji.name)
      .slice(0, 25) as string[];

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const animatedEmojis = getAnimatedEmojis(interaction);
    const emojis = optionsRange
      .map((i) => interaction.options.getString(`emoji-${i}`))
      .filter(Boolean) as string[];
    const mapped = emojis.map(
      (emoji) =>
        animatedEmojis.find(
          (animatedEmoji) => animatedEmoji.name === emoji
        ) as GuildEmoji
    );

    await interaction.reply(mapped.join(" "));
  },
};

module.exports = command;
