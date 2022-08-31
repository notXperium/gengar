const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Logger = require("../utilities/Logger");
const Schema = require("../schemas/Guild");
const ms = require("ms");

module.exports = class Giveaway {


    async create(interaction, client, args) {
        if (!interaction || !client || !args)
            return new Logger().error("giveaway", "invalid arguments while creating a giveaway");

        try {
            const start = Date.now();

            const data = await Schema.findOne({ id: interaction.guild.id });

            if (!data)
                return (
                    interaction.reply({
                        embeds: [client.embed("error").setTitle("Please try again later!")],
                        ephemeral: true
                    }) &&
                    (await Schema.create({
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

                        giveaways: [],

                        ranking: [],

                        channels: {
                            ranking: null,
                            general: null,
                            voice: null,
                            moderation: null
                        }
                    }).catch(() => null))
                );

            const { prize, winners, time, channel } = args || null;

            const duration = ms(time);

            if (!duration || duration < 60000 || duration > 1209600000)
                return interaction
                    .reply({
                        embeds: [
                            client.embed("debug").setTitle("Invalid Time Format!")
                                .setDescription(`Please enter a valid duration!\n **Example:**
\`\`\`
1min -> one minute
1h -> one hour
1d -> one day
1w -> one week
\`\`\`
*\`»\` The possible duration is between 1 minute and 2 weeks!*
                        `)
                        ]
                    })
                    .catch(() => null);

            interaction
                .reply({
                    embeds: [client.embed().setDescription(`Giveaway has been created in <#${channel.id}>`)],
                    ephemeral: true
                })
                .catch(() => null);

            const fullTime = (start + duration) / 1000;

            const msg = await channel.send({
                content: "**🎉 Giveaway 🎉**",
                embeds: [
                    client
                        .embed()
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                        .setTitle(client.utilities.format(prize))
                        .setDescription(
                            `
**\`»\` Hosted by** <@${interaction.user.id}>
**\`»\`  Ends <t:${parseInt(fullTime)}:R>**
**\`»\`  Winners:** ${winners}\n*\`»\`Press the Button to enter the giveaway!*                  
                    `
                        )
                        .addFields({
                            name: "`»` Entries: 0",
                            value: "\u200B"
                        })
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId("giveaway").setEmoji("🎉").setStyle(ButtonStyle.Primary)
                    )
                ]
            }).catch(() => null);

                // setTimeout(() => {
                //     this.end(interaction, client);
                // }, duration);

            await Schema.updateOne(
                { id: interaction.guild.id },
                {
                    $push: {
                        giveaway: {
                            channel: channel.id,
                            id: interaction.id,
                            message: msg.id,
                            winners: winners,
                            prize: typeof prize === "string" ? prize : `${prize}`,
                            created: start,
                            end: parseInt(fullTime),
                            remaining: duration,
                            paused: false,
                            ended: false,
                            host: interaction.user.id,
                            entered: []
                        }
                    }
                }
            );

            setInterval(() => this.intervalFunction(interaction, client), 1000)       
         } catch (e) {
            console.log(e);
            return interaction.reply({ content: "please try again later!", ephemeral: true }).catch(() => null);
        }
    }

    async enter(interaction, client) {
        const data = await Schema.findOne({ id: interaction.guild.id });

        if (!data)
            return (
                interaction.reply({
                    embeds: [client.embed("error").setTitle("Please try again later!")],
                    ephemeral: true
                }) &&
                (await Schema.create({
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

                    giveaways: [],

                    ranking: [],

                    channels: {
                        ranking: null,
                        general: null,
                        voice: null,
                        moderation: null
                    }
                }).catch(() => null))
            );

        const [giveaway] = data.giveaway.filter(_ => _.message === interaction.message.id);

        if (!giveaway) return interaction.reply({ content: "Please try again later", ephemeral: true });

        if (giveaway.entered.some(_ => _ === interaction.user.id))
            return interaction.reply({
                embeds: [client.embed().setTitle("Giveaway was already entered!")],
                ephemeral: true
            });

        data.giveaway[data.giveaway.indexOf(giveaway)].entered.push(interaction.user.id);

        data.save().catch(() => null);

        const { message } = interaction;

        message.edit({
            embeds: [
                client
                    .embed()
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                    .setTitle(client.utilities.format(giveaway.prize))
                    .setDescription(
                        `
**\`»\` Hosted by** <@${giveaway.host}>
**\`»\`  Ends <t:${parseInt(giveaway.end)}:R>**
**\`»\`  Winners:** ${giveaway.winners}\n*\`»\`Press the Button to enter the giveaway!*                  
                    `
                    )
                    .addFields({
                        name: `\`»\` Entries: ${giveaway.entered.length}`,
                        value: "\u200B"
                    })
            ]
        });

        return interaction.reply({
            embeds: [
                client
                    .embed()
                    .setTitle("Giveaway has been entered!")
                    .setDescription(
                        `You have entered the giveaway for ${giveaway.prize}\n Ends  <t:${parseInt(giveaway.end)}:R>`
                    )
            ],
            ephemeral: true
        });
    }

    async end(interaction, client) {
        const data = await Schema.findOne({ id: interaction.guild.id });
        console.log(data)
        if (!data)
            return (
                interaction.reply({
                    embeds: [client.embed("error").setTitle("Please try again later!")],
                    ephemeral: true
                }) &&
                (await Schema.create({
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

                    giveaways: [],

                    ranking: [],

                    channels: {
                        ranking: null,
                        general: null,
                        voice: null,
                        moderation: null
                    }
                }).catch(() => null))
            );

        const [giveaway] = data.giveaway.filter((_) => _.host === interaction.user.id);

        if (!giveaway) return interaction.reply({ content: "Please try again later", ephemeral: true });

        if(!giveaway.entered.length) return interaction.channel.send({
            embeds: [
                client.embed()
                .setTitle("no one has entered this giveaway")
            ]
        })

        const array = this.shuffle(giveaway.entered);

        console.log("end")

    }

    async intervalFunction(interaction, client) {
        const data = await Schema.findOne({ id: interaction.guild.id});

        if(!data) return;

         const [giveaway] = data.giveaway.filter(_ => _.id === interaction.id);

        if(!giveaway) return;

        if(parseInt(giveaway.remaining) <= 0) return this.end(interaction , client);

        const index =  data.giveaway.indexOf(giveaway);

        data.giveaway[index].remaining - 1000;

        data.save().catch(() => null);

    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};
