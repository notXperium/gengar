const Brain = require("../../structures/utilities/Brain");

module.exports = {
    name: "messageCreate",

    run: async (message, client) => {
        if (!message.guild || message.author.bot) return;

        if (new RegExp(`^<@!?(${client.user.id})>$`).test(message.content)) {
            const response = await message.reply({
                embeds: [
                    message.client
                        .embed()
                        .setTitle(`Hello! My Name Is ${client.user.username}!`)
                        .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                        .setDescription(
                            `**I am here to improve your Discord Server!** \n Run \`/help\` if you want to know how I work!\n\n*If you want to report a problem, please contact our [team](${message.client.utils.url.support})!*`
                        )
                ]
            });

            setTimeout(() => {
                if (!response) return;
                response.delete();
                message.delete();
            }, 40000);
        }

        new Brain().say(message).catch(() => null);
    }
};
