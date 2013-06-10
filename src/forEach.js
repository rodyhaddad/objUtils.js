function forEach(obj, iterator, context) {
    var key;
    if(obj) {
        if(isFn(obj)) {
            for(key in obj) {
                if(obj.hasOwnProperty(key) && key != "prototype" && key != "length" && key != "name")
                    iterator.call(context, obj[key], key);
            }
        } else if (isArray(obj) || obj.hasOwnProperty("length")) {
            for(key = 0; key < obj.length; key++)
                iterator.call(context, obj[key], key);
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else {
            for(key in obj) {
                if(obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}