const { MessageEmbed } = require('discord.js');
const Command = require("../../src/structures/Command");
const lavaconfig = require("../../src/config/lavalink");

module.exports = class extends Command {
    constructor (client) {
        super(client, {
            name: "resume",
            description: "Resumir a música pausada"
        });
    }

    run = async (interaction) => {
        let checkNode = this.client.manager.nodes.get(lavaconfig.Lavalink_1.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_2.id) || this.client.manager.nodes.get(lavaconfig.Lavalink_3.id);

        if (!checkNode || !checkNode.connected) {
            return interaction.reply({ content: `❌ | Nenhum NODE está conectado!`, ephemeral: true });
        };

        let player = this.client.manager.get(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: `❌ | Nenhuma música está sendo reproduzida`, ephemeral: true })
        };

        let channel = interaction.member.voice.channel;
        let myChannel = interaction.guild.me.voice.channel;

        if (!channel) {
            return interaction.reply({ content: `❌ | Você não está conectado a um canal de voz!`, ephemeral: true });
        };

        if (myChannel && channel.id !== myChannel.id) {
            return interaction.reply({ content: `❌ | Você precisa estar conectado ao mesmo canal de voz que eu!`, ephemeral: true });
        };

        if (!player.paused) {
            interaction.reply({ content: `❌ | A música já está resumida`, ephemeral: true });
        } else {
            player.pause(false);
            interaction.reply({ content: `✅ | Música resumida com sucesso!`, ephemeral: true });
        }
    };
}