// Allows users to override ratings
exports.ALLOW_RATING_OVERRIDE = true

// Uses 'general' as a fallback when 'adult' content is empty (prevents errors)
exports.ALLOW_FALLBACKS = true

exports.RATINGS = {
  all: ['general', 'adult'],
  general: ['general'],
  adult: ['adult']
}

exports.VERBS = {
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
    'tongue-punch'
  ]
}

exports.OBJECTS = {
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
    'my keyhole'
  ]
}

exports.VERB_OBJECT_COMBOS = {
  general: [
    'shiver me timbers',
    'lather me head to toe in honey',
    'spin me around in a centrifuge'
  ],
  adult: [
    'clap my cheeks',
    'spread me open'
  ]
}

exports.NAMES = {
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
    'a monkey',
    'Anderson',
    'Daniel',
    'David',
    'Kaz',
    'Kevin',
    'Luke',
    'Mary',
    'Ruben',
    'Topher',
    'Traviss',
    'Eli'
  ],
  adult: [
  ]
}

exports.SENTENCES = {
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



