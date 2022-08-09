const Logger = require("./Logger")

class Utils {

    split(text) {
        return text
            .split("_")
            .map((_) => _[0].toUpperCase() + _.slice(1).toLowerCase())
            .join(" ");
    }

    beautify(value, beautify = true) {
        if (beautify) return this.split(value.replace(/ /g, "_"));
        return value.replace(/ /g, "_").toLowerCase();
    }

    format(x) {
        return `${x[0].toUpperCase()}${x.slice(1).toLowerCase()}`;
    }

    formatNumber(x) {
        if(!typeof x === "number") return new Logger().warn("formatNumber", "invalid number!");
        return x.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }

    utils = {
        colors: {
            normal: "#2f3136",
            success: "#1dfc00",
            n: "#7500d9",
            failed: "#f23a3a",
            dev: "#debb47"
        },

        url: {
            rickroll: "https://www.youtube.com/watch?v=xvFZjo5PgG0",
            support: "https://discord.gg/urj2yRH2W7"
        },

        emojis: {
            uncheck: "<:icons_Wrong:994544923875479616>",
            sussy: "<a:8010sussy:960497349606641674>",
            loading: "<a:Loading:960497331940257824>",
            checkmark: "<:icons_Correct:994544912450191400>"
        },

        id: {
            team: ["591382368057819137", "714765234036015104"],
            owner: "714765234036015104"
        }
    };
}

module.exports = Utils;
