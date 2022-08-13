const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    id: "lockTicket",
    permission: "SendMessages",

    run: (interaction) => {
        new Ticket().lock(interaction);
    }
};
