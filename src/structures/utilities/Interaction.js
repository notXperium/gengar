const Guild = require("../schemas/Guild");
const User = require("../schemas/User");
const Misc = require("../schemas/Misc");
const Logger = require("./Logger");
const dc = require("discord.js");


module.exports = class interaction {
    constructor(interaction, client) {

        this.interaction = interaction;

        this.client = client || interaction.client;

        if (!this.interaction && !this.client) return new Logger().warn("Interaction", "Invalid Arguments") && process.exit();

    }

    async command() {
        if(this.interaction.isChatInputCommand()) {
            if (!this.interaction.guild)
            return this.interaction
                .reply({
                    embeds: [
                        this.client.embed("error")
                            .setTitle("You cannot use my commands here!")
                            .setDescription("Please only use my commands in a  Server!")
                    ],
                    ephemeral: true
                })
                .catch(() => null);

                const cmd = this.client.commands.get(this.interaction.commandName);

                if (!cmd)
                return this.interaction.reply({
                    embeds: [
                        this.client.embed("error")
                            .setTitle("Invalid Command")
                            .setDescription("This Command is not a valid command!\n*Please try again later!*")
                    ],
                    ephemeral: true
                });

                try {
                    if (!this.interaction.guild.members.me.permissions.has(dc.PermissionFlagsBits.Administrator))
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setTitle("I do not have permission to run this command!")
                                        .setDescription(
                                            `**Needed Permission: [Administrator](${this.utils.url.support})**`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    const data = await Misc.find();

                    if (
                        data[0]?.blacklistedUser.some((_) => _.id === this.interaction.user.id) &&
                        this.interaction.user.id != this.client.owner
                    )
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(
                                            `**You Are [blacklisted](${this.utils.url.support})!** \nJoin my Support [Discord](${this.utils.url.support}) if you think this is an mistake!!`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (
                        data[0]?.blacklistedGuild.some((_) => _.id === this.interaction.guild.id) &&
                        !data[0]?.team.some((_) => _ === this.interaction.user.id)
                    )
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(
                                            `**This Guild is [blacklisted](${this.utils.url.support})!** \nJoin my Support [Discord](${this.utils.url.support}) if you think this is an mistake!!`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    const res = await Guild.find({ id: this.interaction.guild.id });
                    const userRes = await User.find({ id: this.interaction.user.id });

                    if (!userRes) await User.create({ id: this.interaction.user.id });

                    const premium = res[0]?.premium && (userRes[0]?.premium ?? false);

                    if (cmd.premium && !premium && !this.interaction.user.id === this.client.owner)
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setDescription(
                                            `**This is a Premium only command!** \n\n[Get Premium](${this.utils.url.support})`
                                        )
                                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (
                        cmd.devOnly &&
                        !data[0]?.team.some((_) => _ === this.interaction.user.id) &&
                        this.interaction.user.id != this.client.owner
                    )
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(
                                            `**Only [${this.user.username.toUpperCase()}](${this.utils.url.support
                                            }) Developers are allowed to run this command!**`
                                        )
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (cmd.ownerOnly && this.interaction.user.id != this.client.owner)
                        return this.interaction
                            .reply({
                                embeds: [
                                    this.client.embed("error")
                                        .setTitle("You are not allowed to run this command!")
                                        .setDescription(`**Only <@${this.owner}> is allowed to run this command!**`)
                                ],
                                ephemeral: true
                            })
                            .catch(() => null);

                    if (cmd.permission && !this.interaction.member.permissions.has(cmd.permission)) return this.interaction
                                .reply({
                                    embeds: [
                                        this.client.embed("error")
                                            .setTitle("You are not allowed to run this command!")
                                            .setDescription(`Missing Permission: \`${cmd.permission}\``)
                                    ],
                                    ephemeral: true
                                })
                                .catch(() => null);
                

                    cmd.run(this.interaction, this.client);
                } catch (err) {
                    this.client.logger.error("commands", err);

                    const ch = this.client.channels.cache.get(this.client.config.channels.error);

                    if (!ch) return;

                    ch.send({
                        embeds: [
                            this.client.embed("error")
                                .setTitle("Error Found!")
                                .setDescription(
                                    `**➥ Error:  ${err.name} \n \`\`\`${err.message}\`\`\` **\n \`\`\`js\n${err}\`\`\`\n\n`
                                )
                        ]
                    }).catch(() => null);

                    if (this.interaction.deferred || this.interaction.replied) {
                        this.client.logger.error("command", err);
                    } else {
                        this.client.logger.error("command", err);
                    }
                }
        }
    }

    button() {
        if (this.interaction.isButton()) {
            const button = this.client.buttons.get(this.interaction.customId);

            if (!button)
                return this.interaction.reply({
                    embeds: [
                        this.clientembed("error")
                            .setTitle("Invalid Button")
                            .setDescription("This Button is not a valid Button!\n*Please try again later!*")
                    ],
                    ephemeral: true
                });

            if (button.permission && !this.interaction.member.permissions.has(button.permission))
                return this.interaction
                    .reply({
                        embeds: [
                            this.client.embed("error")
                                .setTitle("You are not allowed to use this button!")
                                .setDescription(`Missing Permission: \`${button.permission}\``)
                        ],
                        ephemeral: true
                    })
                    .catch(() => null);

            try {
                button.run(this.interaction, this.client);
            } catch (e) {
                console.error(e);
            }
        }
    }
}