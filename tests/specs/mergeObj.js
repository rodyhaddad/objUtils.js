describe("The objUtils object has methods which help in object merging, which include: ", function () {

    describe("a mergeObjects method", function () {

        it("which merges two objects together", function () {
            var objA, objB;

            objA = {
                p1: true,
                p2: true,
                p3: {
                },
                p4: {
                    p4_1: false,
                    p4_2: false
                },
                p5: true
            };
            objB = {
                p3: true,
                p4: {
                    p4_1: true
                },
                p5: {

                },
                p6: true
            };
            objUtils.mergeObjects(objA, objB);

            expect(objA).toEqual({
                p1: true,
                p2: true,
                p3: true,
                p4: {
                    p4_1: true
                },
                p5: {

                },
                p6: true
            });

        });

        it("and doesn't merge inherited properties", function () {
            var objA, objB, objC;
            objA = {
                p1: true,
                p2: true
            };
            objB = {
                p3: true,
                p4: true
            };

            objC = objUtils.makeInherit(objA);
            objC.p5 = true;
            objC.p6 = true;

            objB = objUtils.mergeObjects(objB, objC);

            expect(objC.p1).toBe(true);
            expect(objC.p2).toBe(true);
            expect(objB).toEqual({
                p3: true,
                p4: true,
                p5: true,
                p6: true
            })
        });

    });

    describe("a mergeObjectsRecursively method", function() {
        it("which merges two objects deeply", function() {
            var objA, objB;
            objA = {
                p1: true,
                p2: true,
                p3: {
                    p3_1: true,
                    p3_2: {
                        p3_2_1: true
                    }
                }
            };
            objB = {
                p2: {
                    p2_1: true
                },
                p3: {
                    p3_2: {
                        p3_2_2: true
                    },
                    p3_3: true
                }
            };
            objUtils.mergeObjectsRecursively(objA, objB);

            expect(objA).toEqual({
                p1: true,
                p2: {
                    p2_1: true
                },
                p3: {
                    p3_1: true,
                    p3_2: {
                        p3_2_1: true,
                        p3_2_2: true
                    },
                    p3_3: true
                }
            });
        });
    });

    describe("a mergeObjectsSoftly method", function() {
        it("which merges two objects softly", function() {
            var objA, objB;
            objA = {
                p1: true,
                p2: {
                    p2_1: true
                },
                p3: {
                    p3_1: true
                }
            };
            objB = {
                p1: false,
                p2: false,
                p3: {
                    p3_1: false,
                    p3_2: true
                },
                p4: {
                    p4_1: true
                }
            };
            objUtils.mergeObjectsSoftly(objA, objB);

            expect(objA).toEqual({
                p1: true,
                p2: {
                    p2_1: true
                },
                p3: {
                    p3_1: true,
                    p3_2: true
                },
                p4: {
                    p4_1: true
                }
            });
        });
    });
});