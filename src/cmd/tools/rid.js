const { CommandType, CommandOptionType } = require("../../structures");
const axios = require("axios").default;

module.exports = {
    name: "rid",
    description: "Show Rockstar ID",
    usage: "</rid {name}>",
    options: [
        {
            name: "name",
            description: "Rockstar name",
            type: CommandOptionType.String,
            required: true
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const res = await axios
            .get("https://api.walkaisa.dev/rid", {
                params: {
                    key: process.env.INCOGNITO,
                    name: interaction.options.getString("name")
                }
            })
            .then((d) => d.data)
            .catch(() => null);

        if (!res || res?.statusCode !== 200)
            return interaction.reply({
                embeds: [client.embed().setTitle("This user cannot be found!")],
                ephemeral: true
            });

        return interaction.reply({
            embeds: [
                client
                    .embed("")
                    .setTitle("Rockstar Account")
                    .setDescription(
                        `
**\`»\` Name:** [${res.data.name}](https://socialclub.rockstargames.com/member/${res.data.name})
**\`»\` User ID:** ${res.data.rockstarId}
**\`»\` Clan:** ${res.data.isClanMate ? "Yes" : "No Clan"}
**\`»\` Friends:** ${res.data.friendCount}
**\`»\` Games:** ${res.data.gamesOwnedCount}
                `
                    )
                    .setThumbnail(res.data.avatarURL)
            ]
        });
    }
};
