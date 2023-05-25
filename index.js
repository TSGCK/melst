const { Client, Intents, Collection, CommandInteraction } = require('discord.js');
const fs = require('fs');
const path = require('path');
const settings = require('./settings.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Set bot status
  client.user.setPresence({
    activities: [{ name: "Mels's Assistant" }],
    status: 'online'
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    console.log(`Executing command: ${commandName}`);
    await command.execute(interaction);
    console.log(`Command executed successfully: ${commandName}`);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(settings.token);
