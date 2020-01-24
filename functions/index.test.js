const consts = require("./constants");
const { getPossibleTargets } = require("./index");

jest.mock('./constants', () => ({
  ALLOW_FALLBACKS: true,
  RATINGS: {
    test: ['rating1', 'rating2'],
    test1: []
  }
}))

const mockSentences = {
  rating1: ['rating1_sentence'],
  rating2: ['rating2_sentence'],
  general: ['general_sentence']
}

describe("getPossibleTargets()", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it("throws exception when target rating not found", () => {
    expect(() => {
      getPossibleTargets('test', 'invalid')
    }).toThrowError('Invalid targetRating invalid!')
  });

  it("returns correct targets", () => {
    const targets = getPossibleTargets(mockSentences, 'test')
    expect(targets).toEqual(["rating1_sentence", "rating2_sentence"])
  })

  it("falls back to general value", () => {
    const targets = getPossibleTargets(mockSentences, 'test1')
    expect(targets).toEqual(["general_sentence"])
  })

  it('does not allow fallback value when "ALLOW_FALLBACKS" is false', () => {
    // This test needs to re-import the function so when it runs
    // "ALLOW_FALLBACKS" is false
    jest.mock('./constants', () => ({
      ALLOW_FALLBACKS: false,
      RATINGS: { test1: [] }
    }))

    const { getPossibleTargets } = require("./index");
  
    expect(() => {
      getPossibleTargets(mockSentences, 'test1')
    }).toThrowError("No values found!")
  })
});