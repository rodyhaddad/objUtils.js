/**
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an object or an array.
 * the `iterator` function is invoked with iterator(value, key|index), with it's `this` being the `context`
 *
 * @param {Object|Array} obj Object to iterate over
 * @param {Function} iterator Iterator function
 * @param {*} [context] The context (`this`) for the iterator function
 * @param {Boolean} [includeProto] If true, properties in the prototype will be iterated over
 * @returns {*} The obj passed in
 */
function forEach(obj, iterator, context, includeProto) {
    var key, len;
    if (obj) {
        if (isArray(obj)) {
            for (key = 0, len = obj.length; key < len; key++) {
                iterator.call(context, obj[key], key);
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else {
            for (key in obj) {
                if ((includeProto || obj.hasOwnProperty(key)) && key.substring(0, 2) != "$$") {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}