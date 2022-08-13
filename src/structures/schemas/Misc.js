const { SchemaTypes, model, Schema } = require("mongoose");

const MiscSchema = new Schema({
    team: SchemaTypes.Array,
    blacklistedUser: [
        {
            id: SchemaTypes.String,
            name: SchemaTypes.String,
            reason: SchemaTypes.String
        }
    ],
    blacklistedGuild: [
        {
            id: SchemaTypes.String,
            name: SchemaTypes.String,
            reason: SchemaTypes.String
        }
    ],
    owner: SchemaTypes.String
});

module.exports = model("misc", MiscSchema);
