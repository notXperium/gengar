const { CommandType, CommandOptionType } = require("../../structures");
const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    name: "ticket",
    description: "setup ticket system",
    permission: "Administrator",
    options: [
        {
            name: "status",
            description: "enable/disable ticket system",
            type: CommandOptionType.Boolean,
            required: true
        },
        {
            name: "role",
            description: "staff role",
            type: CommandOptionType.Role,
            required: false
        }
    ],
    type: CommandType.ChatInput,

    run: (interaction) => {
        new Ticket().setup(interaction);
    }
};
