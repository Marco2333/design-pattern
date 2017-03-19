////////////////////////////////内部迭代器/////////////////////////////////////
var each = function(array, callback) {
	for (var i = 0, l = array.length; i < l; i++) {
		callback.call(arry[i], i, array[i]);
	}
};

each([1, 2, 3, 4], function() {
	console.log(i + '-' + 'n');
});

//判断两个数组的值是否完全相等
var compare = function(arry1, arry2) {
	if (arry1.length !== arry2.length) {
		throw new Error("arry1和arry2不相等");
	}
	each(arry1, function(i, n) {
		if (n !== arry2[i]) {
			throw new Error("arry1和arry2不相等");
		}
	});
	console.log("arry1和arry2相等");
};

compare([1, 2, 3, 4], [1, 2, 3]);

/////////////////////////////////外部迭代器///////////////////////////////////
var Iterator = function(obj) {
	var current = 0;
	var next = function() {
		current += 1;
	};
	var isDone = function() {
		return current >= obj.length;
	};
	var getCurrItem = function() {
		return obj[current];
	};

	return {
		next: next,
		isDone: isDone,
		getCurrItem: getCurrItem
	}
}

// 改写 Compare
var compare = function(iterator1, iterator2) {
	while (iterator1.isDone() && iterator2.isDone()) {
		if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
			throw new Error("iterator1 和 iterator2不相等");
		}
		iterator1.next();
		iterator2.next();
	}
	console.log("iterator1 和 iterator2相等");
};

var iterator1 = Iterator([1, 2, 3, 4]);
var iterator2 = Iterator([1, 2, 3, 4]);

compare(iterator1, iterator2);

/////////////////////////////终止迭代器///////////////////////////////////////
// 重写 each 函数实现中止迭代
var each = function(arry, callback) {
	for (var i = 0, l = arry.length; i < l; i++) {
		// callback 的执行结果返回false，提前中止迭代
		if (callback(i, arry[i]) === false) {
			break;
		}
	}
};
each([1, 2, 3, 4, 5], function(i, n) {
	if (n > 3) { // n 大于3的时候中止循环
		return false;
	}
	console.log(n); // 输出 1 2 3
});