module.exports = async (client, PG) => {
    const dir = await PG(`${process.cwd()}/src/buttons/**/*.js`);

    dir.map(async (_) => {
        const button = require(_);

        if (!button.id) return client.logger.warn("button", `Invalid Id at ${_}`);

        const perms = Object.keys(require("discord.js").PermissionsBitField.Flags);

        if (button.permission && !perms.includes(button.permission))
            return client.logger.warn("button", `Invalid Permission at ${_}`);

        client.buttons.set(button.id, button);
    });
};
