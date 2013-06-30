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
        if (fn.call(obj, obj[road[i]], road[i], i, road) === false || isUndefined(obj)) {
            return null;
        }
        obj = obj[road[i]];
    }

    return obj;
}

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

            switch (typeofValue) {
                case "undefined":
                    this[key] = {};
                    break;

                case "number":
                case "string":
                case "boolean":
                case "null":
                    this[key] = {
                        valueOf: function () {
                            return value;
                        }
                    };
                    break;

                case "object":
                    if (setOwn && !this.hasOwnProperty(key)) {
                        this[key] = makeInherit(this[key]);
                    }
                    break;
                default:
                    break;
            }
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
    var endValue;

    navigateObj(obj, road, function (value, key) {
        endValue = value;
        if (!isObject(value) && isFn(value)) {
            return false;
        }
    });
    return endValue && endValue.valueOf();
};