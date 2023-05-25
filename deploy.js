const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const settings = require('./settings.json');

// Update the following two lines with your own bot token and the guild ID you want to deploy the commands to
const token = settings.token;
const guildId = settings.guildId;

const commands = [];
const commandFolders = ['commands'];

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const command = require(`./${folder}/${file}`);
    
    if (command.data) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`Command data not found in file: ${file}`);
    }
  }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(settings.clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
    console.log('Registered commands:', commands);
  } catch (error) {
    console.error(error);
  }
})();
