const { CommandType, CommandOptionType } = require("../../structures");
const { ActivityType, UserFlags } = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "show user information",
    options: [
        {
            name: "member",
            description: "member to show information of",
            type: CommandOptionType.User
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.options.getMember("member") || interaction.member;

        const avatar = member.displayAvatarURL({ dynamic: true, size: 4096 });
        const banner = (await member.user.fetch()).bannerURL({ dynamic: true, size: 4096 });
        const activity = member.presence.activities[0];

        let devices;
        if (member.presence.status === "offline") {
            devices = "N/A";
        } else {
            devices = member.presence.clientStatus
                ? Object.entries(member.presence.clientStatus)
                      .map((device) => device[0][0].toUpperCase() + device[0].substring(1))
                      .join(", ")
                : null;
        }

        const Roles = [
            ...new Set(
                member.roles.cache
                    .filter((_) => (_.id !== interaction.guild.id) & !_.managed)
                    .sort((a, b) => b.position - a.position)
                    .map((r) => r.id)
            )
        ];

        const status = member.presence.status
            .replace("online", "<:icons_dgreen:994544919714742342> Online")
            .replace("idle", "<:emoji:1005841778064244877>")
            .replace("dnd", "<:icons_dred:994544928698945597> Do Not Disturb")
            .replace("offline", "<:offline:974221638457495612> Offline");

        const emoji = [
            { name: "Staff", emoji: "<:diamond:1005841770711629874>" },
            { name: "CertifiedModerator", emoji: "<:moderator:1005841772074766366>" },
            { name: "Partner", emoji: "<:discordpartner:1005845069321998376>" },
            { name: "Hypesquad", emoji: "<:hype:1005841776621396039>" },
            { name: "HypeSquadOnlineHouse1", emoji: "<:bravey:1005841775149191178>" },
            { name: "HypeSquadOnlineHouse2", emoji: "<:brilliance:1005843346952040549>" },
            { name: "HypeSquadOnlineHouse3", emoji: "<:balance:1005843802092744814>" },
            { name: "VerifiedDeveloper", emoji: "<:botDev:950772182479433728>" },
            { name: "PremiumEarlySupporter", emoji: "<:support:1005846951432028160>" }
        ];
        const flags = [...new Set(member.user.flags)];
        let badges = [];
        emoji.forEach((e) => {
            if (flags.includes(e.name)) badges.push(e.emoji);
        });

        interaction.reply({
            embeds: [
                client
                    .embed()
                    .setAuthor({ name: `${member.user.username} | Information`, iconURL: avatar })
                    .setThumbnail(avatar)
                    .setImage(banner).setDescription(`**<:reply:1005526903647653988> General:** \n **\`»\` Name:** <@${
                    member.user.id
                }> (\`${member.user.id}\`)
**\`»\` Tag:** ${member.user.tag}
**\`»\` Created:** <t:${parseInt(member.user.createdTimestamp / 1000)}:R>
**\`»\` Status:**  ${status ?? "unknown"} \n\n **<:reply:1005526903647653988>  Other:** 
**\`»\` Avatar:** [Avatar URL](${avatar})
**\`»\` Device:** ${
                    devices
                        ? devices
                              .replace("Web", "<:website:973996696176590938> Web")
                              .replace("Mobile", "<:mobile:973996696029769802> Mobile")
                              .replace("Desktop", "<:desk:973996696004624415> Desktop")
                        : "None"
                }
**\`»\` Activity:** ${activity?.name ? activity.name : "None"} 
**\`»\` Badges:** ${
                    !badges.length
                        ? "None"
                        : badges
                              .slice(0, 10)
                              .map((b) => b)
                              .join(" ,")
                }

**<:reply:1005526903647653988>  Server:** 
**\`»\` Joined:** <t:${parseInt(member.joinedAt / 1000)}:R>
**\`»\` Nickname:** ${member.nickname ? member.nickname : "N/A"}
**\`»\` Booster:** ${member.premiumSinceTimestamp ? "Yes" : "No"}
**\`»\` Highest Role:** ${member.roles.cache.size > 1 ? `<@&${member.roles.highest.id}>` : "None"}
**\`»\` Roles [${Roles.length}]:** ${
                    Roles.length === 0
                        ? "None"
                        : Roles.slice(0, 10)
                              .map((r) => `<@&${r}>`)
                              .join(" ,")
                }
                    `)
            ]
        });
    }
};
