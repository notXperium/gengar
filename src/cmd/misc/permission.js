const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "permission",
    description: "check permission of member",
    usage: "</permision {member}>",
    options: [
        {
            name: "member",
            description: "member to check permission of",
            type: CommandOptionType.User,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const member = interaction.options.getMember("member") || interaction.member;
        const avatar = member.displayAvatarURL({ size: 4096, dynamic: true });

        const perm = Object.keys(require("discord.js").PermissionsBitField.Flags);

        const yes = "<:icons_Correct:994544912450191400>";
        const no = "<:icons_Wrong:994544923875479616>";

        interaction.reply({
            embeds: [
                client
                    .embed()
                    .setAuthor({ name: `${member.user.username} | Permissions`, iconURL: avatar })
                    .setThumbnail(avatar).setDescription(`**Permissions: 
                ${perm
                    .map((_) => {
                        return `${member.permissions.has(_) ? yes : no}  → ${_}`;
                    })
                    .join("\n")}**`)
            ]
        });
    }
};
