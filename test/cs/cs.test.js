'use strict';
describe("Testing gsc.cs", function () {
    it("Contains version", function () {
        expect(gsc.cs.version !== undefined).toBe(true);
    });
    it("Has crowdsource URL", function() {
        expect(gsc.cs.csUrl() !== '').toBe(true);
    });
});
