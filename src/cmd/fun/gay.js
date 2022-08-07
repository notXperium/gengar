const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "gay",
    description: "see how gay a user is",
    options: [
        {
            name: "member",
            description: "show a member`s gay percentage",
            type: CommandOptionType.User,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.options.getMember("member") || interaction.member;

        const random = Math.floor(Math.random() * (100 - 0) + 0);

        interaction.reply({
            embeds: [
                client.embed("loading")
            ]
        }).then(() => {
            setTimeout(() => {

                interaction.editReply({
                    embeds: [
                        client.embed()
                            .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                            .setTitle("Gay Percentage")
                            .setDescription(`\n**:rainbow_flag: ${member.user.username} is ${random}% gay!**`)
                    ]
                })
            }, 1000)
        })
    }
}