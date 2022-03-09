const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  kayttajanimi: String,
  nimi: String,
  salasanaHash: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.salasanaHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User