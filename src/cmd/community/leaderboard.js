const { CommandType } = require("../../structures");
const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "leaderboard",
    description: "Shows the Ranking leaderboard",
    usage: "</leaderboard {user}>",
    type: CommandType.ChatInput,

    run: async (interaction, client) => {

        const data = await Schema.findOne({ id: interaction.guild.id });

        if (!data) return interaction.reply({ content: "Please try again later!", ephemeral: true }) && await Schema.create({
            id: interaction.guild.id,
            name: interaction.guild.name,
            ticketSystem: {
                category: null,
                transcript: null,
                create: null,
                role: null,
                count: null
            },
            tickets: [],

            giveaways: [],

            ranking: [],

            channels: {
                ranking: null,
                general: null,
                voice: null,
                moderation: null
            }
        });

        const ranking = [...new Set(data.ranking.sort((a, b) => b.fullXp - a.fullXp))].slice(0, 10);

        if (!ranking?.length)
            return interaction.reply({
                embeds: [client.embed("error").setTitle("There is no leaderboard for this guild!")],
                ephemeral: true
            });
        ranking.map((_) => {
            const rank = ranking.map((x) => x.user).indexOf(_.user) + 1;
            console.log(rank)
        })
        return interaction.reply({
            embeds: [
                client.embed()
                    .setTitle("Leaderboard")
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 4096 }))
                    .setDescription(`
                ${ranking.map((_) => {
                        const rank = ranking.map((x) => x.user).indexOf(_.user) + 1;
                        return `\`${rank}.\` <@${_.user}> **Level » ${_.level} (\`${_.fullXp}Xp\`)**`
                    }).join("\n")}
                `)
            ]
        })
    }
}