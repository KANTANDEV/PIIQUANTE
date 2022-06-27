// On importe mongoose
const mongoose = require('mongoose');
// On importe le package unique validator
const uniqueValidator = require('mongoose-unique-validator');

// on cree notre schema de donnees
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
// on applique le plugin unique validator a notre schema de donnees
userSchema.plugin(uniqueValidator);
// On exporte notre schemat de donnees utilisateur
module.exports = mongoose.model('User', userSchema);