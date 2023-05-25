const { SlashCommandBuilder } = require('@discordjs/builders');
const { Promo } = require('../modals/promo');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addpromo')
    .setDescription('Add a promo to a user\'s credit')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of promo to add')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add the promo to')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user executing the command has the required role
    const requiredRoleId = '1108781726672633917'; // Replace with the actual role ID
    const hasRole = interaction.member.roles.cache.has(requiredRoleId);

    if (!hasRole) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Unauthorized')
        .setDescription('You do not have the required role to use this command.');

      return interaction.reply({ embeds: [embed] });
    }

    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');

    if (!amount) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Invalid Amount')
        .setDescription('Please provide a valid number.');

      return interaction.reply({ embeds: [embed] });
    }

    if (!user) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Invalid User')
        .setDescription('Please mention a valid user.');

      return interaction.reply({ embeds: [embed] });
    }

    try {
      const [promo, created] = await Promo.findOrCreate({
        where: { customerId: user.id },
        defaults: { amount: 0 },
      });

      const updatedAmount = promo.amount + amount;
      await promo.update({ amount: updatedAmount });

      const pluralSuffix = amount === 1 ? '' : 's';

      const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle('<:tittle:1110180039066140722> Promo Added')
        .setDescription(`Added ${amount} promo${pluralSuffix} to ${user.toString()}'s credit`)
        .addField('<:1104544414354899034:1110179258409701478> Updated Credit Balance', `${updatedAmount} credit${updatedAmount !== 1 ? 's' : ''}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error adding promo:', error);

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Error')
        .setDescription('An error occurred while adding the promo. Please try again later.');

      interaction.reply({ embeds: [embed] });
    }
  },
};
