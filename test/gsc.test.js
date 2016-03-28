'use strict';
describe("Testing gsc", function () {
    it("Contains version", function () {
        expect(gsc.version !== undefined).toBe(true);
    });
        it("Has datacatalog URL", function() {
            expect(gsc.dcUrl() !== '').toBe(true);
        });
});
