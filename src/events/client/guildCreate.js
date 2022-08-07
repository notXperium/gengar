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
                tickets: []
            });

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

        const url = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

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
    }
};
