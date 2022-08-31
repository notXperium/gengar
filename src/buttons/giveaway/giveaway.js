const Giveaway = require("../../structures/modules/Giveaway");

module.exports = {
    id: "giveaway",

    run: (interaction, client) => {
        new Giveaway().enter(interaction, client);
    }
};
