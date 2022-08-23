const GuildSchema = require("../../structures/schemas/Guild");
const dc = require("discord.js");

/**
 * @param {dc.Guild} guild
 */
module.exports = {
    name: "guildCreate",

    run: async (guild, client) => {
        const data = await GuildSchema.find({ id: guild.id });
        if (!data[0])
            await GuildSchema.create({
                id: guild.id,
                name: guild.name,
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
            });
        console.log(data[0]);
        console.log(data);

        const ch = guild.channels.cache.get(guild.systemChannelId);
        if (!ch) return;

        if (!guild.members.me.permissions.has(dc.PermissionFlagsBits.Administrator) && guild.systemChannelId) {
            ch.send({
                embeds: [
                    client
                        .embed("error")
                        .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                        .setTitle("I do not have enough permissions to run my features!")
                        .setDescription(`**Needed Permission: [Administrator](${client.utils.url.support})**`)
                ]
            }).catch(() => null);
            return;
        }

        ch.send({
            embeds: [
                client
                    .embed()
                    .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                    .setTitle("Thanks for adding me to your Server!")
                    .setDescription(
                        `Hey, my name is ${client.user.username} and i am here to **improve** your Server! \n if you want to know how i work run \`/help\` !`
                    )
            ],
            components: [
                new dc.ActionRowBuilder().addComponents(
                    new dc.ButtonBuilder().setLabel("Support!").setStyle("Link").setURL(client.utils.url.support)
                )
            ]
        });

        const log = client.channels.cache.get(client.config.channels.log);

        if (log)
            log.send({
                embeds: [
                    client
                        .embed("debug")
                        .setTitle("Server added!")
                        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
**\`»\` Name:** ${guild.name} (\`${guild.id}\`)
**\`»\` Owner:** <@${guild.ownerId}>
**\`»\` Members:** ${guild.members.cache.size}

**\`»\` Created:** <t:${parseInt(guild.createdTimestamp / 1000)}:R>
**\`»\` Joined:** <t:${parseInt(Date.now() / 1000)}:R>
                `)
                ]
            });
    }
};
