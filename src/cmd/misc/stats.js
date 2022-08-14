const { CommandType } = require("../../structures");
const package = require("../../../package.json");
const { version } = require("discord.js");
const os = require("os");

module.exports = {
    name: "stats",
    usage: "</stats>",
    description: "show bot stats",
    type: CommandType.ChatInput,

    run: (interaction, client) => {
        const load = client.embed().setDescription(`${client.utils.emojis.loading} Loading`);

        interaction.reply({ embeds: [load] });

        const avatar = client.user.displayAvatarURL({ size: 4096, dynamic: true });

        setTimeout(() => {
            interaction.editReply({
                embeds: [
                    client.embed().setThumbnail(avatar).setDescription(`**➥ General information: \n
                       • Developer: <@${client.owner}> ([Xperium#0001](${client.utils.url.support}))
                       • Bot Version: [${package.version}](${client.utils.url.support})
                       • Language: [Javascript ](${client.utils.url.support})([Note.js@${process.version}](${
                        client.utils.url.support
                    }))
                       • Library: [Discord.js@v${version}](${client.utils.url.support})
                       • Database: [MongoDB](${client.utils.url.support})
                       • System: [${process.platform.replace("win32", "Windows")}](${client.utils.url.support})
                       • Created At: <t:${parseInt(client.user.createdTimestamp / 1000)}:R>
                       • Uptime: <t:${parseInt(client.readyTimestamp / 1000)}:R> \n
                       ➥ Statistics: 
                       \`\`\`js\n
• Guilds         :: ${client.guilds.cache.size} 
• User           :: ${client.users.cache.size}
        
• Commands       :: ${client.commands.size} 
• Events         :: ${client.events.size} 
        
• Ping           :: ${interaction.client.ws.ping} ms  
• Memory Usage   :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} %  
• CPU Cores      :: ${os.cpus().length}
• CPU Speed      :: ${os.cpus()[0].speed} MHz      
• CPU Model      :: ${os.cpus()[0].model.slice(0, 17)}
        \`\`\`**`)
                ]
            });
        }, 2000);
    }
};
