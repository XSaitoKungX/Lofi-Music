const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zen')
    .setDescription('Starts playing Zen Radio Station'),

  async execute(interaction, client) {
    client.func.play(interaction, process.env.ZEN, `Zen Radio`, false)
  },
};
