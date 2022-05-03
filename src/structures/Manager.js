const { Manager } = require("erela.js");
const lavaconfig = require("../config/lavalink");
const config = require("../config/config");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
    return new Manager({ 
        nodes: [
            {
                identifier: lavaconfig.Lavalink_1.id,
                host: lavaconfig.Lavalink_1.host,
                password: lavaconfig.Lavalink_1.password,
                port: lavaconfig.Lavalink_1.port,
                secure: lavaconfig.Lavalink_1.secure
            },
            {
                identifier: lavaconfig.Lavalink_2.id,
                host: lavaconfig.Lavalink_2.host,
                password: lavaconfig.Lavalink_2.password,
                port: lavaconfig.Lavalink_2.port,
                secure: lavaconfig.Lavalink_2.secure
            },
            {
                identifier: lavaconfig.Lavalink_3.id,
                host: lavaconfig.Lavalink_3.host,
                password: lavaconfig.Lavalink_3.password,
                port: lavaconfig.Lavalink_3.port,
                secure: lavaconfig.Lavalink_3.secure
            }
        ],

        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })

    .on("nodeConnect", (node) => {
        console.log(`[NODE] -> ${node.options.identifier} conectado`);
    })
    .on("nodeError", (node, error) => {
        console.log(`[NODE] -> ${node.options.identifier} deu um problema: ${error.message}`);
    })
    .on("nodeDisconnect", (node) => {
        console.log(`[NODE] -> ${node.options.identifier} acabou de se desconectar`);
    })
    .on("nodeDestroy", (node) => {
        console.log(`[NODE] -> ${node.options.identifier} acabou de ser destruido, pois a música acabou, ou alguém saiu da call`);
    })
    .on("nodeCreate", (node) => {
        console.log(`[NODE] -> ${node.options.identifier} acabou de ser criado, pois uma música vai ser tocada`);
    })
    .on("nodeReconnect", (node) => {
        console.log(`[NODE] -> ${node.options.identifier} acabou de se reconnectar`);
    })
    .on("playerCreate", (player) => {
        const guild = client.guilds.cache.get(player.guild);
        console.log(`[PLAYER] -> O Player acaba de ser inciado no servidor "${guild.name}" no NODE: ${player.node.options.identifier}`);
    })
    .on("playerDestroy", (player) => {
        const guild = client.guilds.cache.get(player.guild);
        console.log(`[PLAYER] -> O Player acaba de ser destruido (música acabou) no servidor "${guild.name}" no NODE: ${player.node.options.identifier}`)
    })
    .on("playerMove", (player, oldChannel, newChannel ) => {
        const guild = client.guilds.cache.get(player.guild);
        const channelOld = client.channels.cache.get(oldChannel);
        const channelNew = client.channels.cache.get(newChannel)
        console.log(`[PLAYER] -> O Player acaba de ser movido do canal #${channelOld.name}, para o #${channelNew.name} no servidor "${guild.name}" e passou pro NODE: ${player.node.options.identifier}`);

        const channel = client.channels.cache.get(player.textChannel);
        channel.send({ content: `Como fui movido de canal, a música parou!` });
    })
    .on("trackStart", (track, player ) => {
        let embed = new MessageEmbed()
                .setAuthor({ name: `Tocando agora...`, iconURL: process.env.LOGO_MUSIC })
                .setColor("GREEN")
                .addField(`💿 | Titulo: `, `**${player.title}**`, true)
                .addField(`🎵 | Duração: `, `**${moment(player.duration).format("mm:ss")}**`, true)
                .addField(`👤 | Pedido por: `, `${player.requester.toString()}`, true)
                .setThumbnail(player.thumbnail)
                .setFooter({ text: `${client.user.username} | Todos os direitos reservados`})
                .setTimestamp();
            client.channels.cache.get(track.textChannel).send({
                embeds: [embed]
            });
    })
    .on("queueEnd", (player) => {
        const channel = client.channels.cache.get(player.textChannel);
        channel.send({ content: `A fila acabou!`});
        player.destroy();
    })
};