const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forceplay')
    .setDescription('Allows you to force play the Specified Station')
    .addStringOption((option) => option
      .setName('station')
      .setDescription('Name of the Radio Station')
      .setRequired(false),
    ),
    
  async execute(interaction, client) {
    // If not in Voice Channel, return Error
    if (!interaction.member.voice.channelId)
    return interaction.reply({
      content: "Your aren't in a Voice Channel!",
      ephemeral: true
    });

    // If not in a same Voice Channel, return Error
    else if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.member.voice.channelId)
    return interaction.reply({
      content: "You aren't in the same Voice Channel as me!",
      ephemeral: true
    });

    // If the Bot not in VC, return Error
    else if (!interaction.guild.me.voice.channelId)
    return interaction.reply({
      content: "I'm not playing anything!",
      ephemeral: true
    });

    const vc = interaction.member.voice;

    if (interaction.member.roles.cache.some(role => role.name.toLowerCase() === 'dj') || vc.channel.permissionsFor(interaction.member).has("MANAGE_CHANNEL")) {
      if (interaction.options.getString('station') === null) {
        client.func.play(interaction, process.env.LOFI_1, 'Lo-fi Beats')
      } else {
        axios.get(
          `http://all.api.radio-browser.info/json/stations/byname/${encodeURIComponent(interaction.options._hoistedOptions[0].value)}?limit=20`
        ).then(async function (response) {
          let data = response.data;

          if (data.length < 1)
          return interaction.reply({
            content: "No Radio Station found with that Name!",
            ephemeral: true
          })
          else {
            if (data.length === 1)
            client.func.play(interaction, data[0].url_resolved, data[0].name, false)

            else {
              let row = new MessageActionRow()
                .addComponents(
                  new MessageButton()
                    .setCustomId('previous')
                    .setStyle('PRIMARY')
                    .setEmoji('◀️'),
                  
                  new MessageButton()
                    .setCustomId('select')
                    .setStyle('SUCCESS')
                    .setEmoji('✅'),
                    
                  new MessageButton()
                    .setCustomId('next')
                    .setStyle('PRIMARY')
                    .setEmoji('▶️'),
                    
                  new MessageButton()
                    .setCustomId('close')
                    .setStyle('DANGER')
                    .setEmoji('❎')
                )

              let i = 0;
              let embed = new MessageEmbed()
                  .setAuthor({
                    name: 'Select the Radio Station',
                    iconURL: client.user.displayAvatarURL()
                  })
                  .setTitle(data[0].name)
                  .setURL(data[0].homepage)
                  .setThumbnail(data[0].favicon.split(" ").join("%20"))
                  .setFooter({
                    text: '◀️ : Previous, ✅ : Select, ▶️ : Next, ❎ : Close'
                  })

                let intr = await interaction.reply({
                  embeds: [embed],
                  components: [row]
                })

                try {
                  let filter = u => u.user.id === interaction.member.id;
                  while (true) {
                    let collector = await interaction.channel.awaitMessageComponent({
                      filter,
                      time: 30000,
                      componentType: "BUTTON"
                    });

                    if (collector.user.id === interaction.member.id) {
                      if (collector.customId === 'close')
                      return interaction.deleteReply(intr)

                      else if (collector.customId === 'select') {
                        await interaction.deleteReply(intr)
                        return client.func.play(interaction, data[i].url_resolved, data[i].name, true)
                      } else if (collector.customId === 'previous') {
                        i--
                        if (i < 0) i = data.length - 1
                        embed
                          .setTitle(data[i].name)
                          .setURL(data[i].homepage)
                          .setThumbnail(data[i].favicon)
                        await interaction.editReply({
                          embeds: [embed],
                          components: [row]
                        })

                        await collector.deferUpdate()
                      } else if (collector.customId === 'next') {
                        i++
                        if (i === data.length) i = 0
                        embed
                          .setTitle(data[i].name)
                          .setURL(data[i].homepage)
                          .setThumbnail(data[i].favicon)
                        await interaction.editReply({
                          embeds: [embed],
                          components: [row]
                        })

                        await collector.deferUpdate()
                      }
                    }
                  }
                } catch (err) {
                  return console.log(err)
                }
            }
          }
        })
      }
    } else return interaction.reply({
      content: "You don't have `MANAGE_CHANNEL` permission or do you have a Role named `DJ`!",
      ephemeral: true
    });
  },
};
