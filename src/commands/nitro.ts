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
import { shuffleArray } from "../utils/shuffleArray";

function getAnimatedEmojisByName(
  interaction: BaseInteraction
): Collection<string, GuildEmoji> {
  return (interaction.guild?.emojis.cache ?? new Collection())
    .filter((emoji) => emoji.animated && Boolean(emoji.name))
    .reduce(
      (emojis, emoji) => emojis.set(emoji.name as string, emoji),
      new Collection()
    );
}

const optionsRange = range(1, 3);

const data = new SlashCommandBuilder()
  .setName("nitro")
  .setDescription("Send animated emojis.")
  .setDMPermission(false);

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
    const animatedEmojiNames = [...getAnimatedEmojisByName(interaction).keys()];
    const focusedValue = interaction.options.getFocused().toLowerCase();
    let filtered;
    if (focusedValue.length === 0) {
      shuffleArray(animatedEmojiNames);
      filtered = animatedEmojiNames;
    } else {
      filtered = animatedEmojiNames.filter(
        (emojiName) =>
          emojiName && emojiName.toLowerCase().includes(focusedValue)
      );
    }

    await interaction.respond(
      filtered.slice(0, 25).map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const animatedEmojis = getAnimatedEmojisByName(interaction);
    const emojis = optionsRange
      .map((i) => interaction.options.getString(`emoji-${i}`))
      .filter(Boolean) as string[];
    const mapped = emojis
      .map((emoji) => animatedEmojis.get(emoji))
      .filter(Boolean) as GuildEmoji[];

    await interaction.reply(
      mapped.length
        ? mapped.join(" ")
        : { content: "No animated emojis to send were found!", ephemeral: true }
    );
  },
};

module.exports = command;
