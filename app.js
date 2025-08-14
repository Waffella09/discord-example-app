// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('Express server running on port 3000'));

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = '';
const CHANNEL_ID = '';
const KEYWORD = 'tea';

let count = 0;
if (fs.existsSync('count.json')) {
    count = JSON.parse(fs.readFileSync('count.json', 'utf8')).count;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes(KEYWORD.toLowerCase())) {
        count++;
        fs.writeFileSync('count.json', JSON.stringify({ count }));

        const guild = client.guilds.cache.get(GUILD_ID);
        const channel = guild.channels.cache.get(CHANNEL_ID);

        if (channel && channel.type === 2) { // 2 = voice channel
            channel.setName(`Counter: ${count}`)
                .catch(console.error);
        }
    }
});

client.login(TOKEN);
