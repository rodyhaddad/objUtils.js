describe("The objUtils object has method which help in inheritance", function () {
    describe("a makeInherit method", function () {
        var objA, objB;
        objA = {
            p1: true
        };
        objB = objUtils.makeInherit(objA, {
            p2: true
        });

        it("which allows you to inherit from an object", function () {
            expect(objB.p1).toBe(true);
            expect(objB.hasOwnProperty("p1")).toBe(false);
        });

        it("which allows you to merge an object to the resulting object", function () {
            expect(objB.p2).toBe(true);
            expect(objB.hasOwnProperty("p2")).toBe(true);
        });
    });

    describe("a makeRecursiveInherit method", function () {
        var objA, objB;
        objA = {
            p1: true,
            p2: {
                p2_1: true,
                p2_2: {
                    p2_2_1: true
                }
            }
        };
        objB = objUtils.makeRecursiveInherit(objA, {
            p2: {
                p2_3: true,
                p2_2: {
                    p2_2_2: true
                }
            }
        });

        it("which allows you to inherit from an object recursively", function () {
            expect(objB.p1).toBe(true);
            expect(objB.hasOwnProperty("p1")).toBe(false);

            expect(objB.p2.p2_1).toBe(true);
            expect(objB.p2.hasOwnProperty("p2_1")).toBe(false);

            expect(objB.p2.p2_2.p2_2_1).toBe(true);
            expect(objB.p2.p2_2.hasOwnProperty("p2_2_1")).toBe(false);
        });

        it("which allows you to deeply merge an object to the resulting object", function () {
            expect(objB.p2).toBeDefined()
            expect(objB.hasOwnProperty("p2")).toBe(true);

            expect(objB.p2.p2_3).toBe(true);
            expect(objB.p2.hasOwnProperty("p2_3")).toBe(true);

            expect(objB.p2.p2_2.p2_2_2).toBe(true);
            expect(objB.p2.p2_2.hasOwnProperty("p2_2_2")).toBe(true);
        });
    });
});