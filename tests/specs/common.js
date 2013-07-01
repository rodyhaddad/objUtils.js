describe("The objUtils object has common methods, which include: ", function () {

    function allTrue(method, values) {
        for (var i = 0; i < values.length; i++) {
            expect(method(values[i])).toBe(true);
        }
    }

    function allFalse(method, values) {
        for (var i = 0; i < values.length; i++) {
            expect(method(values[i])).toBe(false);
        }
    }

    describe("an isArray method", function () {
        it("which only returns true when passed an array", function () {
            expect(objUtils.isArray([])).toBe(true);

            allFalse(objUtils.isArray, [
                {},
                5,
                "t",
                "",
                /test/,
                undefined,
                null,
                function () {

                }
            ]);
        })
    });

    describe("an isObject method", function () {
        it("which only returns true when passed an Object (excluding null)", function () {
            allTrue(objUtils.isObject, [
                {},
                [],
                /test/
            ]);

            allFalse(objUtils.isObject, [
                5, "t", "", null, undefined, true,
                function () {

                }
            ]);
        })
    });

    describe("an isFn method", function () {
        it("which only returns true when passed a function", function () {
            expect(objUtils.isFn(function () {

            })).toBe(true);

            allFalse(objUtils.isFn, [
                [],
                {},
                5,
                "t",
                "",
                /test/,
                undefined,
                null
            ]);
        })
    });

    describe("an isUndefined method", function () {
        it("which only returns true when passed an undefined value", function () {
            expect(objUtils.isUndefined(undefined)).toBe(true);

            allFalse(objUtils.isUndefined, [
                [],
                {},
                5,
                "t",
                "",
                /test/,
                null,
                function () {

                }
            ]);
        })
    });

    describe("an isEmptyObject method", function () {
        it("which only returns true when passed an empty object", function () {
            expect(objUtils.isEmptyObject({})).toBe(true);

            expect(objUtils.isEmptyObject({notEmpty: true})).toBe(false);
        })
    });

    describe("a toArray method", function () {
        it("which transforms the argument passed to it into an array", function () {
            expect(objUtils.toArray([])).toEqual([]);

            expect(objUtils.toArray({length: 2})).toEqual(new Array(2));

            expect(objUtils.toArray({length: 2, "0": true, "1": false})).toEqual([true, false]);
        })
    });

    describe("a cleanArray method", function () {
        it("which cleans an array from a specific element", function () {
            expect(objUtils.cleanArray(new Array(10), undefined)).toEqual([]);

            expect(objUtils.cleanArray([1, 2, 3, 1, 2, 3], 1)).toEqual([2, 3, 2, 3]);

            expect(objUtils.cleanArray(".test.ing.".split("."), "")).toEqual(["test", "ing"]);
        })
    });

});