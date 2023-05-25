const { SlashCommandBuilder } = require('@discordjs/builders');
const ReservedPromo = require('../modals/reserved');

const allowedUserIds = ['539606847791955968']; // Replace 'YOUR_USER_ID' with your own Discord user ID
const allowedRoleIds = ['964273671977992202', '1079377056783155250']; // Replace 'ROLE_ID_1', 'ROLE_ID_2' with the role IDs that are allowed to use this command

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetdatabase')
    .setDescription('Resets the promo database'),

  async execute(interaction) {
    try {
      // Check if the user is allowed to use this command
      const userId = interaction.user.id;
      const memberRoles = interaction.member.roles.cache;
      
      if (!allowedUserIds.includes(userId) && !memberRoles.some(role => allowedRoleIds.includes(role.id))) {
        return interaction.reply('You do not have permission to use this command.');
      }

      // Delete all records from the ReservedPromo table
      await ReservedPromo.destroy({ truncate: true });

      interaction.reply('The promo database has been reset.');
    } catch (error) {
      console.error('Error resetting the promo database:', error);
      interaction.reply('An error occurred while resetting the promo database. Please try again later.');
    }
  },
};