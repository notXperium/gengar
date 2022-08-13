const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "ppsize",
    description: "see how long a user`s pp is",
    options: [
        {
            name: "member",
            description: "show a member`s pp size",
            type: CommandOptionType.User,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.options.getMember("member") || interaction.member;

        const random = Math.floor(Math.random() * (30 - 2) + 2);

        interaction
            .reply({
                embeds: [client.embed("loading")]
            })
            .then(() => {
                setTimeout(() => {
                    interaction.editReply({
                        embeds: [
                            client
                                .embed()
                                .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 4096 }))
                                .setTitle("PP Size")
                                .setDescription(`\n** ${member.user.username}\`s pp is ${random}cm long!**`)
                        ]
                    });
                }, 1000);
            });
    }
};
