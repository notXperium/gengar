const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    id: "reopen-ticket",
    permission: "SendMessages",

    run: (interaction) => {
        new Ticket().reopen(interaction);
    }
};
