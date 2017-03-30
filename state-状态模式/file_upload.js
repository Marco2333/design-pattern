window.external.upload = function(state) {
	console.log(state); // 可能为sign、uploading、done、error
};

//插件对象
var plugin = (function() {
	var plugin = document.createElement('embed');
	plugin.style.display = 'none';
	plugin.type = 'application/txftn-webkit';
	plugin.sign = function() {
		console.log('开始文件扫描');
	}
	plugin.pause = function() {
		console.log('暂停文件上传');
	};
	plugin.uploading = function() {
		console.log('开始文件上传');
	};
	plugin.del = function() {
		console.log('删除文件上传');
	}
	plugin.done = function() {
		console.log('文件上传完成');
	}
	document.body.appendChild(plugin);
	return plugin;
})();

var Upload = function(fileName) {
	this.plugin = plugin;
	this.fileName = fileName;
	this.button1 = null;
	this.button2 = null;
	this.state = 'sign'; // 设置初始状态为waiting
};

Upload.prototype.init = function() {
	var that = this;
	this.dom = document.createElement('div');
	this.dom.innerHTML =
		'<span>文件名称:' + this.fileName + '</span>\
		<button data-action="button1">扫描中</button>\
		<button data-action="button2">删除</button>';
	document.body.appendChild(this.dom);
	this.button1 = this.dom.querySelector('[data-action="button1"]'); // 第一个按钮
	this.button2 = this.dom.querySelector('[data-action="button2"]'); // 第二个按钮
	this.bindEvent();
};

Upload.prototype.bindEvent = function() {
	var self = this;
	this.button1.onclick = function() {
		if (self.state === 'sign') { // 扫描状态下，任何操作无效
			console.log('扫描中，点击无效...');
		} else if (self.state === 'uploading') { // 上传中，点击切换到暂停
			self.changeState('pause');
		} else if (self.state === 'pause') { // 暂停中，点击切换到上传中
			self.changeState('uploading');
		} else if (self.state === 'done') {
			console.log('文件已完成上传, 点击无效');
		} else if (self.state === 'error') {
			console.log('文件上传失败, 点击无效');
		}
	};

	this.button2.onclick = function() {
		if (self.state === 'done' || self.state === 'error' || self.state === 'pause') {
			// 上传完成、上传失败和暂停状态下可以删除
			self.changeState('del');
		} else if (self.state === 'sign') {
			console.log('文件正在扫描中，不能删除');
		} else if (self.state === 'uploading') {
			console.log('文件正在上传中，不能删除');
		}
	};
};

Upload.prototype.changeState = function(state) {
	switch (state) {
		case 'sign':
			this.plugin.sign();
			this.button1.innerHTML = '扫描中，任何操作无效';
			break;
		case 'uploading':
			this.plugin.uploading();
			this.button1.innerHTML = '正在上传，点击暂停';
			break;
		case 'pause':
			this.plugin.pause();
			this.button1.innerHTML = '已暂停，点击继续上传';
			break;
		case 'done':
			this.plugin.done();
			this.button1.innerHTML = '上传完成';
			break;
		case 'error':
			this.button1.innerHTML = '上传失败';
			break;
		case 'del':
			this.plugin.del();
			this.dom.parentNode.removeChild(this.dom);
			console.log('删除完成');
			break;
	}
	this.state = state;
};

var uploadObj = new Upload('JavaScript 设计模式与开发实践');
uploadObj.init();

window.external.upload = function(state) { // 插件调用JavaScript 的方法
	uploadObj.changeState(state);
};

window.external.upload('sign'); // 文件开始扫描

setTimeout(function() {
	window.external.upload('uploading'); // 1 秒后开始上传
}, 1000);

setTimeout(function() {
	window.external.upload('done'); // 5 秒后上传完成
}, 5000);


/////////////////////////////状态模式重构文件上传程序//////////////////////////////////
window.external.upload = function(state) {
	console.log(state); // 可能为sign、uploading、done、error
};
///插件对象
var plugin = (function() {
	var plugin = document.createElement('embed');
	plugin.style.display = 'none';
	plugin.type = 'application/txftn-webkit';
	plugin.sign = function() {
		console.log('开始文件扫描');
	}
	plugin.pause = function() {
		console.log('暂停文件上传');
	};
	plugin.uploading = function() {
		console.log('开始文件上传');
	};
	plugin.del = function() {
		console.log('删除文件上传');
	}
	plugin.done = function() {
		console.log('文件上传完成');
	}
	document.body.appendChild(plugin);
	return plugin;
})();

