var globalObj = typeof window !== "undefined" ? window :
    (typeof global !== "undefined" ? global :
        this);

function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}

function isObject(obj) {
    return typeof obj === "object" && obj !== null;
}

function isFn(fn) {
    return typeof fn === "function";
}

function isUndefined(val) {
    return typeof val === "undefined";
}

function isEmptyObject(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

function cleanArray(array, from) {
    from = from || "";
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i] === from) {
            array.splice(i, 1);
        }
    }
    return array;
}