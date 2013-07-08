/*! objectTools.js v0.6.0 08-07-2013 
The MIT License (MIT)

Copyright (c) 2013 rodyhaddad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var ot = (function () {

/**
 * The global object. `window` in the browser, `global` in node.js or `this` otherwise
 *
 * @type {window|global|*}
 */
var globalObj = typeof window !== "undefined" ? window :
    (typeof global !== "undefined" ? global :
        this);

/**
 * Determine whether the argument is an array or not
 *
 * @param arr Variable to test on
 * @returns {boolean} Whether the argument is an array or not
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

/**
 * Determine whether the argument is an object or not (excludes null)
 *
 * @param obj Variable to test on
 * @returns {boolean} Whether the argument is an object or not (excludes null)
 */
function isObject(obj) {
    return typeof obj === "object" && obj !== null;
}

/**
 * Determine whether the argument is a function or not
 *
 * @param fn Variable to test on
 * @returns {boolean} Whether the argument is a function or not
 */
function isFn(fn) {
    return typeof fn === "function";
}

/**
 * Determine whether the argument is undefined or not
 *
 * @param val Variable to test on
 * @returns {boolean} Whether the argument is undefined or not
 */
function isUndefined(val) {
    return typeof val === "undefined";
}

/**
 * Determine whether the argument is empty or not
 *
 * @param {Object} obj Object to test on
 * @returns {boolean} Whether the object is empty
 */
function isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

/**
 * Transforms the argument into an array. Useful for transmuting the arguments object
 *
 * @param obj the argument to transform into an array
 * @returns {Array} An array originating from the argument
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * Cleans an array from a specific element
 *
 * @param array An array to clean
 * @param from What should be removed from the array
 * @returns {Array} The cleaned array
 */
function cleanArray(array, from) {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] === from) {
            array.splice(i, 1);
        }
    }
    return array;
}

/**
 * A function that performs no operations
 */
function noop(){

}

/**
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an object or an array.
 * the `iterator` function is invoked with iterator(value, key|index), with it's `this` being the `context`
 *
 * @param {Object|Array} obj Object to iterate over
 * @param {Function} iterator Iterator function
 * @param [context] The context (`this`) for the iterator function
 * @returns {*} The obj passed in
 */
function forEach(obj, iterator, context) {
    var key, len;
    if (obj) {
        if (isFn(obj)) {
            for (key in obj) {
                if (obj.hasOwnProperty(key) && key != "prototype" && key != "length" && key != "name") {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if (isArray(obj) || obj.hasOwnProperty("length")) {
            for (key = 0, len = obj.length; key < len; key++) {
                iterator.call(context, obj[key], key);
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}

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
function makeInherit(obj, mergeObj) {
    var inheritObj = _inherit(obj);

    return mergeObj ? mergeObjects(inheritObj, mergeObj) : inheritObj;
}

/**
 * Makes an object that recursively inherits `obj`.
 *
 * @param obj {Object} The object to recursively inherit
 * @param [mergeObj] {Object} An object that will be recursively merged with the resulting child object
 * @param {Function} fnEachLevel A function that gets called on each level of inherited object
 * @returns {Object} The resulting object
 */
function makeRecursiveInherit(obj, mergeObj, fnEachLevel, _level) {
    var inheritObj;
    if (isFn(obj)) {
        inheritObj = function () {
            return obj.apply(this, toArray(arguments));
        };
    } else {
        inheritObj = makeInherit(obj);
    }

    if (fnEachLevel) {
        _level = _level || 0;
        fnEachLevel(inheritObj, obj, _level);
    }

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (( isFn(obj[key]) || isObject(obj[key]) ) && globalObj !== obj[key] && !isArray(obj[key])) {
                inheritObj[key] = makeRecursiveInherit(obj[key], null, fnEachLevel, _level + 1);
            }
        }
    }
    return mergeObj ? mergeObjectsRecursively(inheritObj, mergeObj) : inheritObj;
}

/**
 * Makes an object that recursively inherits `obj`.
 *
 * @param obj {Object} The object to bound inherit
 * @param [mergeObj] {Object} An object that will be recursively merged with the resulting child object
 * @param {Function} fnEachLevel A function that gets called on each level of inherited object
 * @returns {Object} The resulting object
 */
function makeBoundInherit(obj, mergeObj, fnEachLevel) {
    return makeRecursiveInherit(obj, mergeObj, function (obj, superObj, level) {
        if (!isArray(superObj.$$boundChildren)) {
            superObj.$$boundChildren = [];
        }
        superObj.$$boundChildren.push(obj);

        if (fnEachLevel) {
            fnEachLevel(obj, superObj, level);
        }

    });
}

/**
 * Merges the `destination` and the `source` objects
 * by copying all of the properties from the source object to the destination object.
 *
 * @param {Object} destination Destination Object
 * @param {Object} source Source Object
 * @returns {Object} The mutated `destination` Object
 */
function mergeObjects(destination, source) {
    if(destination && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
    }
    return destination;
}

/**
 * Recursively/Deeply merges the `destination` and the `source` objects
 * by copying all of the properties from the source object to the destination object.
 *
 * @param {Object} destination Destination Object
 * @param {Object} source Source Object
 * @returns {Object} The mutated `destination` Object
 */
function mergeObjectsRecursively(destination, source) {
    if(destination && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                if(isObject(source[key]) && isObject(destination[key])) {
                    mergeObjectsRecursively(destination[key], source[key]);
                } else {
                    destination[key] = source[key];
                }
            }
        }
    }
    return destination;
}

/**
 * Softly deeply merges the `destination` and the `source` objects
 * by copying all of the properties from the source object that do not exist on the destination object.
 *
 * @param {Object} destination Destination Object
 * @param {Object} source Source Object
 * @returns {Object} The mutated `destination` Object
 */
function mergeObjectsSoftly(destination, source) {
    if(destination && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                if(isObject(source[key]) && isObject(destination[key])) {
                    mergeObjectsSoftly(destination[key], source[key]);
                } else if(isUndefined(destination[key])) {
                    destination[key] = source[key];
                }
            }
        }
    }
    return destination;
}

