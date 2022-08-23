const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const GuildSchema = require("../../structures/schemas/Guild");
const createTranscript = require("discord-html-transcripts");

module.exports = class Ticket {
    async setup(interaction) {
        const role = interaction.options.getRole("role");
        const status = interaction.options.getBoolean("status");

        if (status) {
            if (!role)
                return interaction
                    .reply({
                        embeds: [
                            interaction.client
                                .embed("error")
                                .setTitle("Invalid Parameter")
                                .setDescription("Please provide a role!")
                        ],
                        ephemeral: true
                    })
                    .catch(() => null);

            const data = await GuildSchema.find({ id: interaction.guild.id });

            if (data[0]?.ticketSystem.category) {
                if (data[0].ticketSystem.role === role.id)
                    return interaction.reply({
                        embeds: [interaction.client.embed("error").setTitle("Ticket System is already setup!")],
                        ephemeral: true
                    });
                await GuildSchema.updateOne(
                    { id: interaction.guild.id },
                    {
                        $set: {
                            ticketSystem: {
                                category: data[0].ticketSystem.category,
                                transcript: data[0].ticketSystem.transcript,
                                create: data[0].ticketSystem.create,
                                role: role.id,
                                count: 0
                            }
                        }
                    }
                );

                return interaction.reply({
                    embeds: [
                        interaction.client.embed().setTitle("Staff Role Has been updated!").setDescription(`
**\`»\` Old Role:** <@&${data[0].ticketSystem.role}>
**\`»\` New Role:** <@&${role.id}>`)
                    ]
                });
            }

            const category = await interaction.guild.channels.create({
                name: "Ticket",
                type: ChannelType.GuildCategory
            });

            const create = await interaction.guild.channels.create({
                name: "create ticket",
                type: ChannelType.GuildText,
                parent: category.id,
                permissionsOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            const transcript = await interaction.guild.channels.create({
                name: "transcript",
                type: ChannelType.GuildText,
                parent: category.id,
                permissionsOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: role.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                        deny: [PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            interaction.reply({
                embeds: [
                    interaction.client
                        .embed()
                        .setTitle("Ticket System Has Been Setup!")
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                ]
            });

            create.send({
                embeds: [
                    interaction.client
                        .embed()
                        .setTitle("Ticket System")
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                        .setDescription("Press the button to open a Ticket!")
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("create")
                            .setEmoji("<:ticketEmoji:996371394713616507>")
                            .setLabel("Create")
                    )
                ]
            });

            if (!data[0])
                return await GuildSchema.create({
                    id: interaction.guild.id,
                    name: interaction.guild.name,
                    ticketSystem: {
                        category: category.id,
                        transcript: transcript.id,
                        create: create.id,
                        role: role.id,
                        count: 0
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
                });

            await GuildSchema.updateOne(
                { id: interaction.guild.id },
                {
                    $set: {
                        ticketSystem: {
                            category: category.id,
                            transcript: transcript.id,
                            create: create.id,
                            role: role.id,
                            count: 0
                        }
                    }
                }
            );
        } else {
            const data = await GuildSchema.find({ id: interaction.guild.id });

            if (!data[0].ticketSystem.category)
                return interaction.reply({
                    embeds: [
                        interaction.client
                            .embed("error")
                            .setTitle("No Ticket Data Found!")
                            .setDescription("*Please Try again later!*")
                    ],
                    ephemeral: true
                });

            const tickets = data[0].tickets;

            if (tickets.length)
                tickets.map((_) => {
                    const ch = interaction.guild.channels.cache.get(_.id);

                    if (!ch) return;

                    ch.delete();
                });

            const { category, transcript, create } = data[0].ticketSystem;
            const arr = [category, transcript, create];

            arr.map((_) => {
                const ch = interaction.guild.channels.cache.get(_);

                if (!ch) return;

                ch.delete();
            });

            await GuildSchema.updateOne(
                { id: interaction.guild.id },
                {
                    $set: {
                        ticketSystem: {
                            category: null,
                            transcript: null,
                            create: null,
                            role: null,
                            count: null
                        },
                        tickets: []
                    }
                }
            );

            interaction.reply({
                embeds: [interaction.client.embed().setTitle("Ticket System has been disabled!")],
                ephemeral: true
            });
        }
    }

    async create(interaction) {
        const { guild, client } = interaction;

        const data = await GuildSchema.find({ id: guild.id });

        if (!data[0])
            return interaction.reply({
                embeds: [client.embed("error").setTitle("please try again later!")],
                ephemeral: true
            });

        const userTickets = data[0].tickets.filter((_) => _.user === interaction.user.id);

        const ch = guild.channels.cache.get(userTickets[0]?.channel);

        if (userTickets.length && ch)
            return interaction
                .reply({
                    embeds: [client.embed("error").setTitle("You already have an opened ticket!")],
                    ephemeral: true
                })
                .catch(() => null);

        if (userTickets.length && !ch)
            await GuildSchema.updateOne(
                { id: guild.id },
                {
                    $pull: {
                        tickets: {
                            channel: userTickets[0].channel,
                            user: interaction.user.id,
                            locked: userTickets[0].locked
                        }
                    }
                }
            );

        const ticket = await guild.channels.create({
            name: `ticket-${interaction.user.username.slice(0, 7)}-${formatNumber(data[0].ticketSystem.count + 1)}`,
            parent: data[0].ticketSystem.category || null,
            permissionsOverwrites: [
                {
                    id: guild.id,
                    deny: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: data[0].ticketSystem.role,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }
            ]
        });

        ticket.send({
            content: `<@&${data[0].ticketSystem.role}>, <@${interaction.user.id}>`,
            embeds: [
                client
                    .embed()
                    .setTitle(`${ticket.name}`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setDescription("Please describe your problem as good as possible!")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Delete")
                        .setCustomId("deleteTicket")
                        .setEmoji("🗑️")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setLabel("Lock")
                        .setCustomId("lockTicket")
                        .setEmoji("🔓")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        });

        interaction.reply({ content: `Ticket has been opened: <#${ticket.id}>`, ephemeral: true });

        await GuildSchema.updateOne(
            { id: guild.id },
            {
                $push: {
                    tickets: [
                        {
                            channel: ticket.id,
                            user: interaction.user.id,
                            locked: false
                        }
                    ]
                }
            }
        );

        await GuildSchema.updateOne(
            { id: guild.id },
            {
                $set: {
                    ticketSystem: {
                        category: data[0].ticketSystem.category,
                        transcript: data[0].ticketSystem.transcript,
                        create: data[0].ticketSystem.create,
                        role: data[0].ticketSystem.role,
                        count: data[0].ticketSystem.count + 1
                    }
                }
            }
        );
    }

    async delete(interaction) {
        const { guild, channel } = interaction;
        const data = await GuildSchema.find({ id: guild.id });

        if (!data[0])
            return interaction.reply({
                embeds: [interaction.client.embed("error").setTitle("please try again later!")],
                ephemeral: true
            });

        const userTickets = data[0].tickets.filter((_) => _.user === interaction.user.id);

        const ch = guild.channels.cache.get(userTickets[0]?.channel);

        if (!userTickets.length)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        if (userTickets.length && !ch)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        const transcript = await createTranscript.createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${channel.name}.html`
        });

        const user = guild.members.cache.get(userTickets[0]?.user);

        if (user) {
            user.send({
                embeds: [
                    interaction.client
                        .embed()
                        .setTitle("Ticket has been deleted!")
                        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
**\`»\` Server:** ${guild.name}
**\`»\` Closed By:** <@${interaction.user.id}>
**\`»\` Closed:** <t:${parseInt(Date.now() / 1000)}:R>`)
                ]
            }).then(() => {
                user.send({ files: [transcript] });
            });
        }

        const transcriptChannel = guild.channels.cache.get(data[0]?.ticketSystem.transcript);

        if (transcriptChannel) {
            transcriptChannel
                .send({
                    embeds: [
                        interaction.client
                            .embed()
                            .setTitle("Ticket has been closed!")
                            .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
**\`»\` Author:** <@${userTickets[0].user}>
**\`»\` Channel:** ${channel.name}
**\`»\` Closed By:** <@${interaction.user.id}>
**\`»\` Closed:** <t:${parseInt(Date.now() / 1000)}:R>
                    `)
                    ]
                })
                .then(() => {
                    transcriptChannel.send({ files: [transcript] });
                });
        }

        await GuildSchema.updateOne(
            { id: guild.id },
            {
                $pull: {
                    tickets: {
                        user: userTickets[0].user,
                        channel: channel.id,
                        locked: userTickets[0].locked
                    }
                }
            }
        );

        channel.delete();
    }

    async lock(interaction) {
        const { guild, client, channel } = interaction;

        const data = await GuildSchema.find({ id: guild.id });

        if (!data[0])
            return interaction.reply({
                embeds: [interaction.client.embed("error").setTitle("you need to setup the ticket system again!")],
                ephemeral: true
            });

        const userTickets = data[0].tickets.filter((_) => _.user === interaction.user.id);

        const ch = guild.channels.cache.get(userTickets[0]?.channel);

        if (!userTickets.length)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        if (userTickets.length && !ch)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        if (userTickets[0].user === interaction.user.id)
            return interaction.reply({ content: "You cannot lock your own ticket!", ephemeral: true });

        if (userTickets[0].locked)
            return interaction.reply({ content: "This Ticket is already locked!", ephemeral: true });

        data[0].tickets.find((_) => _.channel === interaction.channel.id).locked = true;
        data[0].save().catch();

        channel.permissionOverwrites.edit(userTickets[0].user, { ViewChannel: false });

        const user = guild.members.cache.get(userTickets[0]?.user);

        if (user)
            user.send({
                embeds: [
                    client
                        .embed()
                        .setTitle("Tick has been locked!")
                        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
**\`»\` Server:** ${guild.name}
**\`»\` locked By:** <@${interaction.user.id}>
**\`»\` locked:** <t:${parseInt(Date.now() / 1000)}:R>\n\n **\`»\`** *Please wait for the ticket to get reopened!*`)
                ]
            });

        interaction.reply({
            embeds: [
                client
                    .embed()
                    .setTitle("Tick has been locked!")
                    .setDescription(`Reopen the Ticket for <@${userTickets[0].user}>`)
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("reopen-ticket")
                        .setEmoji("🔒")
                        .setLabel("Reopen Ticket")
                        .setStyle("Primary")
                )
            ],
            ephemeral: true
        });
    }

    async reopen(interaction) {
        const data = await GuildSchema.find({ id: interaction.guild.id });

        if (!data[0] || !data[0].tickets.length)
            return interaction.reply({
                embeds: [interaction.client.embed("error").setTitle("you need to setup the ticket system again!")],
                ephemeral: true
            });

        const userTickets = data[0].tickets.filter((_) => _.user === interaction.user.id);

        const ch = interaction.guild.channels.cache.get(userTickets[0]?.channel);

        if (!userTickets.length)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        if (userTickets.length && !ch)
            return interaction.reply({
                embeds: [
                    interaction.client
                        .embed("error")
                        .setTitle("Cannot Find this Ticket!")
                        .setDescription("Please try again later")
                ],
                ephemeral: true
            });

        if (userTickets[0].user === interaction.user.id)
            return interaction.reply({ content: "You cannot reopen your own ticket!", ephemeral: true });

        if (!userTickets[0].locked)
            return interaction.reply({ content: "This Ticket is not locked!", ephemeral: true });

        data[0].tickets.find((_) => _.channel === interaction.channel.id).locked = false;
        data[0].save().catch();

        interaction.channel.permissionOverwrites.edit(userTickets[0].user, { ViewChannel: false });

        const user = interaction.guild.members.cache.get(userTickets[0]?.user);

        if (user)
            user.send({
                embeds: [
                    interaction.client
                        .embed()
                        .setTitle("Tick has been reopened!")
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
    **\`»\` Server:** ${interaction.guild.name}
    **\`»\` Reopened By:** <@${interaction.user.id}>
    **\`»\` Reopened:** <t:${parseInt(Date.now() / 1000)}:R>`)
                ]
            });

        interaction
            .reply({
                embeds: [client.embed().setTitle("Tick has been reopened!")]
            })
            .then(() => {
                setTimeout(() => {
                    interaction.deleteReply();
                }, 20000);
            });
    }
};

function formatNumber(number) {
    switch (`${number}`.length) {
        case 1: {
            return `000${number}`;
        }
        case 2: {
            return `00${number}`;
        }
        case 3: {
            return `0${number}`;
        }
        case 4: {
            return `${number}`;
        }
        default: {
            return `${number}`;
        }
    }
}
