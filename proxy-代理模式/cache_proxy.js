var mult = function() {
	console.log('开始计算乘积');
	var a = 1;
	for (var i = 0, l = arguments.length; i < l; i++) {
		a = a * arguments[i];
	}
	return a;
};
mult(2, 3); // 输出： 6
mult(2, 3, 4); // 输出： 24

////////////////////////////加入代理////////////////////////////////////////
var proxyMult = (function() {
	var cache = {};
	return function() {
		var args = Array.prototype.join.call(arguments, ',');
		if (args in cache) {
			return cache[args];
		}
		return cache[args] = mult.apply(this, arguments);
	}
})();

proxyMult(1, 2, 3, 4); // 输出： 24
proxyMult(1, 2, 3, 4); // 输出： 24

///////////////////////////////用高阶函数动态创建代理///////////////////////////////////

/**************** 计算乘积 *****************/
var mult = function() {
	var a = 1;
	for (var i = 0, l = arguments.length; i < l; i++) {
		a = a * arguments[i];
	}
	return a;
};
/**************** 计算加和 *****************/
var plus = function() {
	var a = 0;
	for (var i = 0, l = arguments.length; i < l; i++) {
		a = a + arguments[i];
	}
	return a;
};
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
	var cache = {};
	return function() {
		var args = Array.prototype.join.call(arguments, ',');
		if (args in cache) {
			return cache[args];
		}
		return cache[args] = fn.apply(this, arguments);
	}
};

var proxyMult = createProxyFactory(mult),
	proxyPlus = createProxyFactory(plus);

alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyMult(1, 2, 3, 4)); // 输出： 24
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10
alert(proxyPlus(1, 2, 3, 4)); // 输出： 10