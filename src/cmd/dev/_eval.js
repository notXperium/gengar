const { CommandType, CommandOptionType } = require("../../structures");
const { inspect } = require("util");

module.exports = {
    name: "_eval",
    description: "evaluate code",
    devOnly: true,
    options: [
        {
            name: "code",
            description: "code to evaluate",
            type: CommandOptionType.String,
            required: true
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const start = Date.now();

        const code = interaction.options.getString("code");

        if (code.includes("env"))
            return interaction.reply({
                embeds: [client.embed("error").setTitle("HAHA nice Try").setDescription("Imagine getting my secrets")]
            });

        try {
            const result = await eval(code);

            let output = result;

            
            if (typeof result !== "string") {
                output = inspect(result);
            }

            if (output.length > 4069)
                return interaction.reply({
                    embeds: [client.embed("error").setTitle("output is too long!")],
                    ephemeral: true
                });
            interaction.reply({
                embeds: [client.embed().setDescription(`${client.utils.emojis.loading} Loading...`)]
            });

            setTimeout(() => {
                interaction.editReply({
                    embeds: [
                        client
                            .embed("debug")
                            .setTitle("Evaluation Results")
                            .setDescription(
                                `*Executed in ${Math.round(Date.now() - start)}ms!*\n\`\`\`js\n${output.slice(
                                    0,
                                    4096
                                )}\`\`\``
                            )
                    ]
                });
            }, 1000);
        } catch (e) {
            interaction.reply({
                embeds: [
                    client
                        .embed("error")
                        .setTitle("⚠️There was an error!⚠️")
                        .setDescription(`\n\n**Error:** ${e.name} \n\`\`\`${e.message}\`\`\``)
                ],
                ephemeral: true
            });
        }
    }
};
