if (typeof module === "object" && module && isObject(module.exports)) {
    module.exports = ot;
} else {
    if (typeof define === "function" && define.amd) {
        define("ot", [], function(){
            return ot;
        });
    }
}