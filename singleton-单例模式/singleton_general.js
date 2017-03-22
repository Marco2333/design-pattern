var getSingle = function(fn) {
	var result;
	return function() {
		return result || (result = fn.apply(this, arguments));
	}
}

var createA = function() {
	return {
		name: 'a'
	}
}

var createB = function() {
	return {
		name: 'b'
	}
}

var createSingleA = getSingle(createA)

var createSingleB = getSingle(createB)

createA() === createA() // false
createSingleA() === createSingleA() // true