describe("The ot object has methods which help in objects navigation:", function () {

    describe("a navigate method", function () {
        var obj = {
            a: {b: {c: {d: {e: true}}}}
        };
        var road = "a.b.c.d.e";
        ot.forEach([road, road.split(".")], function (road) {
            var type = ot.isArray(road) ? "array" : "string";
            it("which allows you to navigate an object using a road (" + type + ")", function () {
                var expectedRoad = ["a", "b", "c", "d", "e"];

                ot.navigate(obj, road, function (val, key, index, road) {
                    expect(road).toEqual(["a", "b", "c", "d", "e"]);
                    expect(expectedRoad[index]).toBe(key);
                    if (index === road.length - 1) {
                        expect(val).toBe(true);
                    }
                });
            });
        });
    });

    describe("a navigate.hasOwn method", function () {
        var objA = {
                a: {b: {c: {d: true}}}
            },
            objB = {
                a: ot.inherit({b: {c: true}})
            },
            objC = ot.recursiveInherit(objA);

        it("which allows you to check that the properties on a road are all owned by an object", function () {
            expect(ot.navigate.hasOwn(objA, "a.b.c.d")).toBe(true);
            expect(ot.navigate.hasOwn(objB, "a.b.c")).toBe(false);
            expect(ot.navigate.hasOwn(objC, "a.b.c.d")).toBe(false);
        });
    });

    describe("a navigate.set method", function () {
        var obj = {};

        //primitive values
        ot.navigate.set(obj, "a.b.c", true);
        ot.navigate.set(obj, "z.y.x", true);
        ot.navigate.set(obj, "a.b", true);
        ot.navigate.set(obj, "a.b.c.e", true);

        //objects
        ot.navigate.set(obj, "o.o.o", {1: true});
        ot.navigate.set(obj, "o.o.o", {2: true});
        ot.navigate.set(obj, "o.o.o", true);
        ot.navigate.set(obj, "o.o", {3: true});
        ot.navigate.set(obj, "o.o.o.o", {4: true});

        it("which allows you to set a value on the end of a road", function () {
            expect(obj.a.b.c.valueOf()).toBe(true);
            expect(obj.z.y.x.valueOf()).toBe(true);
        });

        it("which tries to keep the object structure", function () {
            expect(obj.a.b.valueOf()).toBe(true);
            expect(obj.a.b.c.e.valueOf()).toBe(true);
            expect(obj.o.o.o.valueOf()).toBe(true);
        });

        it("which allows you to set objects", function () {
            expect(obj.o.o.o[1]).toBe(true);
            expect(obj.o.o.o[2]).toBe(true);
            expect(obj.o.o[3]).toBe(true);
            expect(obj.o.o.o.o[4]).toBe(true);
        });
    });

    describe("a navigate.setOwn method", function () {
        var objA = {
                a: {
                    b: {
                        c: false
                    }
                }
            },
            objB = ot.recursiveInherit(objA, {
                z: ot.inherit({
                    y: {
                        x: false
                    }
                })
            });

        it("which can set properties while making sure to not go inherited objects", function () {
            ot.navigate.setOwn(objB, "a.b.d", true);
            expect(objB.a.b.hasOwnProperty("c")).toBe(false);
            expect(objB.a.b.hasOwnProperty("d")).toBe(true);

            expect(ot.navigate.hasOwn(objB, "z.y.x")).toBe(false);
            ot.navigate.setOwn(objB, "z.y.w", true);
            expect(ot.navigate.hasOwn(objB, "z.y.w")).toBe(true);
        });
    });

    describe("a navigate.get method", function () {
        var obj = {
            a: {
                b: {
                    c: true
                }
            }
        };

        it("which returns the value at the end of a road", function () {
            expect(ot.navigate.get(obj, "a.b.c")).toBe(true);
        });

        it("or null if some part of the road doesn't exist", function () {
            expect(ot.navigate.get(obj, "a.q.d")).toBe(null);
        })
    });

});