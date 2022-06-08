const mongoose = require('mongoose')

// muuttujien nimissähän suomenkielisiä ja engkielisiä ei ole hyvän käytänteen mukaista sekoittaa, mutta menkööt harjoituksessa
const userSchema = mongoose.Schema({
  kayttajanimi: {
    type: String,
    minlength: 3,
    require: true
  },
  nimi: String,
  salasanaHash: {
    type: String,
    minlength: 3,
    require: true
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
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