/*****回调函数(其他模块和用户信息模块产生强耦合)*****/
login.succ(function(data) {
	header.setAvatar(data.avatar); // 设置header 模块的头像
	nav.setAvatar(data.avatar); // 设置导航模块的头像
	message.refresh(); // 刷新消息列表
	cart.refresh(); // 刷新购物车列表
});

/////////////////新增收货地址管理///////////////////////////
login.succ(function(data) {
	header.setAvatar(data.avatar);
	nav.setAvatar(data.avatar);
	message.refresh();
	cart.refresh();
	address.refresh(); // 增加这行代码
});

/////////////////////////////////使用观察者模式（发布订阅模式）重写////////////////////
var event = {
	clientList: [],
	listen: function(key, fn) {},
	trigger: function() {},
	remove: function(key, fn) {}
}

var login = {};
var installEvent = function(obj) {
	for (var i in event) {
		obj[i] = event[i];
	}
}

installEvent(login);

$.ajax('http:// xxx.com?login', function(data) { // 登录成功
	login.trigger('loginSucc', data); // 发布登录成功的消息
});

var header = (function() {
	login.listen('loginSucc', function(data) {
		header.setAvatar(data.avatar);
	});
	return {
		setAvatar: function(data) {
			console.log('设置header模块的头像');
		}
	}
})();

var nav = (function() { // nav 模块
	login.listen('loginSucc', function(data) {
		nav.setAvatar(data.avatar);
	});
	return {
		setAvatar: function(avatar) {
			console.log('设置nav模块的头像');
		}
	}
})();

var address = (function() { // nav 模块
	login.listen('loginSucc', function(obj) {
		address.refresh(obj);
	});
	return {
		refresh: function(avatar) {
			console.log('刷新收货地址列表');
		}
	}
})();