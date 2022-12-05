import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";

import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

(async (): Promise<void> => {
  const commands = [];

  const commandFiles = fs
    .readdirSync("./dist/commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: [],
      }
    );
    console.log("Successfully deleted all guild commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    console.log("Successfully deleted all application commands.");

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    )) as unknown[];
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
