const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { config } = require('dotenv');
const fs = require('fs');

config({ path: `${__dirname}/.env` });

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your Client and Guild Ids here
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
};

const rest = new REST({
	version: '9'
}).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) Commands...');

		// If you want to set Slash Commands for sprecific Guild, comment the code below
		/*
		await rest.put(
			Routes.applicationCommand(clientId), {
				body: commands
			},
		);
		*/

		// If you want set Slash Commands for specific Guild, uncomment the code below
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('✅ | Successfully reloaded application (/) Commands');
	} catch (error) {
		console.error(error);
	}
})();
