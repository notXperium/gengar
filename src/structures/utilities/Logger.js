const Colors = require("colors");

module.exports = class Logger {
    options = { year: "numeric", month: "numeric", day: "numeric" };
    date = new Date();

    timestamp = Colors.blue.bold(
        this.date.toLocaleDateString("de", this.options) +
            " ~ " +
            this.date.getHours() +
            ":" +
            this.date.getMinutes() +
            ":" +
            this.date.getSeconds()
    );

    info = (lable, content) => {
        if (!lable || !content) return new TypeError("Please Provide a lable and content!");

        return console.log(
            "[".white +
                Colors.magenta.bold("INFO") +
                "]".white +
                " [".white +
                this.timestamp +
                "]".white +
                " [".white +
                Colors.magenta.bold(lable.toUpperCase()) +
                "] » ".white +
                Colors.white.bold(content)
        );
    };

    success = (lable, content) => {
        if (!lable || !content) return new TypeError("Please Provide a lable and content!");

        return console.log(
            "[".white +
                Colors.green.bold("SUCCESS") +
                "]".white +
                " [".white +
                this.timestamp +
                "]".white +
                " [".white +
                Colors.green.bold(lable.toUpperCase()) +
                "] » ".white +
                Colors.white.bold(content)
        );
    };

    warn = (lable, content) => {
        if (!lable || !content) return new TypeError("Please Provide a lable and content!");

        return console.log(
            "[".white +
                Colors.yellow.bold("WARN") +
                "]".white +
                " [".white +
                this.timestamp +
                "]".white +
                " [".white +
                Colors.yellow.bold(lable.toUpperCase()) +
                "] » ".white +
                Colors.white.bold(content)
        );
    };

    error = (lable, content) => {
        if (!lable || !content) return new TypeError("Please Provide a lable and content!");

        return console.log(
            "[".white +
                Colors.red.bold("ERROR") +
                "]".white +
                " [".white +
                this.timestamp +
                "]".white +
                " [".white +
                Colors.red.bold(lable.toUpperCase()) +
                "] » ".white +
                Colors.white.bold(content)
        );
    };
};
