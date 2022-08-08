const Ticket = require("../../structures/modules/Ticket");

module.exports = {
    id: "create",
    permission: "SendMessages",

    run: (interaction) => {
        new Ticket().create(interaction);
    }
};
