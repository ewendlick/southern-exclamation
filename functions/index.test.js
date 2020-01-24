const { getPossibleTargets } = require("./index");

describe("getPossibleTargets()", () => {
  it("throws error when target rating not found", () => {
    try {
        getPossibleTargets('test', 'test')
    } catch(error) {
        expect(error.message).toBe('Invalid targetRating test!')
    }
  });
});