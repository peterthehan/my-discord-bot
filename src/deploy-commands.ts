import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";

import { DiscordCommand, REST, Routes } from "discord.js";

(async (): Promise<void> => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN,
  );

  const guildIds = process.env.GUILD_IDS?.split(",");

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    console.log("Successfully deleted all application commands.");

    await Promise.all(
      guildIds.map(async (guildId) => {
        await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          {
            body: [],
          },
        );
        console.log(
          `Successfully deleted all guild commands for guild ID ${guildId}.`,
        );
      }),
    );

    const commands = await Promise.all(
      fs
        .readdirSync("./dist/commands")
        .filter((file) => file.endsWith(".js"))
        .map(async (file) => {
          const command = (await import(
            `./commands/${file}`
          )) as DiscordCommand;
          return command.data.toJSON();
        }),
    );

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    await Promise.all(
      guildIds.map(async (guildId) => {
        const data = (await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
          { body: commands },
        )) as unknown[];
        console.log(
          `Successfully reloaded ${data.length} application (/) commands for guild ID ${guildId}.`,
        );
      }),
    );
  } catch (error) {
    console.error(error);
  }
})();
