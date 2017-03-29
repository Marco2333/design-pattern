Function.prototype.before = function(beforefn) {
	var __self = this; // 保存原函数的引用
	return function() { // 返回包含了原函数和新函数的"代理"函数
		beforefn.apply(this, arguments); // 执行新函数，且保证this 不被劫持，新函数接受的参数
		// 也会被原封不动地传入原函数，新函数在原函数之前执行
		return __self.apply(this, arguments); // 执行原函数并返回原函数的执行结果，
		// 并且保证this 不被劫持
	}
}

Function.prototype.after = function(afterfn) {
	var __self = this;
	return function() {
		var ret = __self.apply(this, arguments);
		afterfn.apply(this, arguments);
		return ret;
	}
};

document.getElementById = document.getElementById.before(function() {
	alert(1);
});
var button = document.getElementById('button');

console.log(button);

window.onload = function() {
	alert(1);
}
window.onload = (window.onload || function() {}).after(function() {
	alert(2);
}).after(function() {
	alert(3);
}).after(function() {
	alert(4);
});

//如果想不污染原型
var before = function(fn, beforefn) {
	return function() {
		beforefn.apply(this, arguments);
		return fn.apply(this, arguments);
	}
}
var a = before(
	function() {
		alert(3)
	},
	function() {
		alert(2)
	}
);
a = before(a, function() {
	alert(1);
});
a();

////////////////////////////数据统计上报////////////////////////////

///showLogin函数耦合了打开登录浮层和数据上报功能
var showLogin = function() {
	console.log('打开登录浮层');
	log(this.getAttribute('tag'));
}
var log = function(tag) {
	console.log('上报标签为: ' + tag);
	// (new Image).src = 'http:// xxx.com/report?tag=' + tag; // 真正的上报代码略
}
document.getElementById('button').onclick = showLogin;

//AOP分离
Function.prototype.after = function(afterfn) {
	var __self = this;
	return function() {
		ret = __self.apply(this, arguments);
		afterfn.apply(this, arguments);
		return ret;
	}
};

var showLogin = function() {
	console.log('打开登录浮层');
}
var log = function() {
	console.log('上报标签为: ' + this.getAttribute('tag'));
}

showLogin = showLogin.after(log); // 打开登录浮层之后上报数据
document.getElementById('button').onclick = showLogin;

/////////////////////////////AOP动态改变函数的参数//////////////////////////////
//是新添加的函数在旧函数之前执行
Function.prototype.before = function(beforefn) {
	var _this = this; //保存旧函数的引用
	return function() { //返回包含旧函数和新函数的“代理”函数
		beforefn.apply(this, arguments); //执行新函数,且保证this不被劫持,新函数接受的参数
		// 也会被原封不动的传入旧函数,新函数在旧函数之前执行
		return _this.apply(this, arguments);
	};
};

var func = function(param) {
	console.log(param); // 输出：{a: "a", b: "b"}
};

func = func.before(function(param) {
	param.b = 'b';
});

func({
	a: 'a'
});

//给ajax请求动态添加参数的例子
var ajax = function(type, url, param) {
	console.log(param);
};

var getToken = function() {
	return 'Token';
};

ajax = ajax.before(function(type, url, param) {
	param.token = getToken();
});

ajax('get', 'http://www.jn.com', {
	name: 'zhiqiang'
});

///////////////////////////////插件式的表单验证///////////////////////////////
///formSubmit耦合了提交ajax请求和输入合法验证功能
var username = document.getElementById('username'),
	password = document.getElementById('password'),
	submitBtn = document.getElementById('submitBtn');
var formSubmit = function() {
	if (username.value === '') {
		return alert('用户名不能为空');
	}
	if (password.value === '') {
		return alert('密码不能为空');
	}
	var param = {
		username: username.value,
		password: password.value
	}
	ajax('http:// xxx.com/login', param); // ajax 具体实现略
};

submitBtn.onclick = function() {
	formSubmit();
};

///改进 拆分验证和提交ajax功能
var validata = function() {
	if (username.value === '') {
		alert('用户名不能为空');
		return false;
	}
	if (password.value === '') {
		alert('密码不能为空');
		return false;
	}
}

//formSubmit函数内部还要计算validate的值
var formSubmit = function() {
	if (validata() === false) { // 校验未通过
		return;
	}
	var param = {
		username: username.value,
		password: password.value
	}
	ajax('http:// xxx.com/login', param);
}

submitBtn.onclick = function() {
	formSubmit();
}

///进一步优化
Function.prototype.before = function(beforefn) {
	var __self = this;
	return function() {
		if (beforefn.apply(this, arguments) === false) {
			// beforefn 返回false 的情况直接return，不再执行后面的原函数
			return;
		}
		return __self.apply(this, arguments);
	}
}

var validata = function() {
	if (username.value === '') {
		alert('用户名不能为空');
		return false;
	}
	if (password.value === '') {
		alert('密码不能为空');
		return false;
	}
}
var formSubmit = function() {
	var param = {
		username: username.value,
		password: password.value
	}
	ajax('http:// xxx.com/login', param);
}

formSubmit = formSubmit.before(validata);

submitBtn.onclick = function() {
	formSubmit();
}