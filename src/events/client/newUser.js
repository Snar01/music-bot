const Event = require("../../structures/Event");

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: "newUser"
        });
    }

    run = async (user) => {
        console.log(`${user.username} logou na Dashboard`)
    };
}