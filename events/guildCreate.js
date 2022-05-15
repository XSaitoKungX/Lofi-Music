const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");

module.exports = {
  name: 'guildCreate',

  async execute(guild, client) {
    const row1 = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select')
          .setPlaceholder('Nothing selected')
          .addOptions(
            {
              label: '/play',
              description: 'Starts playing Lo-fi Radio Station!',
              value: `play`
            },
            {
              label: '/radio',
              description: 'Plays the Stream from provided Radio Station!',
              value: `radio`
            },
            {
              label: '/forceplay',
              description: 'Allows you to force play the Specified Station',
              value: `forceplay`
            },
            {
              label: '/stop',
              description: 'Stops the current Voice Session',
              value: `stop`
            },
            {
              label: '/zen',
              description: 'Starts playing Zen Radio Station!',
              value: `zen`
            }
          ),
      );

    let row2 = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('play')
              .setStyle('PRIMARY')
              .setEmoji('▶️'),

            new MessageButton()
              .setStyle('LINK')
              .setURL('https://discord.io/Inferno-World')
              .setEmoji('882684602639081492'),

            new MessageButton()
              .setStyle('LINK')
              .setURL('https://discord.io/Checkpoint')
              .setEmoji('882684602639081492'),

            new MessageButton()
              .setLabel('Invite Me')
              .setStyle('LINK')
              .setURL('https://dsc.gg/lofi-world')
              .setEmoji('882683102890197062')
          )

        try {
          let defaultChannel = "";

          guild.channels.cache.forEach((channel) => {
            if (channel.type == "GUILD_TEXT" && defaultChannel == "") {
              if (channel.permissionsFor(guild.me).has("SEBD_MESSAGES")) {
                defaultChannel = channel.id;
              }
            }
          })

          let channel = guild.channels.cache.get(guild.systemChannelID || defaultChannel);
          let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("The available Commands are provided below. To view the Command Description, select the Command Name from the Select Menu provided below\n\n**Join a Voice Channel and hit the :arrow_forward: Button to start playing**\n\n**Available Commands:**\n`forceplay`, `help`, `play`, `radio`, `stop`, `zen`\n\*Note: Lofi Music uses Slash-Commands, it doesn't have a Prefix*")
            .setAuthor({
              name: "Thank you for inviting me to your Server",
              url: "https://dsc.gg/lofi-world",
              iconURL: client.user.displayAvatarURL()
            })

          channel.send({
            embeds: [embed],
            components: [ row2, row1 ]
          })
        } catch (err) {
          return;
        }
  },
};
