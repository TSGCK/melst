const { SlashCommandBuilder } = require('@discordjs/builders');
const { Promo } = require('../modals/promo');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removepromo')
    .setDescription('Remove a specified amount of points from a user\'s promo entry')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of points to remove')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove points from')
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

    try {
      const promo = await Promo.findOne({ where: { customerId: user.id } });

      if (!promo) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('<:tittle:1110180039066140722> Error')
          .setDescription('Promo entry not found for the specified user.');

        return interaction.reply({ embeds: [embed] });
      }

      const updatedAmount = promo.amount - amount;

      if (updatedAmount < 0) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('<:tittle:1110180039066140722> Error')
          .setDescription('The specified amount exceeds the current points balance.');

        return interaction.reply({ embeds: [embed] });
      }

      await promo.update({ amount: updatedAmount });

      const pluralSuffix = amount === 1 ? '' : 's';

      const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle('<:tittle:1110180039066140722> Credit Removed')
        .setDescription(`Removed ${amount} credit${pluralSuffix} from ${user.toString()}'s balance`)
        .addField('<:1104544414354899034:1110179258409701478> Updated Credit Balance', `${updatedAmount} credit${updatedAmount !== 1 ? 's' : ''}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error removing points:', error);

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Error')
        .setDescription('An error occurred while removing credits from the promo entry. Please try again later.');

      interaction.reply({ embeds: [embed] });
    }
  },
};
