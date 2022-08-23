const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "messageUpdate",

    run: async (oldMessage, newMessage, client) => {
        if (newMessage.channelId != oldMessage.author.id && !newMessage.author.bot) {
            console.log(oldMessage.author);

            const guild = client.guilds.cache.get(oldMessage.guildId);

            const data = await Schema.findOne({ id: guild.id || oldMessage.guildId });

            if (!data)
                await Schema.create({
                    id: guild.id || oldMessage.guildId,
                    name: guild.name || null,
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
                });

            if (data?.channels.general) {
                const ch = oldMessage.guild.channels.cache.get(data.channels.general);

                if (!ch || oldMessage.author.bot) return;

                const count = 900;
                const old = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? "..." : "");
                const edited = newMessage.content.slice(0, count) + (newMessage.content.length > count ? "..." : "");

                if (edited === old) return;

                ch.send({
                    embeds: [
                        client
                            .embed()
                            .setTitle("Message Updated!")
                            .setThumbnail(oldMessage.guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
                    **\`»\` Message:** [URL](${newMessage.url})
                    **\`»\` Author:** <@${newMessage.author.id}> (\`${newMessage.author.id}\`)
                    **\`»\` Channel:** <#${newMessage.channel.id}> (\`${newMessage.channel.id}\`)
                    **\`»\` New Message:** 
                    \`\`\`js\n${edited}\`\`\`
                    **\`»\` Old Message** 
                    \`\`\`js\n${old}\`\`\``)
                    ]
                });
            }
        }
    }
};
