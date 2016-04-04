'use strict';

describe("Testing gsc Map", function () {
    it("Contains version", function () {
        expect(gsc.Map.version !== undefined).toBe(true);
    });
    it("Has datacatalog URL", function() {
        expect(gsc.dcUrl() !== '').toBe(true);
    });
});