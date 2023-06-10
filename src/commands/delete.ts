import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection,
  ComponentType,
  DiscordCommand,
  Message,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

const MIN_MESSAGE_DELETE_COUNT = 2;
const MAX_MESSAGE_DELETE_COUNT = 32;
const MESSAGE_FETCH_LIMIT = Math.min(MAX_MESSAGE_DELETE_COUNT * 2, 100);
const MESSAGE_COLLECTOR_TIMER_IN_MILLISECONDS = 30_000; // 30 seconds

async function getFilteredMessages(
  interaction: ChatInputCommandInteraction
): Promise<Message[]> {
  const user = interaction.options.getUser("user");
  const count = interaction.options.getInteger("count", true);

  const messageCollection = (await interaction.channel?.messages.fetch({
    limit: MESSAGE_FETCH_LIMIT,
  })) as Collection<string, Message<true>>;

  if (user !== null) {
    messageCollection.sweep((message) => message.author.id !== user.id);
  }

  return Array.from(messageCollection.values()).slice(0, count);
}

function getButtonRow(): ActionRowBuilder<ButtonBuilder> {
  const cancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Secondary);
  const deleteButton = new ButtonBuilder()
    .setCustomId("delete")
    .setLabel("Delete")
    .setStyle(ButtonStyle.Danger);
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    cancelButton,
    deleteButton
  );
}

const command: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete messages in this channel using search options.")
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("The number of messages to delete")
        .setRequired(true)
        .setMinValue(MIN_MESSAGE_DELETE_COUNT)
        .setMaxValue(MAX_MESSAGE_DELETE_COUNT)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose messages should be deleted")
    )
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");

    const messages = await getFilteredMessages(interaction);
    const latestMessage = messages[0];
    const oldestMessage = messages[messages.length - 1];

    const embeds = [
      {
        description:
          user === null
            ? `Are you sure you want to delete ${messages.length} messages?`
            : `Are you sure you want to delete ${messages.length} messages from ${user}?`,
        fields: [
          {
            inline: true,
            name: "Oldest",
            value: oldestMessage.url,
          },
          {
            inline: true,
            name: "Latest",
            value: latestMessage.url,
          },
        ],
      },
    ];
    const response = await interaction.reply({
      components: [getButtonRow()],
      embeds,
      ephemeral: true,
    });

    const updatePayload = { components: [], embeds };

    try {
      const confirmation =
        await response.awaitMessageComponent<ComponentType.Button>({
          filter: (i: { user: { id: string } }) =>
            i.user.id === interaction.user.id,
          time: MESSAGE_COLLECTOR_TIMER_IN_MILLISECONDS,
        });

      switch (confirmation.customId) {
        case "delete": {
          const deletedMessages = await (
            interaction.channel as TextChannel
          ).bulkDelete(messages);
          updatePayload.embeds[0] = {
            description: `${deletedMessages.size} messages have been deleted!`,
            fields: [],
          };
          break;
        }
        case "cancel": {
          updatePayload.embeds[0] = {
            ...updatePayload.embeds[0],
            description: "Canceled.",
          };
          break;
        }
      }
    } catch {
      updatePayload.embeds[0] = {
        ...updatePayload.embeds[0],
        description: "Canceled due to inactivity.",
      };
    }

    await response.edit(updatePayload);
  },
};

module.exports = command;
