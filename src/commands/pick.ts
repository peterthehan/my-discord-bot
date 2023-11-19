import {
  ChatInputCommandInteraction,
  DiscordCommand,
  SlashCommandBuilder,
} from "discord.js";

import { getRandomInt } from "../utils/getRandomInt";
import { range } from "../utils/range";

const optionsRange = range(1, 25);

const data = new SlashCommandBuilder()
  .setName("pick")
  .setDescription("Pick one item at random from a list of items.");

optionsRange.forEach((i) => {
  data.addStringOption((option) => {
    if (i <= 2) {
      option.setRequired(true);
    }

    return option.setName(`item-${i}`).setDescription(`Item ${i}`);
  });
});

const command: DiscordCommand = {
  data,
  async execute(interaction: ChatInputCommandInteraction) {
    const items = optionsRange
      .map((i) => interaction.options.getString(`item-${i}`))
      .filter(Boolean) as string[];
    const selectedItem = items[getRandomInt(0, items.length)];
    const selectedCount = items.filter(
      (item) => item.toLowerCase() === selectedItem.toLowerCase(),
    ).length;
    const probability = `${selectedCount} / ${items.length} = ${Math.round(
      (selectedCount / items.length) * 100,
    )}%`;

    await interaction.reply(`I pick... **${selectedItem}**\n(${probability})`);
  },
};

module.exports = command;
