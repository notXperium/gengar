const Brain = require("../../structures/utilities/Brain");
const Schema = require("../../structures/schemas/Guild");

module.exports = {
    name: "messageCreate",

    run: async (message, client) => {
        if (!message.guild || message.author.bot) return;

        if (new RegExp(`^<@!?(${client.user.id})>$`).test(message.content)) {
            const response = await message.reply({
                embeds: [
                    message.client
                        .embed()
                        .setTitle(`Hello! My Name Is ${client.user.username}!`)
                        .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                        .setDescription(
                            `**I am here to improve your Discord Server!** \n Run \`/help\` if you want to know how I work!\n\n*If you want to report a problem, please contact our [team](${message.client.utils.url.support})!*`
                        )
                ]
            });

            setTimeout(() => {
                if (!response) return;
                response.delete();
                message.delete();
            }, 40000);
        }

        new Brain().say(message).catch(() => null);

        const data = await Schema.findOne({ id: message.guild.id }) || await Schema.create({
            id: message.guild.id,
            name: message.guild.name,
            ticketSystem: {
                category: null,
                transcript: null,
                create: null,
                role: null,
                count: null
            },
            tickets: [],

            ranking: [],

            channels: {
                ranking: null
            }
        });

        if (data && message.content) {
            const multiplier = 1500;
            const minXp = 100;
            const maxXp = 300;

            const random = genXP(minXp, maxXp)

            const userRanking = data.ranking.filter(_ => _.user === message.author.id);

            if (!userRanking.length) {
                await Schema.updateOne({ id: message.guild.id }, {
                    $push: {
                        ranking: {
                            user: message.author.id,
                            level: 1,
                            required: multiplier - random,
                            xp: random,
                            fullXp: random,
                        }
                    }
                })
            }

            const { user, level, xp, fullXp, required } = userRanking[0]
            
            const next = level * multiplier;

            if ((xp + random) >= next) {
                await Schema.updateOne({ id: message.guild.id }, {
                    $pull: {
                        ranking: {
                            user: message.author.id
                        }
                    }
                })

                await Schema.updateOne({ id: message.guild.id }, {
                    $push: {
                        ranking: {
                            user: user,
                            level: level + 1,
                            required: (level + 1) * multiplier,
                            xp: 0,
                            fullXp: fullXp + random,
                        }
                    }
                })


                if (data.channels.ranking) {
                    const ch = message.guild.channels.cache.get(data.channels.ranking);

                    if (!ch) return;

                    ch.send({
                        embeds: [
                            message.client.embed()
                                .setThumbnail(message.author.displayAvatarURL({ size: 4096, dynamic: true }))
                                .setTitle("Level UP!")
                                .setDescription(`<@${message.author.id}> **is now Level: ${level + 1}**`)
                        ]
                    })
                    return;
                }

                message.reply({
                    embeds: [
                        message.client.embed()
                            .setThumbnail(message.author.displayAvatarURL({ size: 4096, dynamic: true }))
                            .setTitle("Level UP!")
                            .setDescription(`<@${message.author.id}> **is now Level: ${level + 1}**`)
                    ]
                })
            } else {
                await Schema.updateOne({ id: message.guild.id }, {
                    $pull : {
                        ranking: {
                            user: message.author.id
                        }
                    }
                })

                await Schema.updateOne({ id: message.guild.id }, {
                    $push : {
                        ranking: {
                            user: message.author.id,
                            level: level,
                            required: required - random,
                            xp: xp + random,
                            fullXp: fullXp + random,
                        }
                    }
                })
            }
        }
    }
};
function genXP(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
