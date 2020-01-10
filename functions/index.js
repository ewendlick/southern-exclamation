const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')

const app = express()


const verbs = [
  'slap',
  'pinch',
  'butter',
  'smack',
  'paint',
  'glaze',
  'shave',
  'wet',
  'kick',
  'kiss',
  'steal',
  'caress'
]

const objects = [
  'my biscuit',
  'my biscuits',
  'my tacklebox',
  'my toolshed',
  'me silly',
  'my ass',
  'my nipples',
  'my legs'
]

const verbObjectCombos = [
  'shiver me timbers',
  'lather me head to toe in honey',
  'spin me around in a centrifuge'
]

const names = [
  'Sally',
  'Delilah',
  'Phoebe',
  'Catydid',
  'Judy',
  'Susan',
  'Clementine',
  'Sandy',
  'Samantha',
  'crazy',
  'saucy',
  'a hypocrite',
  'a donkey',
  'a monkey',
  'a ferret'
]

const sentences = [
  'Well, smack my ass and call me a newborn.',
  'Well, paint me green and call me a cucumber.',
  'Well, slap me with bread and call me a sandwich.',
  'Well, pin my tail and call me a donkey.',
  'Well, fry me in butter and call me a catfish.',
  'Well, saddle my back and call me a horse.',
  'Well, knock me down and steal my teeth.',
  'Well, dip me in mustard and call me a hotdog.',
  'Well, butter my butt and call me a biscuit,',
  'Well, paint my ass red and call me a baboon.',
  'Well, slap my salami and call me a commie.',
  'Well, I just met you, and this is crazy, but here\'s my Number, so call me maybe.'
]

const getRandomFrom = (target) => {
  return target[Math.floor(Math.random() * target.length)]
}

const getSentence = () => {
  return getRandomFrom(sentences)
}

const buildFromVerbObjectCombo = () => {
  return `Well, ${getRandomFrom(verbObjectCombos)} and call me ${getRandomFrom(names)}`
}

const buildFromVerbAndObject = () => {
  return `Well, ${getRandomFrom(verbs)} ${getRandomFrom(objects)} and call me ${getRandomFrom(names)}`
}

const probabilities = [
  {
    weight: 10,
    action: getSentence
  },
  {
    weight: 2,
    action: buildFromVerbObjectCombo
  },
  {
    weight: 50,
    action: buildFromVerbAndObject
  }
]

const run = () => {
  if (probabilities === undefined || probabilities[0] === undefined) {
    throw new Error('Could not find probabilities!')
  }

  const totalWeight = probabilities.reduce((acc, probability) => acc + probability.weight, 0)
  const targetWeight = Math.floor(Math.random() * totalWeight) // from 0 to (probabilties.length - 1)

  for(let i = 0, currentWeight = 0; i < totalWeight; i++, currentWeight += probabilities[i].weight) {
    if (probabilities[i + 1] === undefined || targetWeight < probabilities[i].weight) {
      return {
        'response_type': 'in_channel',
        'text': probabilities[i].action()
      }
    }
  }

  throw new Error('Unknown error')
}


// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

// NOTE: Slack only uses POST. GET is for testing functionality more easily in the browser
app.get('/', (req, res) => res.send(run()))
app.post('/', (req, res) => res.send(run()))

// Expose Express API as a single Cloud Function
exports.southernShockApi = functions.https.onRequest(app)
