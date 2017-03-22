var strategies = {
	S: function(salary) {
		return salary * 6;
	},
	A: function(salary) {
		return salary * 4;
	},
	B: function(salary) {
		return salary * 2;
	}
};

var calculateBonus = function(level, salary) {
	return strategies[level](salary);
}
console.log(calculateBonus('S', 20000)); //输出120000  
console.log(calculateBonus('A', 10000)); //输出40000