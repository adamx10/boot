require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Bsh l'bot y9ra chno katkteb
        GatewayIntentBits.GuildVoiceStates // Bsh y9der y-gérer l'mute f voice channels
    ]
});

const PREFIX = '!'; // L'prefix bash ghaybda l'command (mital: !ban)

client.on('messageCreate', async (message) => {
    // Ila kan l'message mafihsh l'prefix wla mktoub mn bot akhor, maydir walo
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // ----------------------------------------------------
    // Command 1: Bani shi wa7d (!ban @user)
    // ----------------------------------------------------
    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("Ma3ndksh sala7iya t-banni nas!");
        }

        const target = message.mentions.members.first();
        if (target) {
            try {
                await target.ban();
                message.reply(`Thalla f ${target.user.tag}, t-bana b naja7! 👋`);
            } catch (err) {
                message.reply("Ma9drtsh n-bannih, ymkn 3ndo role kber mn l'bot dyali.");
            }
        } else {
            message.reply("Khessek t-mentionni shi wa7d. Mital: `!ban @user`");
        }
    }

    // ----------------------------------------------------
    // Command 2: Mute ga3 li f rom (!muteall)
    // ----------------------------------------------------
    if (command === 'muteall') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply("Ma3ndksh sala7iya d'mute!");
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("Khessek tkon dakhl l shi voice room b3da!");
        }

        // Loop 3la ga3 nass li f l'room w y-mutihom
        voiceChannel.members.forEach(async (member) => {
            try {
                await member.voice.setMute(true);
            } catch (err) {
                console.log(`Ma9drtsh n-muti ${member.user.tag}`);
            }
        });
        message.reply("🔇 Ga3 li f l'room t-mutaw!");
    }

    // ----------------------------------------------------
    // Command 3: 7ayed l'mute 3la ga3 li f rom (!unmuteall)
    // ----------------------------------------------------
    if (command === 'unmuteall') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply("Ma3ndksh sala7iya d'mute!");
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("Khessek tkon dakhl l shi voice room b3da!");
        }

        // Loop 3la ga3 nass li f l'room w y-7ayed l'mute
        voiceChannel.members.forEach(async (member) => {
            try {
                await member.voice.setMute(false);
            } catch (err) {
                console.log(`Ma9drtsh n-unmuti ${member.user.tag}`);
            }
        });
        message.reply("🔊 T7ayed l'mute 3la ga3 li f l'room!");
    }
});

client.once('ready', () => {
    console.log(`L'bot khddam daba b smiyat ${client.user.tag}!`);
});

console.log("Token dyali howa:", process.env.TOKEN);
client.login(process.env.TOKEN);