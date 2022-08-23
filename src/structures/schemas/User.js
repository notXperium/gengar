const { SchemaTypes, model, Schema } = require("mongoose");

const UserSchema = new Schema({
    id: SchemaTypes.String,
    premium: { type: SchemaTypes.Boolean, default: false }
});

module.exports = model("user", UserSchema);
