const { CommandType } = require("../../structures");

module.exports = {
    name: "ping",
    description: "show bot ping",
    usage: "<ping>",
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const load = client.embed().setDescription(`${client.utils.emojis.loading} Loading...`);

        interaction.reply({ embeds: [load] });

        setTimeout(() => {
            interaction.editReply({
                embeds: [
                    client
                        .embed()
                        .setTitle("Ping")
                        .setDescription(
                            `**Latency: [${interaction.createdTimestamp - Date.now()}](${
                                client.utils.url.support
                            }) ms \nApi Ping: [${client.ws.ping}](${client.utils.url.support}) ms**`
                        )
                ]
            });
        }, 1000);
    }
};
