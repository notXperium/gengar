const { CommandOptionType, CommandType } = require("../../structures");

module.exports = {
    name: "_blacklist",
    description: "blacklist user",
    usage: "<blacklist>",
    options: [
        {
            name: "add",
            description: "add blacklist",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "type of blacklist",
                    choices: [
                        {
                            name: "server",
                            value: "0"
                        },
                        {
                            name: "user",
                            value: "1"
                        }
                    ],
                    type: CommandOptionType.String,
                    required: true
                }, 
                {
                    name: "id",
                    description: "enter id",
                    type: CommandOptionType.String,
                    min_length: 18,
                    max_length: 18,
                    required: true
                    
                },
                {
                    name: "reason",
                    description: "reason for blacklist",
                    type: CommandOptionType.String,
                    required: true
                }
            ]
        }, 
        {
            name: "remove",
            description: "add blacklist",
            type: CommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "type of blacklist",
                    choices: [
                        {
                            name: "server",
                            value: "0"
                        },
                        {
                            name: "user",
                            value: "1"
                        }
                    ],
                    type: CommandOptionType.String,
                    required: true
                },
                {
                    name: "id",
                    description: "enter id",
                    type: CommandOptionType.String,
                    min_length: 18,
                    max_length: 18,
                    required: true
                },
                {
                    name: "reason",
                    description: "reason for blacklist",
                    type: CommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    type: CommandType.ChatInput,
    devOnly: true,

    run: async (interaction, client) => {

    }
}