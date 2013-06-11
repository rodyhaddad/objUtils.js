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
                    mergeObjectsSoftly(destination[key] && source[key]);
                } else if(isUndefined(destination[key])) {
                    destination[key] = source[key];
                }
            }
        }
    }
    return destination;
}