const { CommandType, CommandOptionType } = require("../../structures");
const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "logging",
    description: "Configures logging",
    usage: "</logging [type] {status} {channel}>",
    permission: ["Administrator"],
    options: [
        {
            name: "general",
            description: "configure general logging",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "status",
                    description: "enable or disable general logging",
                    type: CommandOptionType.Boolean,
                    required: true
                },
                {
                    name: "channel",
                    description: "set general logging channel",
                    type: CommandOptionType.Channel,
                    channel_types: [0],
                    required: false
                }
            ]
        },
        {
            name: "moderation",
            description: "configure moderation logging",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "status",
                    description: "enable or disable moderation logging",
                    type: CommandOptionType.Boolean,
                    required: true
                },
                {
                    name: "channel",
                    description: "set moderation logging channel",
                    type: CommandOptionType.Channel,
                    channel_types: [0],
                    required: false
                }
            ]
        },
        {
            name: "voice",
            description: "configure voice logging",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "status",
                    description: "enable or disable voice logging",
                    type: CommandOptionType.Boolean,
                    required: true
                },
                {
                    name: "channel",
                    description: "set voice logging channel",
                    type: CommandOptionType.Channel,
                    channel_types: [0],
                    required: false
                }
            ]
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const sub = interaction.options.getSubcommand();
        const data = await Schema.findOne({ id: interaction.guild.id })
        if (!data?.name) return await Schema.create({
            id: interaction.guild.id,
            name: interaction.guild.name,
            ticketSystem: {
                category: null,
                transcript: null,
                create: null,
                role: null,
                count: null
            },
            tickets: [],

            giveaway: [],

            ranking: [],

            channels: {
                ranking: null,
                general: null,
                voice: null,
                moderation: null
            }
        }) && interaction.reply({
            embeds: [
                client.embed("error")
                    .setTitle("Please try again!")
                    .setDescription("An unexpected error occurred while running the command!")
            ], ephemeral: true
        })
        switch (sub) {
            case "general": {
                if (!interaction.options.getBoolean("status")) {
                    if (data.channels.general) return await Schema.updateOne({ id: interaction.guild.id },
                        {
                            $set: {
                                channels: {
                                    rannking: data.channels.ranking,
                                    general: null,
                                    moderation: data.channels.moderation,
                                    voice: data.channels.voice
                                }
                            }
                        }) && interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging has been disabled!`)
                            ], ephemeral:  true
                        });

                        return interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging cannot be found!`)
                            ]
                        })
                }
                 if(!interaction.options.getChannel("channel")) return interaction.reply({
                    embeds: [
                        client.embed("error")
                        .setTitle("Invalid Channel!")
                        .setDescription(`A valid Channel is required.`)
                    ]
                 })

                 const channel = interaction.options.getChannel("channel");

                 return await Schema.updateOne({ id: interaction.guild.id}, {
                    $set: { 
                        channels: {
                            rannking: data.channels.ranking,
                            general: channel.id,
                            moderation: data.channels.moderation,
                            voice: data.channels.voice
                        }
                    }
                 }) && interaction.reply({
                    embeds: [
                        client.embed()
                        .setTitle(`${client.utilities.format(sub)} Logging has been enabled!`)
                        .setDescription(`**\`»\` Channel:** <'${channel.id}>`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096}))
                    ]
                 })
            } case "moderation": {
                if (!interaction.options.getBoolean("status")) {
                    if (data.channels.moderation) return await Schema.updateOne({ id: interaction.guild.id },
                        {
                            $set: {
                                channels: {
                                    rannking: data.channels.ranking,
                                    general: data.channels.general,
                                    moderation: null,
                                    voice: data.channels.voice
                                }
                            }
                        }) && interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging has been disabled!`)
                            ], ephemeral:  true
                        });

                        return interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging cannot be found!`)
                            ]
                        })
                }
                 if(!interaction.options.getChannel("channel")) return interaction.reply({
                    embeds: [
                        client.embed("error")
                        .setTitle("Invalid Channel!")
                        .setDescription(`A valid Channel is required.`)
                    ]
                 })

                 const channel = interaction.options.getChannel("channel");

                 return await Schema.updateOne({ id: interaction.guild.id}, {
                    $set: { 
                        channels: {
                            rannking: data.channels.ranking,
                            general: data.channels.general,
                            moderation: channel.id,
                            voice: data.channels.voice
                        }
                    }
                 }) && interaction.reply({
                    embeds: [
                        client.embed()
                        .setTitle(`${client.utilities.format(sub)} Logging has been enabled!`)
                        .setDescription(`**\`»\` Channel:** <'${channel.id}>`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096}))
                    ]
                 })
            } case "voice": {
                if (!interaction.options.getBoolean("status")) {
                    if (data.channels.voice) return await Schema.updateOne({ id: interaction.guild.id },
                        {
                            $set: {
                                channels: {
                                    rannking: data.channels.ranking,
                                    general: data.channels.general,
                                    moderation: data.channels.moderation,
                                    voice: null
                                }
                            }
                        }) && interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging has been disabled!`)
                            ], ephemeral:  true
                        });

                        return interaction.reply({
                            embeds: [
                                client.embed()
                                .setTitle(`${client.utilities.format(sub)} Logging cannot be found!`)
                            ]
                        })
                }
                 if(!interaction.options.getChannel("channel")) return interaction.reply({
                    embeds: [
                        client.embed("error")
                        .setTitle("Invalid Channel!")
                        .setDescription(`A valid Channel is required.`)
                    ]
                 })

                 const channel = interaction.options.getChannel("channel");

                 return await Schema.updateOne({ id: interaction.guild.id}, {
                    $set: { 
                        channels: {
                            rannking: data.channels.ranking,
                            general: data.channels.general,
                            moderation: data.channels.moderation,
                            voice: channel.id
                        }
                    }
                 }) && interaction.reply({
                    embeds: [
                        client.embed()
                        .setTitle(`${client.utilities.format(sub)} Logging has been enabled!`)
                        .setDescription(`**\`»\` Channel:** <'${channel.id}>`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096}))
                    ]
                 })
            }
        }
    }
}