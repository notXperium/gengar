const { CommandType, CommandOptionType } = require("../../structures");
const Giveaway = require("../../structures/modules/Giveaway");

module.exports = {
    name: "giveaway",
    description: "manage giveaways",
    usage: "</giveaway [type] {options}>",
    permission: "ManageGuild",
    type: CommandType.ChatInput,
    options: [
        {
            name: "create",
            description: "create a new giveaway",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "prize",
                    description: "prize the giveaway winner should get",
                    type: CommandOptionType.String,
                    required: true
                },
                {
                    name: "winners",
                    description: "amount of winners",
                    type: CommandOptionType.Number,
                    required: true
                },
                {
                    name: "time",
                    description: "time till the winner(s) get drafted (example: 7d, 4h)",
                    type: CommandOptionType.String,
                    required: true
                },
                {
                    name: "channel",
                    description: "channel where the giveaway will be sent",
                    type: CommandOptionType.Channel,
                    required: false,
                    channel_types: [0]
                }
            ]
        }
    ],

    run: async (interaction, client) => {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const giveaway = new Giveaway();

        switch (sub) {
            case "create": {
                const args = {
                    prize: options.getString("prize") || null,
                    winners: options.getNumber("winners") || null,
                    time: options.getString("time") || null,
                    channel: options.getChannel("channel") || interaction.channel
                };

                giveaway.create(interaction, client, args).catch((e) =>
                    interaction.reply({
                        embeds: [
                            client
                                .embed("error")
                                .setTitle("Error while creating a giveaway")
                                .setDescription(`\`\`\`${e}\`\`\``)
                        ]
                    })
                );
            }
        }
    }
};
