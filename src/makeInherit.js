var _inherit = Object.create || (function () {
    function F() {
    }

    return function (o) {
        F.prototype = o;
        return new F()
    }
})();

/**
 * Makes an object that inherits `obj`. Similar to Object.create
 *
 * @param obj {Object} The object to inherit
 * @param [mergeObj] {Object} An object that will be merged with the resulting child object
 * @returns {Object} The resulting object
 */
function makeInherit(obj, mergeObj) {
    var inheritObj = _inherit(obj);

    return mergeObj ? mergeObjects(inheritObj, mergeObj) : inheritObj;
}

/**
 * Makes an object that recursively inherits `obj`.
 *
 * @param obj {Object} The object to recursively inherit
 * @param [mergeObj] {Object} An object that will be recursively merged with the resulting child object
 * @returns {Object} The resulting object
 */
function makeRecursiveInherit(obj, mergeObj) {
    var inheritObj;
    if (isFn(obj)) {
        inheritObj = function () {
            return obj.apply(this, toArray(arguments));
        };
    } else {
        inheritObj = makeInherit(obj);
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (( isFn(obj[key]) || isObject(obj[key]) ) && globalObj !== obj[key]) {
                inheritObj[key] = makeRecursiveInherit(obj[key]);
            }
        }
    }
    return mergeObj ? mergeObjectsRecursively(inheritObj, mergeObj) : inheritObj;
}