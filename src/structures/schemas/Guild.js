const { SchemaTypes, model, Schema } = require("mongoose");

const GuildSchema = new Schema({
    id: SchemaTypes.String,
    name: SchemaTypes.String,

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
        ranking: SchemaTypes.String || null
    }
});

module.exports = model("guild", GuildSchema);
