const { CommandType, CommandOptionType } = require("../../structures");
const { AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "image",
    description: "image manipulations",
    usage: "</image [type] {text}>",
    options: [
        {
            name: "facts",
            description: "Get something from the fact book",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "text",
                    description: "Provide some text",
                    type: CommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    type: CommandType.ChatInput,

    run: (interaction) => {
        const { options } = interaction;

        const sub = options.getSubcommand();

        switch (sub) {
            case "facts": {
                const fact = options.getString("text");

                const image = new AttachmentBuilder(`https://api.popcat.xyz/facts?text=${fact}`, { name: "fact.png" });

                return interaction.reply({ files: [image] });
            }
        }
    }
};
