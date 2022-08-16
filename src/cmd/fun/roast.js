const { roast } = require("../../structures/json/roast.json");
const { CommandType, CommandOptionType } = require("../../structures");

module.exports = {
    name: "roast",
    description: "roast someone",
    usage: "</roast {user}",
    options: [
        {
            name: "user",
            description: "the user you want to roast",
            required: true,
            type: CommandOptionType.User
        }
    ],
    type: CommandType.ChatInput,

    run: (interaction, client) => {

        const member = interaction.options.getMember("user");

        const data = roast[Math.floor(Math.random() * roast.length - 0)];

        return interaction.reply({content: `<@${member.user.id}> ${data}`})
    }

}