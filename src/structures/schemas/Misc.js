const { SchemaTypes, model, Schema } = require("mongoose");

const MiscSchema = new Schema({
    team: SchemaTypes.Array,
    blacklistedUser: SchemaTypes.Array,
    blacklistedGuild: SchemaTypes.Array,
    owner: SchemaTypes.String
});

module.exports = model("misc", MiscSchema);
