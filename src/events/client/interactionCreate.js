const Event = require("../../structures/Event");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: "interactionCreate"
        });
    }

    run = async (interaction) => {
        if (interaction.isCommand()) {
            if (!interaction.guild) return

            const cmd = this.client.commands.find(c => c.name === interaction.commandName)

            if (cmd) {
                cmd.run(interaction)
            }
        }
    };
}