const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ReservedPromo = require('../modals/reserved');

let message; // Variable to store the message object

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Shows the promo schedule'),

  async execute(interaction) {
    try {
      const timeSlots = ['11am CET', '1pm CET', '3pm CET', '5pm CET', '7pm CET', '9pm CET', '11pm CET'];

      // Create a function to generate the promo schedule embed
      const generatePromoScheduleEmbed = async () => {
        // Retrieve the reserved promos from the database
        const reservedPromos = await ReservedPromo.findAll();

        // Create the response embed
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('<:tittle:1110180039066140722> Promo Schedule')
          .setDescription('Promo schedule for today:');

        // Generate the schedule string
        let schedule = '';
        timeSlots.forEach((timeSlot, index) => {
          const reservedPromo = reservedPromos.find(promo => promo.number === index + 1);
          const server = reservedPromo ? reservedPromo.server : '';
          if (server !== '') {
            schedule += `${index + 1}. ${timeSlot} - ${server}\n`;
          } else {
            schedule += `${index + 1}. ${timeSlot}\n`;
          }
        });

        // Add the schedule string as a field to the embed
        embed.addField('Promo Slots', schedule || 'No reserved promos');

        return embed;
      };

      // Generate the initial promo schedule embed
      const embed = await generatePromoScheduleEmbed();

      if (!message) {
        // Send the initial embed to the channel
        message = await interaction.channel.send({ embeds: [embed] });
      } else {
        // Edit the existing message with the updated embed
        await message.edit({ embeds: [embed] });
      }

      // Set up an event listener for new reserved promos
      ReservedPromo.afterCreate(async () => {
        // Generate the updated promo schedule embed
        const updatedEmbed = await generatePromoScheduleEmbed();

        // Edit the original message with the updated embed
        await message.edit({ embeds: [updatedEmbed] });
      });

      // Set up an event listener for cleared database
      ReservedPromo.afterBulkDestroy(async () => {
        // Generate the empty schedule embed
        const emptyEmbed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('<:tittle:1110180039066140722> Promo Schedule')
          .setDescription('Promo schedule for today:')
          .addField('Promo Slots', 'No reserved promos');

        // Edit the original message with the empty embed
        await message.edit({ embeds: [emptyEmbed] });
      });
    } catch (error) {
      console.error('Error fetching promo schedule:', error);

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:tittle:1110180039066140722> Error')
        .setDescription('An error occurred while fetching the promo schedule. Please try again later.');

      await interaction.channel.send({ embeds: [embed] });
    }
  },
};
