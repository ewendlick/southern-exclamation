const southernShock = require("./index");

const mockSentences = {
    general: ['test']
}

describe("getPossibleTargets()", () => {
  it("throws error when target rating not found", () => {
    try {
        southernShock.getPossibleTargets('test', 'test')
    } catch(error) {
        expect(error.message).toBe('Invalid targetRating test!')
    }
  });

  it("returns correct targets", () => {
    const possibleTargets = southernShock.getPossibleTargets(mockSentences, 'general')

    expect(possibleTargets.length).toBe(1)
    expect(possibleTargets).toEqual(['test'])
  })
});