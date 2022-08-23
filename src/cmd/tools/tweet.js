const { CommandType, CommandOptionType } = require("../../structures");
const axios = require("axios").default;

module.exports = {
    name: "tweet",
    description: "Send a fake tweet.",
    usage: "</tweet {name} {text}>",
    options: [
        {
            name: "text",
            description: "text of the tweet",
            required: true,
            type: CommandOptionType.String
        },
        {
            name: "user",
            description: "author of the tweet",
            type: CommandOptionType.User
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.options.getMember("user") || interaction.member;
        const query = interaction.options.getString("text");
        const res = await axios
            .get("https://nekobot.xyz/api/imagegen", {
                params: {
                    type: "tweet",
                    username: member.user.username,
                    text: query
                }
            })
            .then((d) => d.data)
            .catch(() => null);

        return interaction.reply({
            embeds: [client.embed().setImage(res.message)]
        });
    }
};