/**
 * Allows you to navigate an object with a given `road`.
 * The given `fn` is invoked with fn(value, key, roadIndex, road) with the context (`this`) being the step in the road
 * you're in.
 * If `fn` returns false, the navigation stops
 *
 * @param {Object} obj The object to navigate
 * @param {Array|String} road Either an array of property names or a String of dot separated property names
 * @param {Function} fn A function that will be called for every property name with the args (value, key, index, roadArray) and its this scope being the current step in the road
 * @returns {*} `null` if navigation was interrupted, or the last step in the road
 */
function navigateObj(obj, road, fn) {
    if (typeof road === "string") {
        road = cleanArray(road.split("."));
    }
    for (var i = 0; i < road.length; i++) {
        if (isUndefined(obj) || fn.call(obj, obj[road[i]], road[i], i, road) === false) {
            return null;
        }
        obj = obj[road[i]];
    }

    return obj;
}

/**
 * Allows you to check if all properties on a road are owned by a specific Object
 *
 * @param {Object} obj The object to navigate
 * @param {Array|String} road Either an array of property names or a String of dot separated property names
 * @returns {boolean} Whether all properties in the road are owned by `obj`
 */
navigateObj.hasOwn = function (obj, road) {
    var hasOwn = true;
    navigateObj(obj, road, function (value, key) {
        hasOwn = this.hasOwnProperty(key);
        return hasOwn;
    });
    return hasOwn;
};

// handle the completion of the road for navigateObj.set
var completeRoad = {
    'undefined': function (value, key) {
        this[key] = {};
    },
    'object': function (value, key, setOwn) {
        if (setOwn && !this.hasOwnProperty(key)) {
            this[key] = makeInherit(this[key]);
        }
    },
    'function': noop,
    'null': function (value, key) {
        this[key] = {
            valueOf: function () {
                return value;
            }
        };
    }
    //string, boolean, number = null
};
completeRoad.string = completeRoad.boolean = completeRoad.number = completeRoad['null'];
navigateObj._completeRoad = completeRoad;

/**
 * Navigate `obj` on the `road` and sets `endValue` on the end of the `road`
 *
 * @param {Object} obj The object to navigate
 * @param {Array|String} road Either an array of property names or a String of dot separated property names
 * @param {*} endValue The value to set on the end of the road
 * @param {boolean} setOwn If true, it makes sure that the navigation never travels in an inherited Object
 * @returns {*} The `endValue`
 */
navigateObj.set = function (obj, road, endValue, setOwn) {
    navigateObj(obj, road, function (value, key, i, road) {
        if (i === road.length - 1) {
            if (isObject(value)) {
                if (isObject(endValue) || isFn(endValue)) {
                    this[key] = endValue;
                    mergeObjects(this[key], value);
                } else {
                    this[key].valueOf = function () {
                        return endValue;
                    };
                }
            } else {
                this[key] = endValue;
            }
        } else {
            var typeofValue = (value !== null ? typeof value : "null");
            completeRoad[typeofValue].call(this, value, key, setOwn, value, i, road);
        }

        if (this.$$boundChildren && isObject(this[key])) {
            forEach(this.$$boundChildren, function (child) {
                if (!child.hasOwnProperty(key)){
                    child[key] = makeBoundInherit(this[key]);
                }
            }, this);
        }
    });
    return endValue;
};

/**
 * Navigate `obj` on the `road` and sets `endValue` on the end of the `road`,
 * making sure it never travels in an inherited Object
 *
 * @param {Object} obj The object to navigate
 * @param {Array|String} road Either an array of property names or a String of dot separated property names
 * @param {*} endValue The value to set on the end of the road
 * @returns {*} The `endValue`
 */
navigateObj.setOwn = function (obj, road, endValue) {
    return navigateObj.set(obj, road, endValue, true);
};

/**
 * Navigate `obj` on the `road` and returns the value at the end of the `road`
 *
 * @param {Object} obj The object to navigate
 * @param {Array|String} road Either an array of property names or a String of dot separated property names
 * @returns {*} The value at the end of the road
 */
navigateObj.get = function (obj, road) {
    var endValue = null;

    navigateObj(obj, road, function (value, key, i, road) {
        if (i === road.length - 1) {
            endValue = value;
        }
    });

    return endValue && endValue.valueOf();
};

var ot = {
    globalObj: globalObj,
    isArray: isArray,
    isObject: isObject,
    isFn: isFn,
    isUndefined: isUndefined,
    isEmptyObject: isEmptyObject,
    toArray: toArray,
    cleanArray: cleanArray,
    noop: noop,

    forEach: forEach,

    mergeObjects: mergeObjects,
    mergeObjectsRecursively: mergeObjectsRecursively,
    mergeObjectsSoftly: mergeObjectsSoftly,

    makeInherit: makeInherit,
    makeRecursiveInherit: makeRecursiveInherit,
    makeBoundInherit: makeBoundInherit,

    navigateObj: navigateObj
};

if (typeof module === "object" && module && isObject(module.exports)) {
    module.exports = ot;
} else {
    if (typeof define === "function" && define.amd) {
        define("ot", [], function(){
            return ot;
        });
    }
}

    return ot;
}());