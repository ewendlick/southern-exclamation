const { ALLOW_FALLBACKS, ALLOW_RATING_OVERRIDE } = require("./constants")
const getSettings = require("./settings")

const getPossibleTargets = async (target, targetRating) => {
  const { ratings } = await getSettings()
  if (!ratings[targetRating]) throw new Error(`Invalid targetRating ${targetRating}!`)

  let possibleTargets = []
  for (let [key] of Object.entries(target)) {
    if (ratings[targetRating].includes(key)) {
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

const getRandomFrom = async (target, rating) => {
  const possibleTargets = await getPossibleTargets(target, rating)
  return possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
}

const getSentence = async (rating) => {
  const { sentences } = await getSettings()
  return getRandomFrom(sentences, rating)
}

const buildFromVerbObjectCombo = async (rating) => {
  const { names, verbObjectCombo } = await getSettings()
  return `Well, ${await getRandomFrom(verbObjectCombo, rating)} and call me ${await getRandomFrom(
    names,
    rating
  )}`
}

const buildFromVerbAndObject = async (rating) => {
  const { verbs, objects, names } = await getSettings()

  return `Well, ${await getRandomFrom(verbs, rating)} ${await getRandomFrom(
    objects,
    rating
  )} and call me ${await getRandomFrom(names, rating)}`
}

const probabilities = [
  {
    weight: 10,
    action: getSentence,
  },
  {
    weight: 2,
    action: buildFromVerbObjectCombo,
  },
  {
    weight: 50,
    action: buildFromVerbAndObject,
  },
]

const makeEndpoint = (rating = "general") => async (req, res) => {
  const { ratings } = await getSettings()

  // If "text" parameter exists and is valid, override rating
  if (ALLOW_RATING_OVERRIDE && req.body.text) {
    const passedText = req.body.text.toLowerCase()

    if (ratings[passedText]) {
      rating = passedText
    }
  }

  if (probabilities === undefined || probabilities[0] === undefined) {
    throw new Error("Could not find probabilities!")
  }

  const totalWeight = probabilities.reduce((acc, probability) => acc + probability.weight, 0)
  const targetWeight = Math.floor(Math.random() * totalWeight) // from 0 to (probabilties.length - 1)

  for (let i = 0; i < totalWeight; i++) {
    if (probabilities[i + 1] === undefined || targetWeight < probabilities[i].weight) {
      res.json({
        response_type: "in_channel",
        text: await probabilities[i].action(rating),
      })
      return
    }
  }

  throw new Error("Unknown error")
}

module.exports = makeEndpoint
