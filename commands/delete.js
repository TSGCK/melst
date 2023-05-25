const { SlashCommandBuilder } = require('@discordjs/builders');
const { Promo } = require('../modals/promo');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearpromo')
    .setDescription('Delete a user\'s promo entry from the database')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose promo entry to delete')
        .setRequired(true)
    ),
    async execute(interaction) {
      const allowedRoleId  = '964273671977992202'; // Replace with the actual role ID
      const allowedUserId = '539606847791955968'; // Replace with the actual user ID

      console.log('Interaction User ID:', interaction.user.id);
      console.log('Allowed User ID:', allowedUserId);
      console.log('Allowed Role ID:', allowedRoleId);
    
      // Check if the user executing the command has the allowed role or is the allowed user
      const hasRole = interaction.member.roles.cache.has(allowedRoleId);
      const isAllowedUser = interaction.user.id === allowedUserId;
    
      console.log('Has Role:', hasRole);
      console.log('Is Allowed User:', isAllowedUser);
    
      if (!hasRole && !isAllowedUser) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('<:tittle:1110180039066140722> Unauthorized')
          .setDescription('You do not have the required role or permission to use this command.');
    
        return interaction.reply({ embeds: [embed] });
      }
    const user = interaction.options.getUser('user');

    try {
      // Find the promo entry by customerId (user ID)
      const promo = await Promo.findOne({ where: { customerId: user.id } });

      if (!promo) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('<:tittle:1110180039066140722> Error')
          .setDescription(`${user.toString()} doesn't have any promotion credits!`);

        return interaction.reply({ embeds: [embed] });
      }

      // Delete the promo entry
      await promo.destroy();

      const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle('<:tittle:1110180039066140722> Promotion Credits Cleared')
        .setDescription(`Promotion credits for ${user.toString()} have been cleared.`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error deleting promotion:', error);

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Error')
        .setDescription('An error occurred. Please try again later.');

      interaction.reply({ embeds: [embed] });
    }
  },
};
