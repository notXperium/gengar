const { CommandType, CommandOptionType} = require("../../structures");
const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "logging",
    description: "Configures logging",
    usage: "</logging [type] {status} {channel}>",
    options: [],
    type: CommandType.ChatInput,
}