const { CommandType } = require("../../structures");
const { quotes } = require("../../structures/json/motivation.json");

module.exports = {
    name: "motivation",
    description:"get a random quote to motivate yourself!",
    usage: "</motivation>",
    type: CommandType.ChatInput,

    run: async(interaction, client) => {
        const random = Math.floor(Math.random() * quotes.length + 0)

        const quote = quotes[random];

        return interaction.reply({
            embeds: [
                client.embed()
                .setFooter({text: `Author: ${quote.author}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })})
                .setTitle(quote.text)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true, size: 4096 }))
            ]
        })
    }
}