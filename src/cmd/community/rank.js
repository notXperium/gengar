const { CommandType, CommandOptionType } = require("../../structures");
const Schema = require("../../structures/schemas/Guild");
const { AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: "rank",
    description: "show user's rank",
    options: [
        {
            name: "user",
            description: "user to show rank of",
            required: false,
            type: CommandOptionType.User
        }
    ],
    type: CommandType.ChatInput,

    run: async (interaction, client) => {
        const member = interaction.options.getMember("user") || interaction.member;

        const data = await Schema.findOne({ id: interaction.guild.id })

        if (!data) return interaction.reply({ content: "Please try again later!", ephemeral: true });

        const ranking = data.ranking.filter(_ => _.user === member.user.id);

        if (!ranking?.length) return interaction.reply({
            embeds: [
                client.embed("error")
                    .setTitle("This user has no rank!")
            ], ephemeral: true
        })

        const canvas = Canvas.createCanvas(1000, 300);
        const ctx = canvas.getContext("2d");
        const barWidth = 600;

        const background = await Canvas.loadImage(`${process.cwd()}/assets/background.png`);
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ dynamic: false, size: 4096, extension: "png" }));

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // avatar circle
        ctx.beginPath();
        ctx.arc(130, 130, 110, 0, 2 * Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = client.utils.colors.normal
        ctx.stroke();
        ctx.closePath();

        // XP bar
        ctx.lineJoin = "round";
        ctx.lineWidth = 69

        // XP bar shwadow
        ctx.strokeRect(318, 199, barWidth, 2);

        // empty bar
        ctx.strokeStyle = client.utils.colors.normal;
        ctx.strokeRect(320, 200, barWidth, 0);

        // filled bar
        ctx.strokeStyle = client.utils.colors.n;
        ctx.strokeRect(320, 200, (1 / (ranking[0].required + ranking[0].xp) * ranking[0].xp) * barWidth, 0);

        // username 
        ctx.font = "bold 40px Sans";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(member.user.username, 130, 285, 200);

        // percentage of xp
        ctx.font = "bold 30px Sans";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("XP: " + ranking[0].xp, 764, 150, 200);
        ctx.fillText(ranking[0].required + ranking[0].xp, 889, 150, 200);
        ctx.fillText(`Level: ${ranking[0].level}`,  370, 150, 200)

        ctx.font = "bold 35px Sans";
        ctx.fillStyle = client.utils.colors.normal;
        ctx.textAlign = "center";
        ctx.fillText(" / ", 843, 150, 200);

        // remove corners
        ctx.beginPath();
        ctx.arc(130, 130, 110, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        // avatar
        ctx.drawImage(avatar, 20, 20, 220, 220)

        const at = new AttachmentBuilder(canvas.toBuffer(), "rank.png")

        interaction.reply({ files: [at] })
    }
}