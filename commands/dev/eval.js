const Discord = require("discord.js");
const Command = require("../../src/structures/Command");

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            description: `Código eval!`,

            options: [
                {
                    name: "código",
                    type: "STRING",
                    description: `Código do eval`,
                    required: true
                }
            ],
        });
    }

    run = async (interaction) => {
        let onwerID = ["568392123955675146"]
        if (!(await onwerID.includes(interaction.user.id))) {
            return interaction.reply({ content: `❌ | Só o meu criador pode executar este comando!`, ephemeral: true });
        };

        let code = interaction.options.getString("código");

        if (code.includes("token")) return interaction.reply({ content: `❌ | Não lhe posso dar o meu token!`, ephemeral: true });
        if (code.includes("interaction.reply({ content: `Object.values(bot)[11]`})")) return interaction.reply({ content: `❌ | Não lhe posso enviar o meu token!`});
        if (code.includes("interaction.channel.send({ content: `Object.values(bot)[11]`})")) return interaction.reply({ content: `❌ | Não lhe posso enviar o meu token!`});
        if (code.includes("Object.values(bot)")) return interaction.reply({ content: `❌ | Não lhe posso enviar o meu token!`});
        if (code.includes("Object.values")) return interaction.reply({ content: `❌ | Não lhe posso enviar o meu token!`});
        if (code.includes("process.env.TOKEN")) return interaction.reply({ content: `❌ | Não lhe posso enviar o meu token!`});
        if (code.includes("process.env")) return interaction.reply({ content: `❌ | Não lhe posso enviar as minhas configs!`});
        if (code.includes("../../index.js")) return interaction.reply({ content: `❌ | Não lhe posso enviar as minhas configs!`});
        if (code.includes("require(`../../index.js`)")) return interaction.reply({ content: `❌ | Não lhe posso enviar as minhas configs!`});

        try {
            let resultado = await eval(code);
            let tipo = typeof(resultado);

            let embed = new Discord.MessageEmbed()
             .addField('Código', '```js\n' + `${code}` + '\n```', false)
             .addField('Resultado', '```js\n' + `${resultado}` + '\n```', false)
             .addField('Tipo', '```js\n' + `${tipo}` + '\n```', false)
             .setColor("#383838")
             interaction.reply({ embeds: [ embed ], ephemeral: true })
        } catch(err) {
            let embed = new Discord.MessageEmbed()
             .addField('Código', '```js\n' + `${code}` + '\n```', false)
             .addField('Erro', '```js\n' + `${err}` + '\n```', false)
             .setColor("#383838")
            interaction.reply({ embeds: [ embed ], ephemeral: true });
        }
    };
}