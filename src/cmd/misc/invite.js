const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CommandType } = require("../../structures");

module.exports = {
    name: "invite",
    description: "invite me",
    usage: "<invite>",
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const url = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
        const av = client.user.displayAvatarURL({ size: 4096, dynamic: true });

        interaction.reply({
            embeds: [
                client
                    .embed()
                    .setThumbnail(av)
                    .setTitle(`Hello! My Name Is ${client.user.username}`)
                    .setDescription(
                        "**I Am Here To Improve Your Discord Server!** \n *Please Run `/help` To Explore How I Work!*"
                    )
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setLabel("Invite Me!").setStyle("Link").setURL(url),
                    new ButtonBuilder().setLabel("Support!").setStyle("Link").setURL(client.utils.url.support)
                )
            ]
        });
    }
};
