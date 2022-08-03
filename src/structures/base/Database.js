const { connect } = require("mongoose");
class Database {
    async createConnection(client) {
        const start = Date.now();

        await connect("mongodb://localhost/discord", {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then((m) => {
                const states = m.connections[0].states;

                const array = [m.connections[0]._readyState, m.connections[0].name, m.connections[0].host];

                client.logger.info(
                    "database",
                    `Connected To Database | System: ${process.platform.replace("win32", "windows")} | Status: ${
                        states[array[0]]
                    } | Database: ${array[1]} | Host: ${array[2]} | Latency: ${Math.round(Date.now() - start)}ms`
                );
            })
            .catch((err) => client.logger.error("database", err));
    }
}

module.exports = Database;
