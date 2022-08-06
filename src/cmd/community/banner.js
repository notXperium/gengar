const {CommandType, CommandOptionType} = require("../../structures");

module.exports = {
    name: "banner",
    description: "display member banner",
    options: [
        {
            name: "member",
            description: "member to show banner of",
            type: CommandOptionType.User,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {

        const member = interaction.options.getMember("member") || interaction.member;
        const banner = (await member.user.fetch()).bannerURL({ dynamic: true, size: 4096 });

        if(!banner) return interaction.reply({
            embeds: [
                client.embed("error")
                .setDescription(`**${member.user.tag} has no banner!**`)
            ], ephemeral: true
        });

        return interaction.reply({ 
            embeds: [
                client.embed()
                .setTitle(`${member.user.username}\`s Banner`)
                .setDescription(`**[Banner](${banner})**`)
                .setImage(banner)
            ]
        })
    }
}