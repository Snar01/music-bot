const Event = require('../../structures/Event')
const Dashboard = require("../../router/router");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async () => {
        console.log(`Bot ${this.client.user.username} logado com sucesso em ${this.client.guilds.cache.size} servidores.`);
        this.client.registryCommands();

        this.client.manager.init(this.client.user.id);

        this.client.dashboard = new Dashboard(this.client);
    }
}