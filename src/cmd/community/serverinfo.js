const { CommandType } = require("../../structures");
const { ChannelType } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "show server information",
    usage: "</serverinfo>",
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const { guild } = interaction;

        const security = ["None", "Low", "Medium", "High", "Highest"];

        const roleArray = [
            ...new Set(
                guild.roles.cache
                    .filter((_) => (_.id !== guild.id) & !_.managed)
                    .sort((a, b) => b.position - a.position)
                    .map((r) => r.id)
            )
        ];

        return interaction.reply({
            embeds: [
                client
                    .embed()
                    .setAuthor({ name: `${guild.name} | Information` })
                    .setThumbnail(guild.iconURL({ size: 4096, dynamic: true }))
                    .setDescription(`**<:reply:1005526903647653988>  General:**\n **\`»\` Name:** ${guild.name} (\`${
                    guild.id
                }\`) 
**\`»\` Owner:** <@${guild.ownerId}> (\`${guild.ownerId}\`)
**\`»\` Created:** <t:${parseInt(guild.createdTimestamp / 1000)}:R> \n**\`»\` Description:** ${
                    guild.description || "none"
                } \n\n **<:reply:1005526903647653988>  Members:** 
**\`»\` Total:** ${guild.members.cache.size}
**\`»\` Users:** ${guild.members.cache.filter((_) => !_.user.bot).size}
**\`»\` Bots:** ${guild.members.cache.filter((_) => _.user.bot).size} \n\n **<:reply:1005526903647653988>  Channels:**
**\`»\` Total:** ${guild.channels.cache.size}
**\`»\` Text:** ${guild.channels.cache.filter((_) => _.type === ChannelType.GuildText).size}
**\`»\` Voice:** ${guild.channels.cache.filter((_) => _.type === ChannelType.GuildVoice).size}
**\`»\` Threads:** ${
                    guild.channels.cache.filter(
                        (_) =>
                            _.type === ChannelType.GuildNewsThread &&
                            ChannelType.GuildPrivateThread &&
                            ChannelType.GuildPublicThread
                    ).size
                }
**\`»\` Stages:** ${guild.channels.cache.filter((_) => _.type === ChannelType.GuildStageVoice).size}
**\`»\` News:** ${guild.channels.cache.filter((_) => _.type === ChannelType.GuildNews).size}
**\`»\` Cateories:** ${
                    guild.channels.cache.filter((_) => _.type === ChannelType.GuildCategory).size
                } \n\n **<:reply:1005526903647653988>  Emojis:**
**\`»\` Total:** ${guild.emojis.cache.size}
**\`»\` Animated:** ${guild.emojis.cache.filter((_) => _.animated).size}
**\`»\` Static:** ${guild.emojis.cache.filter((_) => !_.animated).size} \n\n **<:reply:1005526903647653988>  Settings:**
**\`»\` Location:** ${guild.preferredLocale || "none"}
**\`»\` System Channel:** ${guild.systemChannelId ? `<#${guild.systemChannelId}>` : "none"}
**\`»\` Vanity URL:** ${guild.vanityURLCode ?? "none"}
**\`»\` Boosts:** ${guild.premiumSubscriptionCount}
**\`»\` Tier:** ${guild.premiumTier === 0 ? "N/A" : guild.premiumTier}
**\`»\` Verification:** ${security[guild.verificationLevel]}  \n\n **<:reply:1005526903647653988>  Roles [${
                    roleArray.length
                }]:**
${
    roleArray.length === 0
        ? "None"
        : roleArray
              .slice(0, 10)
              .map((r) => `<@&${r}>`)
              .join(" ,")
}
`)
            ]
        });
    }
};
