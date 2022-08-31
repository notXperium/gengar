const Registery = require("../utilities/Registery");
const Config = require("../json/config.json");
const Logger = require("../utilities/Logger");
const Utils = require("../utilities/Utils");
const { blue, white } = require("colors");
const Guild = require("../schemas/Guild");
const User = require("../schemas/User");
const Misc = require("../schemas/Misc");
const Database = require("./Database");
const { promisify } = require("util");
const { parse } = require("path");
const dc = require("discord.js");
const glob = require("glob");
const PG = promisify(glob);
require("dotenv").config();
const fs = require("fs");

const intents = Object.entries(dc.GatewayIntentBits)
    .filter(([_]) => /^[a-zA-Z]+$/.test(_))
    .map(([, _]) => _);

const partials = Object.entries(dc.Partials)
    .filter(([_]) => /^[a-zA-Z]+$/.test(_))
    .map(([, _]) => _);

module.exports = class Gengar extends dc.Client {
    constructor() {
        super({
            intents: intents,
            partials: partials,
            restTimeOffset: 0,
            presence: {
                activities: [
                    {
                        name: "GENGAR | /help",
                        type: dc.ActivityType.Streaming,
                        url: "https://www.youtube.com/watch?v=xvFZjo5PgG0"
                    }
                ]
            }
        });
    }

    cooldowns = new dc.Collection();
    commands = new dc.Collection();
    buttons = new dc.Collection();
    modals = new dc.Collection();
    events = new dc.Collection();
    owner = "714765234036015104";
    utils = new Utils().utils;
    utilities = new Utils();
    logger = new Logger();
    db = new Database();
    config = Config;

    embed = (color) => {
        switch (color) {
            case "normal": {
                return new dc.EmbedBuilder()
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.normal);
            }
            case "error": {
                return new dc.EmbedBuilder()
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.failed);
            }
            case "debug": {
                return new dc.EmbedBuilder()
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.dev);
            }
            case "success": {
                return new dc.EmbedBuilder()
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.success);
            }
            case "loading": {
                return new dc.EmbedBuilder()
                    .setDescription(`${this.utils.emojis.loading} Loading...`)
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.normal);
            }
            default: {
                return new dc.EmbedBuilder()
                    .setFooter({
                        text: this.user.username,
                        iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
                    })
                    .setColor(this.utils.colors.normal);
            }
        }
    };

    async start(status) {

        const config = new Registery(this).status(status)

        this.login(config.token)
            .then(() => {
                this.logger.info(
                    this.user.username,
                    `${this.user.username} is online! Guild Count: ${this.guilds.cache.size}`
                );
            })
            .catch((err) => {
                this.logger.error("login", err);
            });

        this.on("ready", async () => {
            this.db.createConnection(this);

            const Schema = require("../../structures/schemas/Misc");
            const data = await Schema.find();
            if (!data)
                await Schema.create({
                    team: [this.owner],
                    blacklistedUser: [],
                    blacklistedGuild: [],
                    owner: this.owner
                });

            new Registery(this).registerCommands(config);
                
            new Registery(this).registerEvents();

            new Registery(this).registerButtons();
        });

        this.on("interactionCreate", async (interaction) => {
            const Interaction = require("../utilities/Interaction");

            new Interaction(interaction, this).command();

            new Interaction(interaction, this).button(); 
        });
    }
};
