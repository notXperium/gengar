const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Logger = require("../utilities/Logger");

module.exports = class Giveaway {
    async create(interaction, client, args) {
        if (!interaction || !client || !args)
            return new Logger().error("giveaway", "invalid arguments while creating a giveaway");

        const { prize, winners, time, channel } = args || null;

        console.log(args);
    }
};
