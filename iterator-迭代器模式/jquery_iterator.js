$.each = function(obj, callback) {
    var value, i = 0,
        length = obj.length,
        isArray = isArraylike(obj);
    if (isArray) {
        for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            value = callback.call(obj[i], i, obj[i]);
            if (value === false) {
                break;
            }
        } //end for  
    } //end else  

    return obj;
}

$.each([1, 2, 3, 4], function(i, n) {
    console.log("当前下表为：" + i + " , 当前值为：" + n);
});