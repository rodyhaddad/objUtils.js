function mergeObjects(target, source) {
    if(target && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

function mergeObjectsRecursively(target, source) {
    if(target && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                if(isObject(source[key]) && isObject(target[key])) {
                    mergeObjectsRecursively(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

function mergeObjectsSoftly(target, source) {
    if(target && source) {
        for(var key in source) {
            if(source.hasOwnProperty(key)) {
                if(isObject(source[key]) && isObject(target[key])) {
                    mergeObjectsSoftly(target[key] && source[key]);
                } else if(isUndefined(target[key])) {
                    target[key] = source[key];
                }
            }
        }
    }
}