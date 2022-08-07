const { Events } = require("../misc/validation");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = async (client) => {
    const paths = await PG(`${process.cwd()}/src/events/**/*.js`);
    paths.map(async (_) => {
        const event = require(_);

        if (!event.name || !Events.includes(event?.name)) {
            client.logger.warn("event", `invalid event name at ${_}!`);
            process.exit();
        }

        event.dir = _;

        client.events.set(event.name, event);

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }
    });

    if (paths.length) client.logger.info("event", `loaded ${paths.length} ${paths.length <= 1 ? "event" : "events"}!`);
};
