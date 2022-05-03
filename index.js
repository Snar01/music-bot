const Client = require("./src/structures/Client");

const client = new Client();

require("dotenv").config({ path: __dirname + "/.env" });

client.login(process.env.TOKEN);