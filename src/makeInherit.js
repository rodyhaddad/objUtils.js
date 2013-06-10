var _inherit = Object.create || function(obj) {
    function O() {}
    O.prototype = obj;
    return new O();
};

function makeInherit(obj, mergeObj) {
    var inheritObj = _inherit(obj);

    return mergeObj ? mergeObjects(inheritObj, mergeObj) : inheritObj;
}

function makeRecursiveInherit(obj, mergeObj) {
    var inheritObj;
    if(isFn(obj)) {
        inheritObj = function() {
            return obj.apply(this, toArray(arguments));
        }
    }else{
        inheritObj = makeInherit(obj);
    }

    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            if( ( isFn(obj[key]) || isObject(obj[key]) ) && globalObj !== obj[key]) {
                inheritObj[key] = makeRecursiveInherit(obj[key], mergeObj);
            }
        }
    }
    return mergeObj ? mergeObjects(inheritObj, mergeObj) : inheritObj;
}