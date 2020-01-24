const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {ALLOW_FALLBACKS, ALLOW_RATING_OVERRIDE, RATINGS, VERB_OBJECT_COMBOS, NAMES} = require('./constants')

const app = express()
// Support URL-encoded bodies such as those in Slack
app.use(bodyParser.urlencoded({
  extended: true
}))
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

const getPossibleTargets = (target, targetRating) => {
  if (!RATINGS[targetRating]) throw new Error(`Invalid targetRating ${targetRating}!`)

  let possibleTargets = []
  for (let [key, value] of Object.entries(target)) {
    if (RATINGS[targetRating].includes(key)) {
      possibleTargets = possibleTargets.concat(target[key])
    }
  }

  if (possibleTargets.length === 0) {
    if (ALLOW_FALLBACKS) {
      possibleTargets = target.general
    } else {
      throw new Error(`No values found!`)
    }
  }

  return possibleTargets
}

const getRandomFrom = (target, rating) => {
  const possibleTargets = getPossibleTargets(target, rating)
  return possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
}

const getSentence = (rating) => {
  return getRandomFrom(SENTENCES, rating)
}

const buildFromVerbObjectCombo = (rating) => {
  return `Well, ${getRandomFrom(VERB_OBJECT_COMBOS, rating)} and call me ${getRandomFrom(NAMES, rating)}`
}

const buildFromVerbAndObject = (rating) => {
  return `Well, ${getRandomFrom(VERBS, rating)} ${getRandomFrom(OBJECTS, rating)} and call me ${getRandomFrom(NAMES, rating)}`
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

const run = (req, rating = 'general') => {
  // If "text" parameter exists and is valid, override rating
  if (ALLOW_RATING_OVERRIDE && req.route.methods.post && req.body.text) {
    const passedText = req.body.text.toLowerCase()

    if (RATINGS[passedText]) {
      rating = passedText
    }
  }

  if (probabilities === undefined || probabilities[0] === undefined) {
    throw new Error('Could not find probabilities!')
  }

  const totalWeight = probabilities.reduce((acc, probability) => acc + probability.weight, 0)
  const targetWeight = Math.floor(Math.random() * totalWeight) // from 0 to (probabilties.length - 1)

  for(let i = 0, currentWeight = 0; i < totalWeight; i++, currentWeight += probabilities[i].weight) {
    if (probabilities[i + 1] === undefined || targetWeight < probabilities[i].weight) {
      return {
        'response_type': 'in_channel',
        'text': probabilities[i].action(rating)
      }
    }
  }

  throw new Error('Unknown error')
}


// NOTE: Slack only uses POST. GET is for testing functionality more easily in the browser
app.get('/', (req, res) => res.send(run(req, 'general')))
app.post('/', (req, res) => res.send(run(req, 'general')))

app.get('/all', (req, res) => res.send(run(req, 'all')))
app.post('/all', (req, res) => res.send(run(req, 'all')))

app.get('/adult', (req, res) => res.send(run(req, 'adult')))
app.post('/adult', (req, res) => res.send(run(req, 'adult')))

exports.getPossibleTargets = getPossibleTargets

// Expose Express API as a single Cloud Function
exports.southernShockApi = functions.https.onRequest(app)
