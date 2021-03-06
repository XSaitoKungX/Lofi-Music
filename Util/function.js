const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, StreamType } = require("@discordjs/voice");

let row = new MessageActionRow()
  .addComponents(
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
);

async function play(interaction, url, stName, replied) {
  const vc = interaction.member.voice;
  const channel = vc.channel;
  const cncsn = await getVoiceConnection(interaction.guildId);

  if (cncsn && cncsn.receiver.connectionData.speaking && interaction.commandName !== 'forceplay')
  return replied ? interaction.followUp({ content: `I'm currently being used in <#${interaction.guild.me.voice.channel.id}>`, ephemeral: true }) : interaction.reply({ content: `I'm currently being used in <#${interaction.guild.me.voice.channel.id}>`, ephemeral: true });

  if (!channel)
  return replied ? interaction.followUp({ content: "You're not in a Voice/Stage Channel", ephemeral: true }) : interaction.reply({ content: "You're not in a Voice/Stage Channel", ephemeral: true });

  if (!channel.joinable)
  return replied ? interaction.followUp({ content: "I can't join the Channel you're connected to", ephemeral: true }) : interaction.reply({ content: "I can't join the Channel you're connected to", ephemeral: true });

  if (!channel.speakable && channel.type !== 'GUILD_STAGE_VOICE')
  return replied ? interaction.followUp({ content: "I can't speak in the Channel you're connected to", ephemeral: true }) : interaction.reply({ content: "I can't speak in the Channel you're connected to", ephemeral: true });

  if (channel.full)
  return replied ? interaction.followUp({ content: "The Voice Channel you're currently in is full", ephemeral: true }) : interaction.reply({ content: "The Voice Channel you're currently in is full", ephemeral: true});

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  const audioPlayer = createAudioPlayer();

  const resource = createAudioResource(url);

  const subscription = connection.subscribe(audioPlayer);

  audioPlayer.play(resource);

  let urls = [
    process.env.LOFI_1,
    process.env.LOFI_2
  ];

  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`**?????? | Started playing ${stName} in <#${channel.id}>**${!urls.includes(url) ? '\n**[Add your Own Station](https://www.radio-broswer.info/#/add)**' : ''}`)

  replied ? interaction.followUp({
    embeds: [embed],
    components: [row]
  }) : interaction.reply({
    embeds: [embed],
    components: [row]
  });
};

async	function stop(interaction) {
  if (!interaction.member.voice.channelId)
  return await interaction.reply({ content: "You aren't in Voice Channel!", ephemeral: true });

  else if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId)
  return await interaction.reply({ content: "You aren't in same Voice Channel as me!", ephemeral: true });

  else if (!interaction.guild.me.voice.channelId)
  return await interaction.reply({ content: "I'm not playing anything!", ephemeral: true });

  else {
    let embed = new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(`**?????? | Stopped playing in <#${interaction.guild.me.voice.channelId}>**`)

    const connection = await getVoiceConnection(interaction.guildId);

    if (!connection)
    return interaction.reply({
      content: `There aren't any Active Voice Connection in this Server!`,
      ephemeral: true
    });
  };
};

async function rowMaker() {
  return row;
}

module.exports = { play, stop, rowMaker };
