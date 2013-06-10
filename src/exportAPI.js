if (typeof module === "object" && module && isObject(module.exports)) {
    module.exports = objUtils;
} else {
    if (typeof define === "function" && define.amd) {
        define("objUtils", [], function(){
            return objUtils;
        });
    }
}