describe("The ot object has a forEach method, which allows you: ", function () {

    it("To iterate over an array", function () {
        var array = [1, 2, 4, 8, 16];
        var sum = 0;
        var sumIndex = 0;

        ot.forEach(array, function (value, index) {
            sum += value;
            sumIndex += index;
            expect(this.context).toBe(true);
        }, {context: true});

        expect(sum).toBe(1 + 2 + 4 + 8 + 16);
        expect(sumIndex).toBe(1 + 2 + 3 + 4);
    });

    it("To iterate over an object's properties", function () {
        var obj = {
            prop1: false,
            prop2: false,
            prop3: false
        };

        ot.forEach(obj, function (value, key) {
            obj[key] = !value;
            expect(this.context).toBe(true);
        }, {context: true});

        expect(obj.prop1).toBe(true);
        expect(obj.prop2).toBe(true);
        expect(obj.prop3).toBe(true);
    });

    it("To iterate over user set function properties", function () {
        var fnWithProps = function aName() {
        };
        fnWithProps.prop1 = false;
        fnWithProps.prop2 = false;
        fnWithProps.prop3 = false;

        ot.forEach(fnWithProps, function (value, key) {
            fnWithProps[key] = !value;
            expect(this.context).toBe(true);
        }, {context: true});

        expect(fnWithProps.prop1).toBe(true);
        expect(fnWithProps.prop2).toBe(true);
        expect(fnWithProps.prop3).toBe(true);
    });

    it("To iterate over an object with a forEach method", function () {
        var objectWithForEach = {
            forEach: function (iterator, context) {
                iterator.call(context, true);
            }
        };

        ot.forEach(objectWithForEach, function(calledFromForEach) {
            expect(calledFromForEach).toBe(true);
            expect(this.context).toBe(true);
        }, {context: true});
    });

});