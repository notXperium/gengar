const { SchemaTypes, model, Schema } = require("mongoose");

const GuildSchema = new Schema({
    id: SchemaTypes.String,
    name: SchemaTypes.String,
    premium: { type: SchemaTypes.Boolean, default: false },

    ticketSystem: {
        category: SchemaTypes.String || null,
        transcript: SchemaTypes.String || null,
        create: SchemaTypes.String || null,
        role: SchemaTypes.String || null,
        count: SchemaTypes.Number || null
    },

    tickets: [
        {
            channel: SchemaTypes.String,
            user: SchemaTypes.String,
            locked: SchemaTypes.Boolean
        }
    ],

    giveaway: [
        {
            channel: SchemaTypes.String,
            message: SchemaTypes.String,
            winners: SchemaTypes.Number,
            prize: SchemaTypes.String,
            end: SchemaTypes.String,
            paused: SchemaTypes.Boolean,
            ended: SchemaTypes.Boolean,
            host: SchemaTypes.String,
            entered: [SchemaTypes.String]
        }
    ],

    ranking: [
        {
            user: SchemaTypes.String,
            level: SchemaTypes.Number,
            required: SchemaTypes.Number,
            xp: SchemaTypes.Number,
            fullXp: SchemaTypes.Number
        }
    ],

    channels: {
        ranking: SchemaTypes.String || null,
        general: SchemaTypes.String || null,
        voice: SchemaTypes.String || null,
        moderation: SchemaTypes.String || null
    }
});

module.exports = model("guild", GuildSchema);
