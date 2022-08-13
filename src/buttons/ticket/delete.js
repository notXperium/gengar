const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    id: "deleteTicket",
    permission: "SendMessages",

    run: (interaction) => {
        new Ticket().delete(interaction);
    }
};
