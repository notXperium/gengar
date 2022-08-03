const Translator = require("@iamtraction/google-translate");
const Detector = require("detectlanguage");
const Logger = require("./Logger");
const axios = require("axios");

module.exports = class Brain {
    async say(message) {
        if (!message) return new Logger().warn("chatbot", "please provide a valid message");

        if (!message.content) return;

        if (!message.content.toLowerCase().startsWith(message.client.user.username.toLowerCase())) return;

        const bid = process.env.BRAIN_BID;
        const key = process.env.BRAIN_KEY;

        let input = message.content.slice(message.client.user.username.length);

        const detcted = new Detector(process.env.LANGUAGE_KEY);

        const langData = await detcted.detect(input);

        const lang = langData[0].language;

        if (lang != "en") input = await Translator(input, { from: lang, to: "en" });

        if (lang != "en" && !input.text)
            return message.channel.send({ content: "I have no clue what to say..." }).catch(() => null);

        const options = {
            method: "GET",
            url: "http://api.brainshop.ai/get",
            params: { bid: bid, key: key, uid: "1", msg: input.text ? input.text : input }
        };

        const res = await axios.request(options);

        if (!res.data.cnt) return message.channel.send({ content: "I have no clue what to say..." }).catch(() => null);

        if (lang == "en") return message.channel.send({ content: res.data.cnt }).catch(() => null);

        const output = await Translator(res.data.cnt, { from: "en", to: lang }).catch(() =>
            message.channel.send({ content: "I have no clue what to say..." })
        );

        if (output.text) return message.channel.send({ content: output.text });
    }
};
