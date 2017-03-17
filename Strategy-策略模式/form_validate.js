/////////////////////////////////////////baseline/////////////////////////////////////////
var registerForm = document.getElementById('register-form');

registerForm.onsubmit = function() {
	if (registerForm.userName.value === '') {
		alert('用户名不能为空！');
		return false;
	}
	if (registerForm.password.value.length < 6) {
		alert('密码长度不能少于6位！');
		return false;
	}
	if (!/^1[3|5|8][0-9]{9}$/.test(registerForm.phoneNumber.value)) {
		alert('手机号码格式不正确！');
		return false;
	}
}


//////////////////////////////////策略模式改进/////////////////////////////////////////////
//策略
var strategies = {
	isNonEmpty: function(value, errorMsg) {
		if (value === '') {
			return errorMsg;
		}
	},
	minLength: function(value, length, errorMsg) {
		if (value.length < length) {
			return errorMsg;
		}
	},
	isMobile: function(value, errorMsg) {
		if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
			return errorMsg;
		}
	}
}

//校验
var Validator = function() {
	this.cache = [];
}

//只能添加 一个规则
Validator.prototype.add = function(dom, rule, errorMsg) {
	var ary = rule.split(':');
	this.cache.push(function() {
		var strategy = ary.shift();
		ary.unshift(dom.value);
		ary.push(errorMsg);
		return strategies[strategy].apply(dom, ary);
	})
}

// ===========================================================================>>>
//扩展可以添加多种校验规则
Validator.prototype.add = function(dom, rules) {
	var self = this;
	for (var i = 0, rule; rule = rules[i++];) {
		(function(rule) {
			var strategyAry = rule.strategy.split(':');
			var errorMsg = rule.errorMsg;
			self.cache.push(function() {
				var strategy = strategyAry.shift();
				strategyAry.unshift(dom.value);
				strategyAry.push(errorMsg);
				return strategies[strategy].apply(dom, strategyAry);
			});
		})(rule)
	}
}

Validator.prototype.start = function() {
	for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
		var msg = validatorFunc(); //开始校验，并取得校验后的返回信息 
		if (msg) {
			return msg;
		}
	}
}

//客户端调用
var registerForm = document.getElementById('register-form');
var validatorFunc = function() {
	var validator = new Validator();
	validator.add(registerForm.username, [{
		strategy: 'isNonEmpty',
		errorMsg: '用户名不能为空'
	}, {
		strategy: 'minLength:10',
		errorMsg: '用户名长度不能小于10'
	}]);
	validator.add(registerForm.password, [{
		strategy: 'minLength:6',
		errorMsg: '密码长度不能小于6'
	}]);
	validator.add(registerForm.phoneNumber, [{
		strategy: 'isMobile',
		errorMsg: '手机号码格式不正确'
	}]);

	var errorMsg = validator.start();
	return errorMsg;
}

registerForm.onsubmit = function() {
	var errorMsg = validatorFunc();
	if (errorMsg) {
		alert(errorMsg);
		return false;
	}
}