const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "nuke",
    description: "nuke channel",
    usage: "</nuke {channel}>",
    permission: ["Administrator"],
    options: [
        {
            name: "channel",
            description: "channel to nuke",
            type: CommandOptionType.Channel,
            channel_types: [0],
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const { options } = interaction;

        const channel = options.getChannel("channel") || interaction.channel;

        await channel.clone().then((ch) => {
            ch.setPosition(channel.parentId);

            channel.delete();

            ch.send({
                embeds: [
                    client
                        .embed()
                        .setTitle("Channel Nuked!")
                        .setImage("https://c.tenor.com/jkRrt2SrlMkAAAAC/pepe-nuke.gif")
                ]
            }).then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 20000);
            });
        });
    }
};
