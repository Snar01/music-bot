const { Client } = require("discord.js");

const { readdirSync } = require("fs")

const { join } = require("path")

const config = require("../config/config");

const erelaManager = require("./Manager");

//const Dashboard = require("../router/router");

module.exports = class extends Client {
    constructor(options) {
        super({
            ...options,
            intents: 32767,
            partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
        })

        this.commands = [];
        this.loadCommands();
        this.loadEvents();
        this.manager = erelaManager(this);
        //this.dashboard = new Dashboard(this)
    }

    registryCommands() {
        let guild = this.guilds.cache.get(config.Guild.ID);
        guild.commands.set(this.commands)
    }

    loadCommands(path = 'commands') {
        const categories = readdirSync(path)

        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`))
                const cmd = new (commandClass)(this)

                this.commands.push(cmd)
                console.log(`[Command] -> Comando --> ${cmd.name} <-- carregado em ${category}`)
            }
        }
    }

    loadEvents (path = 'src/events') {
        const categorias = readdirSync(path);

        for ( const categoria of categorias ) {
            const events = readdirSync(`${path}/${categoria}`);

            for ( const event of events ) {
                const eventClass = require(join(process.cwd(), `${path}/${categoria}/${event}`));

                const evt = new (eventClass)(this);

                this.on(evt.name, evt.run);
                console.log(`[Events] -> Evento --> ${evt.name} <-- carregado em ${categoria}`)
            };
        };
    };
}