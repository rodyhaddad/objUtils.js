describe("The ot object has common methods, which include: ", function () {

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
            expect(ot.isArray([])).toBe(true);

            allFalse(ot.isArray, [
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
            allTrue(ot.isObject, [
                {},
                [],
                /test/
            ]);

            allFalse(ot.isObject, [
                5, "t", "", null, undefined, true,
                function () {

                }
            ]);
        })
    });

    describe("an isFn method", function () {
        it("which only returns true when passed a function", function () {
            expect(ot.isFn(function () {

            })).toBe(true);

            allFalse(ot.isFn, [
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
            expect(ot.isUndefined(undefined)).toBe(true);

            allFalse(ot.isUndefined, [
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
            expect(ot.isEmptyObject({})).toBe(true);

            expect(ot.isEmptyObject({notEmpty: true})).toBe(false);
        })
    });

    describe("a toArray method", function () {
        it("which transforms the argument passed to it into an array", function () {
            expect(ot.toArray([])).toEqual([]);

            expect(ot.toArray({length: 2})).toEqual(new Array(2));

            expect(ot.toArray({length: 2, "0": true, "1": false})).toEqual([true, false]);
        })
    });

    describe("a cleanArray method", function () {
        it("which cleans an array from a specific element", function () {
            expect(ot.cleanArray(new Array(10), undefined)).toEqual([]);

            expect(ot.cleanArray([1, 2, 3, 1, 2, 3], 1)).toEqual([2, 3, 2, 3]);

            expect(ot.cleanArray(".test.ing.".split("."), "")).toEqual(["test", "ing"]);
        })
    });

    describe("a result method", function () {
        it("which get the result of a property from an object, calling it if it's a function", function () {
            var object = {
                p1: "aValueP1",
                p2: function (arg1, arg2) {
                    return 'aValueP2' + arg1 + arg2;
                }
            };

            expect(ot.result(object, 'p1')).toBe("aValueP1");
            expect(ot.result(object, 'p2', ["Ar", "g"])).toBe("aValueP2Arg");
        })
    });

});