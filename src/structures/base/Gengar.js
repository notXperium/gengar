const Config = require("../json/config.json");
const Logger = require("../utilities/Logger");
const { REST } = require("@discordjs/rest");
const Utils = require("../utilities/Utils");
const { blue, white } = require("colors");
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
        const defaultEmbed = new dc.EmbedBuilder().setFooter({
            text: this.user.username,
            iconURL: this.user.displayAvatarURL({ size: 4096, dynamic: true })
        });

        if (!color) return defaultEmbed.setColor(this.utils.colors.normal);

        switch (color) {
            case "normal": {
                return defaultEmbed.setColor(this.utils.colors.normal);
            }
            case "error": {
                return defaultEmbed.setColor(this.utils.colors.failed);
            }
            case "debug": {
                return defaultEmbed.setColor(this.utils.colors.dev);
            }
            default: {
                return defaultEmbed.setColor(this.utils.colors.normal);
            }
        }
    };

    async start(status) {
        let token, guild, id;

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

        this.login(token)
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

            const handler = fs.readdirSync("./src/structures/handler");

            handler.forEach((_) => {
                require(`../handler/${_}`)(this);
            });

            if (handler.length)
                this.logger.info(
                    "handler",
                    `loaded ${handler.length} ${handler.length <= 1 ? "handler" : "handlers"}!`
                );

            const paths = await PG(`${process.cwd()}/src/cmd/**/*.js`);

            const cmdArray = [];
            for (const path of paths) {
                const command = require(path);

                if (!command) continue;

                const filter = parse(path);

                command.dir = path;
                command.category = filter.dir.match(/([^\/]*)\/*$/)?.[1] ?? "invalid";

                const perms = Object.keys(require("discord.js").PermissionsBitField.Flags);

                if (!command.name || !command.description || !command.type)
                    return this.logger.warn("command", `invalid arguments at ${path}!`);

                if (command.permission && !perms.includes(command.permission))
                    return this.logger.warn("command", `invalid Permission at ${command.name}`);

                if (command.devOnly) command.description = command.description + " (dev Only)";

                this.commands.set(command.name, command);
                cmdArray.push(command);
            }

            const rest = new REST({ version: 10 }).setToken(token);

            switch (status) {
                case "dev" || "development": {
                    rest.put(dc.Routes.applicationGuildCommands(id, guild), { body: cmdArray })
                        .then(() => {
                            if (cmdArray.length)
                                this.logger.info(
                                    "commands",
                                    `loaded ${cmdArray.length} ${cmdArray.length <= 1 ? "command" : "commands"}!`
                                );
                        })
                        .catch((err) => this.logger.error("commands", err));
                    break;
                }
                case "live": {
                    rest.put(dc.Routes.applicationCommands(id), { body: cmdArray })
                        .then(() => {
                            if (cmdArray.length)
                                this.logger.info(
                                    "commands",
                                    `loaded ${cmdArray.length} ${cmdArray.length <= 1 ? "command" : "commands"}!`
                                );
                        })
                        .catch((err) => this.logger.error("commands", err));
                    break;
                }
                default:
                    return this.logger.error("Login", "invalid arguments while initializing the bot!");
            }
        });

        this.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const cmd = this.commands.get(interaction.commandName);

                if (!cmd)
                    return interaction.reply({
                        embeds: [
                            this.embed("error")
                                .setTitle("Invalid Command")
                                .setDescription("This Command is not a valid command!\n*Please try again later!*")
                        ],
                        ephemeral: true
                    });

                try {
                    if (!interaction.guild.members.me.permissions.has(dc.PermissionFlagsBits.Administrator))
                        return interaction
                            .reply({
                                embeds: [
                                    this.embed("error")
                                        .setTitle("I do not have permission to run this command!")
                                        .setDescription(
                                            `**Needed Permission: [Administrator](${this.utils.url.support})**`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    const data = await Misc.find();

                    if(data[0].blacklistedUser.some(_ => _.id === interaction.user.id)) 
                    return interaction
                    .reply({
                        embeds: [
                            this.embed("error")
                                .setTitle("You are not allowed to run this command!")
                                .setDescription(
                                    `**You Are [blacklisted](${
                                        this.utils.url.support
                                    })! \nJoin my Support [Discord](${this.utils.url.support}) if you think this is an mistake!!**`
                                )
                        ],
                        ephemeral: true
                    })
                    .catch(() => null);

                    if(data[0].blacklistedGuild.some(_ => _.id === interaction.guild.id)) 
                    return interaction
                    .reply({
                        embeds: [
                            this.embed("error")
                                .setTitle("You are not allowed to run this command!")
                                .setDescription(
                                    `**This Guild is [blacklisted](${
                                        this.utils.url.support
                                    })! \nJoin my Support [Discord](${this.utils.url.support}) if you think this is an mistake!!**`
                                )
                        ],
                        ephemeral: true
                    })
                    .catch(() => null);

                    if (cmd.devOnly && !data[0].team.some(_ => _ === interaction.user.id))
                        return interaction
                            .reply({
                                embeds: [
                                    this.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(
                                            `**Only [${this.user.username.toUpperCase()}](${
                                                this.utils.url.support
                                            }) Developers are allowed to run this command!**`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (cmd.xperium && !interaction.user.id != this.owner)
                        return interaction
                            .reply({
                                embeds: [
                                    this.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(`**Only <@${this.owner}> is allowed to run this command!**`)
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (cmd.permission && !interaction.member.permissions.has(cmd.permission))
                        return interaction
                            .reply({
                                embeds: [
                                    this.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(`Missing Permission: \`${cmd.permission}\``)
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    cmd.run(interaction, this);
                } catch (err) {
                    this.logger.error("commands", err);

                    const ch = this.channels.cache.find((_) => _.id === this.config.channel.error);

                    if (!ch) return;

                    ch.send({
                        embeds: [
                            this.embed("error")
                                .setTitle("Error Found!")
                                .setDescription(
                                    `**➥ Error:  ${err.name} \n \`\`\`${err.message}\`\`\` **\n \`\`\`js\n${err}\`\`\`\n\n`
                                )
                        ]
                    }).catch(() => null);

                    if (interaction.deferred || interaction.replied) {
                        this.logger.error("command", err);
                    } else {
                        this.logger.error("command", err);
                    }
                }
            }
        });
    }
};
