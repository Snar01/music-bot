const { MessageEmbed } = require('discord.js');
const Command = require("../../src/structures/Command");
const lavaconfig = require("../../src/config/lavalink");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "Pule a música"
        });
    }

    run = async (interaction) => {
        let checkNode = this.client.manager.nodes.get(lavaconfig.Lavalink_1.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_2.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_3.id);

        if (!checkNode || !checkNode.connected) {
            return interaction.reply({ content: `❌ | Nenhum NODE está conectado!`, ephemeral: true });
        };

        let player = this.client.manager.get(interaction.guild.id)
        if (!player) {
            interaction.reply({ content: `❌ | Nenhuma música ou Playlist está sendo reproduzida`, ephemeral: true });
        };

        let channel = interaction.member.voice.channel;
        let myChannel = interaction.guild.me.voice.channel;

        if (!channel) {
            return interaction.reply({ content: `❌ | Você precisa estar conectado a um canal de voz!`, ephemeral: true });
        };

        if (myChannel && channel.id !== myChannel.id) {
            interaction.reply({ content: `❌ | Você precisa estar conectado ao mesmo canal de voz que eu!`, ephemeral: true });
        };

        const title = player.queue.current.title;

        player.stop();
        interaction.reply({ content: `✅ | Música **${title}** pulada com sucesso`, ephemeral: true });
    };
}