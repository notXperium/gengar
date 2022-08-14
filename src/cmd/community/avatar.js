const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "avatar",
    description: "display member avatar",
    usage: "</avatar {user}>",
    options: [
        {
            name: "member",
            description: "member to show avatar of",
            type: CommandOptionType.User,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const member = interaction.options.getMember("member") || interaction.member;
        const avatar = member.displayAvatarURL({ size: 4096, dynamic: true });

        return interaction.reply({
            embeds: [
                client
                    .embed()
                    .setTitle(`${member.user.username}\`s Avatar`)
                    .setDescription(`**[Avatar](${avatar})**`)
                    .setImage(avatar)
            ]
        });
    }
};
