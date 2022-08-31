const { REST } = require("@discordjs/rest");
const { promisify } = require("util");
const Logger = require("./Logger");
const { parse } = require("path");
const dc = require("discord.js");
const glob = require("glob");
const PG = promisify(glob);

module.exports = class Registery {
    constructor(client, interaction) {

        this.interaction = interaction;

        this.client = client || interaction.client ;

        if(!this.interaction && !this.client) return new Logger().warn("Registery", "Invalid Arguments") && process.exit();

    };

    status(status) {
        let token = null, guild = null, id = null;

        switch (status) {
            case "dev" || "development": {
                token = process.env.DEV_TOKEN;
                guild = process.env.DEV_GUILD;
                id = process.env.DEV_ID;
                break;
            }
            case "live": {
                token = process.env.LIVE_TOKEN;
                id = process.env.LIVE_ID;
                break;
            }
            default: {
                token = process.env.DEV_TOKEN;
                guild = process.env.DEV_GUILD;
                id = process.env.DEV_ID;
                break;
            }
        }
        const config = {
            status: status || null,
            token: token,
            guild: guild,
            id: id
        };
        return config;
    }
    async registerCommands(config) {

        const cmdArray = [];
        for (const path of await PG(`${process.cwd()}/src/cmd/**/*.js`)) {
            const command = require(path);

            if (!command) continue;

            const filter = parse(path);

            command.dir = path;
            command.category = filter.dir.match(/([^\/]*)\/*$/)?.[1] ?? "invalid";

            if (!command.name || !command.description || !command.type || !command.usage)
                return new Logger().warn("command", `invalid arguments at ${path}!`);

            if (command.permission && !Object.keys(dc.PermissionsBitField.Flags).includes(command.permission)) return new Logger().warn("command", `invalid Permission at ${command.name}`)


            if (command.devOnly) command.description = command.description + " (dev Only)";

            this.client.commands.set(command.name, command);
            cmdArray.push(command);
        }

        const rest = new REST({ version: 10 }).setToken(config.token);

        switch (config.status) {
            case "dev" || "development": {
                rest.put(dc.Routes.applicationGuildCommands(config.id, config.guild), { body: cmdArray })
                    .then(() => {
                        if (cmdArray.length)
                            new Logger().info(
                                "commands",
                                `loaded ${cmdArray.length} ${cmdArray.length <= 1 ? "command" : "commands"}!`
                            );
                    })
                    .catch((err) => new Logger().error("commands", err));
                break;
            }
            case "live": {
                rest.put(dc.Routes.applicationCommands(config.id), { body: cmdArray })
                    .then(() => {
                        if (cmdArray.length)
                        new Logger().info(
                                "commands",
                                `loaded ${cmdArray.length} ${cmdArray.length <= 1 ? "command" : "commands"}!`
                            );
                    })
                    .catch((err) => new Logger().error("commands", err));
                break;
            }
            default:
                return new Logger().error("Login", "invalid arguments while initializing the bot!");
        }

    }

    async registerEvents() {
        const paths = await PG(`${process.cwd()}/src/events/**/*.js`);

        paths.map(async _ => {
            const event = require(_);

            if (!event.name || !Object.values(dc.Events).includes(event?.name)) {
                this.client.logger.warn("event", `invalid event name at ${_}!`);
                process.exit();
            }

            event.dir = _;

            this.client.events.set(event.name, event);

            if (event.once) {
                this.client.once(event.name, (...args) => event.run(...args, this.client));
            } else {
                this.client.on(event.name, (...args) => event.run(...args, this.client));
            }
        })

        if (paths.length) this.client.logger.info("event", `loaded ${paths.length} ${paths.length <= 1 ? "event" : "events"}!`);
    }

    async registerButtons() {
        const dir = await PG(`${process.cwd()}/src/buttons/**/*.js`);

    dir.map(async (_) => {
        const button = require(_);

        if (!button.id) return this.client.logger.warn("button", `Invalid Id at ${_}`);

        const perms = Object.keys(dc.PermissionsBitField.Flags);

        if (button.permission && !perms.includes(button.permission))
            return client.logger.warn("button", `Invalid Permission at ${_}`);

        this.client.buttons.set(button.id, button);
    });

    if(dir.length) this.client.logger.info("buttons", `loaded ${dir.length} ${dir.length <= 1 ? "button" : "buttons"}!`);
    }
}