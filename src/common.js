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
 * Remove a specific element from an array.
 *
 * @param array An array to clean
 * @param from What should be removed from the array
 * @returns {Array} The cleaned array
 */
function cleanArray(array, from) {
    from = from || "";
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] === from) {
            array.splice(i, 1);
        }
    }
    return array;
}