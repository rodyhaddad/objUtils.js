function navigateObj(obj, road, fn) {
    if(typeof road === "string") {
        road = cleanArray(road.split("."));
    }
    for(var i = 0; i < road.length; i++) {
        if(fn.call(obj, road[i], obj[road[i]], i, road) === false) {
            return null;
        }
        obj = obj[road[i]];
    }

    return obj;
}

navigateObj.set = function(obj, road, endValue, setOwn) {
    navigateObj(obj, road, function(key, value, i, road) {
        if(i === road.length - 1) {
            if(isObject(value)) {
                if(isObject(endValue) || isFn(endValue)) {
                    this[key] = endValue;
                    mergeObjects(this[key], value);
                } else {
                    this[key].valueOf = function() {
                        return endValue;
                    };
                }
            } else {
                this[key] = endValue;
            }
        } else {
            var typeofValue = (value !== null ? typeof value : "null");

            switch(typeofValue) {
                case "undefined":
                    this[key] = {};
                    break;

                case "number":
                case "string":
                case "boolean":
                case "null":
                    this[key] = {
                        valueOf: function() {
                            return value;
                        }
                    };
                    break;

                case "object":
                    if(setOwn && !this.hasOwnProperty(key)) {
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

navigateObj.setOwn = function(obj, road, endValue) {
    navigateObj.set(obj, road, endValue, true);
};

navigateObj.get = function(obj, road) {
    var endValue;

    navigateObj(obj, road, function(key, value) {
        endValue = value;
        if(!isObject(value) && isFn(value)) {
            return false;
        }
    });

    return endValue;
};