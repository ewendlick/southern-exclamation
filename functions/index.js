const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')

const app = express()

const rating = {
  all: ['general', 'adult'],
  G: ['general'], // Rated G for General Audiences
  R: ['adult'] // Rated R for Restricted aka adult
}

const ratingOrder = [
  'general',
  'adult',
]

const verbs = {
  general: [
    'slap',
    'pinch',
    'butter',
    'smack',
    'paint',
    'paint',
    'shave',
    'wet',
    'kick',
    'kiss',
    'steal',
    'caress'
  ],
  adult: [
    'tongue-punch',
    'donkey-punch',
    'fuck'
  ]
}

const objects = {
  general: [
    'my biscuit',
    'my biscuits',
    'my tacklebox',
    'my toolshed',
    'me silly',
    'my nipples',
    'my legs'
  ],
  adult: [
    'my ass',
    'my lips',
    'my keyhole',
    'my butthole',
    'my snatch'
  ]
}

const verbObjectCombos = {
  general: [
    'shiver me timbers',
    'lather me head to toe in honey',
    'spin me around in a centrifuge'
  ],
  adult: [
  ]
}

const names = {
  general: [
    'Sally',
    'Delilah',
    'Phoebe',
    'Judy',
    'Susan',
    'Clementine',
    'Sandy',
    'Samantha',
    'crazy',
    'saucy',
    'a hypocrite',
    'a donkey',
    'a monkey'
  ],
  adult: [
  ]
}

const sentences = {
  general: [
    'Well, smack my ass and call me a newborn.',
    'Well, paint me green and call me a cucumber.',
    'Well, slap me with bread and call me a sandwich.',
    'Well, pin my tail and call me a donkey.',
    'Well, fry me in butter and call me a catfish.',
    'Well, saddle my back and call me a horse.',
    'Well, knock me down and steal my teeth.',
    'Well, dip me in mustard and call me a hotdog.',
    'Well, butter my butt and call me a biscuit,',
    'Well, slap my salami and call me a commie.',
    'Well, I just met you, and this is crazy, but here\'s my Number, so call me maybe.'
  ],
  adult: [
    'Well, paint my ass red and call me a baboon.',
  ]
}

const getRatingGroups = (target, rating) => {


// TODO: in here



  target = target.reduce(t => {
    // if the key is in
    // TODO: all 
  })
  // Are target rating results empty? Use the fallback to get more results


}

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

const run = (rating = 'G') => {
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
app.get('/', (req, res) => res.send(run('G')))
app.post('/', (req, res) => res.send(run('G')))

app.get('/all', (req, res) => res.send(run('all')))
app.post('/all', (req, res) => res.send(run('all')))

app.get('/adult', (req, res) => res.send(run('R')))
app.post('/adult', (req, res) => res.send(run('R')))

// Expose Express API as a single Cloud Function
exports.southernShockApi = functions.https.onRequest(app)
