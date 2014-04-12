var _inherit = Object.create || (function () {
    function F() {
    }

    return function (o) {
        F.prototype = o;
        return new F();
    };
})();

/**
 * Makes an object that inherits `obj`. Similar to Object.create
 *
 * @param obj {Object} The object to inherit
 * @param [mergeObj] {Object} An object that will be merged with the resulting child object
 * @returns {Object} The resulting object
 */
function inherit(obj, mergeObj) {
    var inheritObj = _inherit(obj);

    return mergeObj ? merge(inheritObj, mergeObj) : inheritObj;
}

/**
 * Makes an object that recursively inherits `obj`.
 *
 * @param obj {Object} The object to recursively inherit
 * @param [mergeObj] {Object} An object that will be recursively merged with the resulting child object
 * @param {Function} fnEachLevel A function that gets called on each level of inherited object
 * @returns {Object} The resulting object
 */
function deepInherit(obj, mergeObj, fnEachLevel, _level) {
    var inheritObj;
    if (isFn(obj)) {
        inheritObj = function () {
            return obj.apply(this, toArray(arguments));
        };
    } else {
        inheritObj = inherit(obj);
    }

    if (fnEachLevel) {
        _level = _level || 0;
        fnEachLevel(inheritObj, obj, _level);
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (( isObject(obj[key]) || (isFn(obj[key]) && !isEmptyObject(obj[key])) ) && globalObj !== obj[key] && !isArray(obj[key])) {
                inheritObj[key] = deepInherit(obj[key], null, fnEachLevel, _level + 1);
            }
        }
    }
    return mergeObj ? deepMerge(inheritObj, mergeObj) : inheritObj;
}

/**
 * Makes an object that recursively inherits `obj`.
 *
 * @param obj {Object} The object to bound inherit
 * @param [mergeObj] {Object} An object that will be recursively merged with the resulting child object
 * @param {Function} fnEachLevel A function that gets called on each level of inherited object
 * @returns {Object} The resulting object
 */
function boundInherit(obj, mergeObj, fnEachLevel) {
    return deepInherit(obj, mergeObj, function (obj, superObj, level) {
        if (!superObj.hasOwnProperty('$$boundChildren')) {
            if (isArray(superObj.$$boundChildren)) {
                var parentChildren = superObj.$$boundChildren;
                superObj.$$boundChildren = [obj];
                superObj.$$boundChildren.$$parentChildren = parentChildren;
            } else {
                superObj.$$boundChildren = [obj];
            }
        } else {
            superObj.$$boundChildren.push(obj);
        }

        if (fnEachLevel) {
            fnEachLevel(obj, superObj, level);
        }

    });
}

/**
 * Unbind an object from it's bound-inherited parent
 *
 * @param obj {Object} The object to unbind from its parent
 * @returns {Object} The resulting object
 */
function unbindInherit(obj) {
    var boundChildren = obj.$$boundChildren;
    if (obj.hasOwnProperty('$$boundChildren')) {
        boundChildren = boundChildren.$$parentChildren;
    }
    cleanArray(boundChildren, obj, true);
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] && obj[key].$$boundChildren) {
            unbindInherit(obj[key]);
        }
    }
    return obj;
}