var Upload = function(fileName) {
	this.plugin = plugin;
	this.fileName = fileName;
	this.button1 = null;
	this.button2 = null;
	this.signState = new SignState(this); // 设置初始状态为waiting
	this.uploadingState = new UploadingState(this);
	this.pauseState = new PauseState(this);
	this.doneState = new DoneState(this);
	this.errorState = new ErrorState(this);
	this.currState = this.signState; // 设置当前状态
};

Upload.prototype.init = function() {
	var that = this;
	this.dom = document.createElement('div');
	this.dom.innerHTML =
		'<span>文件名称:' + this.fileName + '</span>\
		<button data-action="button1">扫描中</button>\
		<button data-action = "button2" > 删除 < /button>';
	document.body.appendChild(this.dom);
	this.button1 = this.dom.querySelector('[data-action="button1"]');
	this.button2 = this.dom.querySelector('[data-action="button2"]');
	this.bindEvent();
};

Upload.prototype.bindEvent = function() {
	var self = this;
	this.button1.onclick = function() {
		self.currState.clickHandler1();
	}
	this.button2.onclick = function() {
		self.currState.clickHandler2();
	}
};

Upload.prototype.sign = function() {
	this.plugin.sign();
	this.currState = this.signState;
};
Upload.prototype.uploading = function() {
	this.button1.innerHTML = '正在上传，点击暂停';
	this.plugin.uploading();
	this.currState = this.uploadingState;
};
Upload.prototype.pause = function() {
	this.button1.innerHTML = '已暂停，点击继续上传';
	this.plugin.pause();
	this.currState = this.pauseState;
};
Upload.prototype.done = function() {
	this.button1.innerHTML = '上传完成';
	this.plugin.done();
	this.currState = this.doneState;
};
Upload.prototype.error = function() {
	this.button1.innerHTML = '上传失败';
	this.currState = this.errorState;
};
Upload.prototype.del = function() {
	this.plugin.del();
	this.dom.parentNode.removeChild(this.dom);
};

var StateFactory = (function() {
	var State = function() {};
	State.prototype.clickHandler1 = function() {
		throw new Error('子类必须重写父类的clickHandler1方法');
	}
	State.prototype.clickHandler2 = function() {
		throw new Error('子类必须重写父类的clickHandler2方法');
	}
	return function(param) {
		var F = function(uploadObj) {
			this.uploadObj = uploadObj;
		}
		F.prototype = new State();
		for (var i int param) {
			f.prototype[i] = param[i];
		}
		return F;
	}
})();

var SignState = StateFactory({
	clickHandler1: function() {
		console.log('扫描中，点击无效...');
	},
	clickHandler2: function() {
		console.log('文件正在上传中，不能删除');
	}
});
var UploadingState = StateFactory({
	clickHandler1: function() {
		this.uploadObj.pause();
	},
	clickHandler2: function() {
		console.log('文件正在上传中，不能删除');
	}
});
var PauseState = StateFactory({
	clickHandler1: function() {
		this.uploadObj.uploading();
	},
	clickHandler2: function() {
		this.uploadObj.del();
	}
});
var DoneState = StateFactory({
	clickHandler1: function() {
		console.log('文件已完成上传, 点击无效');
	},
	clickHandler2: function() {
		this.uploadObj.del();
	}
});
var ErrorState = StateFactory({
	clickHandler1: function() {
		console.log('文件上传失败, 点击无效');
	},
	clickHandler2: function() {
		this.uploadObj.del();
	}
});

var uploadObj = new Upload('JavaScript 设计模式与开发实践');
uploadObj.init();
window.external.upload = function(state) {
	uploadObj[state]();
};
window.external.upload('sign');
setTimeout(function() {
	window.external.upload('uploading'); // 1 秒后开始上传
}, 1000);
setTimeout(function() {
	window.external.upload('done'); // 5 秒后上传完成
}, 5000);