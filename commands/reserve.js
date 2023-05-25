const { SlashCommandBuilder } = require('@discordjs/builders');
const ReservedSlot = require('../modals/reserved'); // Import the ReservedSlot model

const { Promo, sequelize } = require('../modals/promo'); // Import the Promo model and sequelize instance

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reservepromo')
    .setDescription('Reserves a promo slot')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('The name of the server')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('The promo slot number')
        .setRequired(true)),

  async execute(interaction) {
    const server = interaction.options.getString('server');
    const number = interaction.options.getInteger('number');
    const customerId = interaction.user.id; // Assuming `interaction.user.id` contains the customer ID

    // Check if the server and number are valid
    if (!server || !number || number < 1 || number > 7) {
      return await interaction.reply('Invalid server or number. Please provide a valid server name and a number between 1 and 7.');
    }

    // Check if the number is already reserved
    const existingReservation = await ReservedSlot.findOne({ where: { number } });

    if (existingReservation) {
      return await interaction.reply('The selected time slot is already reserved.');
    }

    // Check if the user has at least 1 promo credit
    const promo = await Promo.findOne({ where: { customerId } });

    if (!promo || promo.amount < 1) {
      return await interaction.reply('You do not have enough promo credits to reserve a slot.');
    }

    // Reserve the promo slot
    await ReservedSlot.create({
      server,
      number,
      userId: customerId,
    });

    // Deduct one promo credit
    promo.amount -= 1;
    await promo.save();

    await interaction.reply(`Promo slot ${number} reserved for server ${server}.`);
  },
};