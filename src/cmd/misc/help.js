const { Util, CommandType, ComponentType } = require("../../structures");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "show help menu",
    usage: "<help>",
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.member;
        const util = new Util();

        let dir = [...new Set(client.commands.map((cmd) => cmd.category))];

        if (dir.some((x) => x == "dev")) {
            dir = dir.filter((x) => x !== "dev");
        }

        const categories = dir.map((dir) => {
            const cmds = client.commands
                .filter((cmd) => cmd.category === dir)
                .map((cmd) => {
                    return {
                        name: cmd.name || "Unknown Name",
                        description: cmd.description || "Unknown Description"
                    };
                });
            return {
                category: dir,
                commands: cmds
            };
        });

        const start = client
            .embed()
            .setTitle("Help Menu")
            .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
            .setDescription(
                `*Please Choose A Category* \n **Links: [Support](${client.utils.url.support}) | [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)**`
            );

        const loading = client.embed().setTitle(`${client.utils.emojis.loading} Loading....`);

        const comp = (bool) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                    .setCustomId("help")
                    .setPlaceholder("Please choose a category!")
                    .setDisabled(bool)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: util.format(cmd.category),
                                value: cmd.category.toLowerCase(),
                                description: `Show all commands from category: ${util.format(cmd.category)}!`,
                                emoji: "<:icons_text5:995967324744061020>" || null
                            };
                        })
                    )
                    .addOptions([
                        {
                            label: "Exit",
                            value: "exit",
                            description: "Close the Help Menu",
                            emoji: "<:icons_xmarkwhite:988409378161954866> " || null
                        }
                    ])
            )
        ];

        const message = await member.user.send({ embeds: [loading] }).catch(() => null);

        interaction.reply({
            embeds: [
                client
                    .embed()
                    .setTitle("Help Menu")
                    .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                    .setDescription(`The Help Menu has been send to your Dms!`)
            ],
            ephemeral: true
        });

        setTimeout(async () => {
            const update = await message.edit({
                embeds: [start],
                components: comp(false)
            });

            const collector = message.channel.createMessageComponentCollector({
                componentType: ComponentType.SelectMenu,
                time: 60000
            });

            collector.on("collect", async (interaction) => {
                if (interaction.channel != message.channel) return;

                const id = interaction.values[0];

                if (id === "exit") {
                    update.delete().catch(() => null);
                }

                const category = categories.find((i) => i.category.toLowerCase() === id);

                if (!category) return;

                interaction
                    .update({
                        embeds: [
                            client
                                .embed()
                                .setTitle(util.format(id) + " Commands")
                                .setThumbnail(client.user.displayAvatarURL({ size: 4096, dynamic: true }))
                                .setDescription(
                                    "**Commands:**\n\n" +
                                        category.commands
                                            .map((x) => {
                                                return `**[${util.format(x.name)}](${
                                                    client.utils.url.support
                                                })** ➞ ${util.format(x.description)}`;
                                            })
                                            .join("\n")
                                )
                        ]
                    })
                    .catch(() => null);
            });

            collector.on("end", (interaction) => {
                if (!update) return;

                if (interaction.message) {
                    update.edit({
                        embeds: [start],
                        components: comp(true)
                    });
                    setTimeout(() => {
                        update.delete();
                        return;
                    }, 60000);
                }
            });
        }, 1000);
    }
};
