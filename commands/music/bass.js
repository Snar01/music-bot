const { MessageEmbed } = require("discord.js");
const Command = require("../../src/structures/Command");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "bass",
            description: "Escolha o modo bass",

            options: [
                {
                    name: "nivel",
                    description: "Escolha o nível: low, medium, high, ou none",
                    type: "STRING",
                    required: true
                }
            ]
        });
    }

    run = async (interaction) => {
        const levels = {
            none: 0.0,
            low: 0.2,
            medium: 0.3,
            high: 0.35,
        };

        let player = this.client.manager.get(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: `❌ | Nenhuma música ou Playlist está tocando neste moment`, ephemeral: true });
        };

        const guild = this.client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(interaction.member.user.id);

        let channel = interaction.member.voice.channel;
        let myChannel = interaction.guild.me.voice.channel;

        if (!channel) {
            return interaction.reply({ content: `❌ | Você precisa estar conectado a um canal de voz!`, ephemeral: true });
        };

        if (channel.id !== player.voiceChannel) {
            interaction.reply({ content: `❌ | Você precisa estar conectado ao mesmo canal de voz que eu!`, ephemeral: true });
        };

        let level = interaction.options.getString("nivel");

        if (!["low", "medium", "high", "none"].includes(level)) {
            return interaction.reply({ content: `❌ | Você só pode inserir: **low**, **medium**, **high** ou **none**`, ephemeral: true });
        };

        player.setEQ(
            ...new Array(3)
            .fill(null)
            .map((_, i) => ({ band: i, gain: levels[level] }))
        );

        interaction.reply({ content: `✅ | Bass setado para: **${level}**`, ephemeral: true });
    };
}