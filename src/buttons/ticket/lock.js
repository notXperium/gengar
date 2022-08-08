const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    id: "lockTicket",
    permission: "SendMessages",

    run: (interaction) => {
        return interaction.reply({ content: "Please try again later!", ephemeral: true });

        new Ticket().lock(interaction);
    }
};
