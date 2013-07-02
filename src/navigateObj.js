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