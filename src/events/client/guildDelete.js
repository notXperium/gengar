const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "guildDelete",

    run: async (guild, client) => {
        await Schema.findOneAndDelete({ id: guild.id });

        const ch = client.channels.cache.get(client.config.channels.log);

        if (ch)
            ch.send({
                embeds: [
                    client
                        .embed("debug")
                        .setTitle("Server left!")
                        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })).setDescription(`
**\`»\` Name:** ${guild.name} (\`${guild.id}\`)
**\`»\` Owner:** <@${guild.ownerId}>
**\`»\` Members:** ${guild.members.cache.size}

**\`»\` Created:** <t:${parseInt(guild.createdTimestamp / 1000)}:R>
**\`»\` Joined:** <t:${parseInt(guild.joinedTimestamp / 1000)}:R>


**\`»\`Left Guild:** <t:${parseInt(Date.now() / 1000)}:R>
                `)
                ]
            });
    }
};
