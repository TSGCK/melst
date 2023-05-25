const { SlashCommandBuilder } = require('@discordjs/builders');
const { Promo } = require('../modals/promo');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('promos')
    .setDescription('Shows the promo credits for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check promo credits for')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check user roles
    const requiredRoleId = '1108781726672633917';
    const member = interaction.member;
    const hasRole = member.roles.cache.has(requiredRoleId);

    if (!hasRole) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Permission Denied')
        .setDescription('You do not have permission to use this command.');

      return interaction.reply({ embeds: [embed] });
    }

    const user = interaction.options.getUser('user');

    if (!user) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Invalid User')
        .setDescription('Please mention a valid user.');

      return interaction.reply({ embeds: [embed] });
    }

    try {
      const promo = await Promo.findOne({ where: { customerId: user.id } });

      if (!promo) {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('<:tittle:1110180039066140722> Promo Credits')
          .setDescription(`${user.toString()} has no promo credits.`);

        return interaction.reply({ embeds: [embed] });
      }

      const embed = new MessageEmbed()
        .setColor('#00ff00')
        .setTitle('<:tittle:1110180039066140722> Promo Credits')
        .setDescription(`${user.toString()} has ${promo.amount} promo credit${promo.amount !== 1 ? 's' : ''}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching promo credits:', error);

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Error')
        .setDescription('An error occurred while fetching promo credits. Please try again later.');

      interaction.reply({ embeds: [embed] });
    }
  },
};
