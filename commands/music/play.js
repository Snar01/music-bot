const Command = require("../../src/structures/Command");
const lavaconfig = require("../../src/config/lavalink");
const config = require("../../src/config/config");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: "Execute o comando para a sua música reproduzir",

            options: [
                {
                    name: "musica",
                    description: `Link ou título da música`,
                    type: "STRING",
                    required: true
                }
            ]
        });
    }

    run = async (interaction) => {
        const channel = interaction.member.voice.channel;
        const myChannel = interaction.guild.me.voice.channel;

        if (!channel) {
            return interaction.reply({ content: `❌ | Você precisa estar conectado a um canal de voz!`, ephemeral: true });
        };

        if (myChannel && channel.id !== myChannel.id) {
            return interaction.reply({ content: `❌ | Você precisa estar conectado ao mesmo canal de voz que eu!`, ephemeral: true });
        };

        let search = interaction.options.getString("musica");

        let checkNode = this.client.manager.nodes.get(lavaconfig.Lavalink_1.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_2.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_3.id);

        if (!checkNode || !checkNode.connected) {
            return interaction.reply({ content: `❌ | Nenhum NODE está conectado!`, ephemeral: true });
        };

        const player = this.client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: config.Guild.ServerDeafen,
            volume: config.Guild.DefaultVolume
        });

        let res;

        try {
            res = await this.client.manager.search(search, interaction.user);

            if (res.loadType === "LOAD_FAILED") throw res.exception
            else if (res.loadType === "PLAYLIST_LOADED") throw res.exception
        } catch(err) {
            return interaction.reply({ content: `Aconteceu um erro ao tentar buscar a música: ${err.message}`, ephemeral: true })
        }

        if (!res?.tracks?.[0]) {
            interaction.reply({ content: `❌ | Impossível encontrar essa música!`, ephemeral: true });
        };

        if (player.state !== 'CONNECTED') player.connect();
        player.queue.add(res.tracks[0])

        if (!player.playing && !player.paused) player.play();

        let embed = new MessageEmbed()
            .setAuthor({ name: `Música adiciona à fila`, iconURL: process.env.LOGO_MUSIC })
            .setColor("BLUE")
            .addField(`💿 | Titulo: `, `**${res.tracks[0].title}**`, true)
            .addField(`🎵 | Duração: `, `**${moment(res.tracks[0].duration).format("mm:ss")}**`, true)
            .addField(`👤 | Pedido por: `, `${interaction.user}`, true)
            .setFooter({ text: `${this.client.user.username} | Todos os direitos Reservados` })
            .setTimestamp();
        interaction.reply({ embeds: [ embed ] });
    };
}