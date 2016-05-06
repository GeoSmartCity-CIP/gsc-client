'use strict';
describe("Testing gsc.cs", function () {
    it("Has crowdsource URL", function() {
        expect(gsc.cs.csUrl() !== '').toBe(true);
    });
});
