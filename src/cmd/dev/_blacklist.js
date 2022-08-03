const { CommandOptionType, CommandType } = require("../../structures");
const Misc = require("../../structures/schemas/Misc");

module.exports = {
    name: "_blacklist",
    description: "blacklist user",
    usage: "<blacklist>",
    options: [
        {
            name: "add",
            description: "add blacklist",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "type of blacklist",
                    choices: [
                        {
                            name: "server",
                            value: 0
                        },
                        {
                            name: "user",
                            value: 1
                        }
                    ],
                    type: CommandOptionType.Number,
                    required: true
                },
                {
                    name: "id",
                    description: "enter id",
                    type: CommandOptionType.String,
                    min_length: 18,
                    max_length: 18,
                    required: true
                },
                {
                    name: "reason",
                    description: "reason for blacklist",
                    type: CommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "add blacklist",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "type of blacklist",
                    choices: [
                        {
                            name: "server",
                            value: 0
                        },
                        {
                            name: "user",
                            value: 1
                        }
                    ],
                    type: CommandOptionType.Number,
                    required: true
                },
                {
                    name: "id",
                    description: "enter id",
                    type: CommandOptionType.String,
                    min_length: 18,
                    max_length: 18,
                    required: true
                },
                {
                    name: "reason",
                    description: "reason for blacklist",
                    type: CommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    type: CommandType.ChatInput,
    devOnly: true,

    run: async (interaction, client) => {
        const { options } = interaction;

        const sub = options.getSubcommand();

        switch (sub) {
            case "add": {
                const type = options.getNumber("type");

                const reason = options.getString("reason");
                const uid = options.getString("id");

                const d = await Misc.find();

                switch (type) {
                    case 0: {
                        if (d[0].blacklistedGuild.some((x) => x.id === uid))
                            return interaction
                                .reply({
                                    embeds: [client.embed("debug").setTitle("This Server is already blacklisted!")],
                                    ephemeral: true
                                })
                                .catch(() => null);

                        const guild = client.guilds.fetch(uid);

                        if (!guild)
                            return interaction.reply({
                                embeds: [client.embed("debug").setTitle("This is not a valid guild id!")],
                                ephemeral: true
                            });
                        await Misc.updateOne({
                            $push: {
                                blacklistedGuild: [
                                    {
                                        id: uid,
                                        reason: reason
                                    }
                                ]
                            }
                        });
                        return interaction.reply({
                            embeds: [
                                client
                                    .embed("success")
                                    .setTitle(`${guild.name} has been added to blacklist!`)
                                    .setDescription(
                                        `**» Information: **\n **» Name:** ${guild.name} (\`${
                                            guild.id
                                        }\`)\n **» Members:** ${
                                            guild.members.cache.size
                                        }\n **» Reason:** ${reason} \n\n <t:${parseInt(Date.now() / 1000)}:R>`
                                    )
                            ]
                        });
                    }
                    case 1: {
                        if (d[0].blacklistedUser.some((x) => x.id === uid))
                            return interaction
                                .reply({
                                    embeds: [client.embed("debug").setTitle("This User is already blacklisted!")],
                                    ephemeral: true
                                })
                                .catch(() => null);

                        const user = client.users.fetch(uid);

                        await Misc.updateOne({
                            $push: {
                                blacklistedUser: [
                                    {
                                        id: uid,
                                        reason: reason
                                    }
                                ]
                            }
                        });
                        return interaction.reply({
                            embeds: [
                                client
                                    .embed("success")
                                    .setTitle(`${user?.username} has been added to blacklist!`)
                                    .setDescription(
                                        `**» Information: **\n **» Name:** ${user?.username ?? `<@${uid}>`} (\`${
                                            user?.id ?? uid
                                        }\`)\n **» Reason:** ${reason} \n\n <t:${parseInt(Date.now() / 1000)}:R>`
                                    )
                            ]
                        });
                    }
                }
                break;
            }
            case "remove": {
                const type = options.getNumber("type");

                const reason = options.getString("reason");
                const uid = options.getString("id");

                const d = await Misc.find();

                switch (type) {
                    case 0: {
                        if (!d[0].blacklistedGuild.some((x) => x.id === uid))
                            return interaction
                                .reply({
                                    embeds: [client.embed("debug").setTitle("This Server is not blacklisted!")],
                                    ephemeral: true
                                })
                                .catch(() => null);

                        await Misc.updateOne({
                            $pull: {
                                blacklistedGuild: {
                                    id: uid,
                                    reason: reason
                                }
                            }
                        });

                        const guild = client.guilds.fetch(uid);
                        return interaction.reply({
                            embeds: [
                                client
                                    .embed("success")
                                    .setTitle(`${guild?.name ?? "null"} has been removed from blacklist!`)
                                    .setDescription(
                                        `**» Information: **\n **» Name:** ${guild?.name} (\`${
                                            guild?.id
                                        }\`)\n **» Members:** ${
                                            guild?.members.cache.size
                                        }\n **» Reason:** ${reason} \n\n <t:${parseInt(Date.now() / 1000)}:R>`
                                    )
                            ]
                        });
                    }
                    case 1: {
                        if (!d[0].blacklistedUser.some((x) => x.id === uid))
                            return interaction
                                .reply({
                                    embeds: [client.embed("debug").setTitle("This Server is not blacklisted!")],
                                    ephemeral: true
                                })
                                .catch(() => null);

                        await Misc.updateOne({
                            $pull: {
                                blacklistedUser: {
                                    id: uid,
                                    reason: reason
                                }
                            }
                        });

                        const user = client.users.fetch(uid);

                        return interaction.reply({
                            embeds: [
                                client
                                    .embed("success")
                                    .setTitle(`${user?.username} has been removed from blacklist!`)
                                    .setDescription(
                                        `**» Information: **\n **» Name:** ${user?.username ?? `<@${uid}>`} (\`${
                                            user?.id ?? uid
                                        }\`)\n **» Reason:** ${reason} \n\n <t:${parseInt(Date.now() / 1000)}:R>`
                                    )
                            ]
                        });
                    }
                }
            }
        }
    }
};
