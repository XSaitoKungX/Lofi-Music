const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client, player) {

    // If the Command is ran in a DM, ignore it
    // You can make it send nothing but that will create "interaction failed" Error Message
    if (!interaction.inGuild())
    return interaction.reply({
      content: "The Commands don't work via DM. What pitty :joy:",
      ephemeral: true
    });

    // Button response in the Help Menu
    if (interaction.isButton()) {
      if (interaction.customId === 'play') {
        client.func.play(interaction, Data.now() % 2 === 0 ? process.env.LOFI_1 : process.env.LOFI_2, 'Lo-fi Beats')
      } else return;
    }

    // Select Menu response
    if (interaction.isSelectMenu) {

      if (interaction.customId === 'select') {
        let desc
        switch (interaction.values[0]) {
          case `play`:
            desc = ['Starts playing Lo-fi Radio Station!']
            break;

          case 'radio':
            desc = ['Plays the Stream from provided Radio Station!', 'Station', 'The Name of the Station to play', true]
            break;

          case 'forceplay':
            desc = ['Allows you to force play the specified Radio Station', 'Station', 'The Name of the Station to play', false]
            break;

          case 'stop':
            desc = ['Stops the current Voice Session!']
            break;

          case 'zen':
            desc = ['Starts playing Zen Radio Station']
            break;
        }

        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor({
            name: "Lofi Music's Help Menu",
            iconURL: client.user.displayAvatarURL()
          })
          .setTitle(`/${interaction.values[0]}`)
          .setDescription(`${desc[0]}\n\n**Options**\n${desc.length == 1 ? "*Does't contain any Options*" : `${desc[1]}\` - ${desc[2]} - ${desc[3] ? "Required" : "Optional"}`}`)
          .setFooter({
            text: 'Lofi Music',
            iconURL: client.user.displayAvatarURL()
          })
          .setTimestamp()

        interaction.reply({
          embeds: [embed],
          ephemeral: true
        })
      }
    }

    // If not a Slash-Command, return
    if (!interaction.isCommand())
    return;

    const command = client.commands.get(interaction.commandName);

    if (!command)
    return;

    // Execution and Error Handling
    try {
      await command.execute(interaction, client, player);
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "There was an Error while executing this Command!",
        ephemeral: true
      });
    };
  },
};
