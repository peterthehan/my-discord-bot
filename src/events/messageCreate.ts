import { DiscordEvent, Events, Message } from "discord.js";

const reactionMap = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣"];

const event: DiscordEvent = {
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    if (
      message.embeds.length === 0 ||
      !message.content.includes("https://twitter.com/")
    ) {
      return;
    }

    const embed = message.embeds[0].data;
    const reaction =
      reactionMap[
        "image" in embed || "video" in embed ? message.embeds.length : 0
      ];
    await message.react(reaction);
  },
};

module.exports = event;
