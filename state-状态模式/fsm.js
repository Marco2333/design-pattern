///////////////////////////////JavaScript版本的状态机/////////////////////////////////////////
///FSM：Finite State Machine有限状态机
var Light = function() {
	this.currState = FSM.off; // 设置当前状态
	this.button = null;
};

Light.prototype.init = function() {
	var button = document.createElement('button'),
		self = this;
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild(button);
	this.button.onclick = function() {
		self.currState.buttonWasPressed.call(self); // 把请求委托给FSM 状态机
	}
};

var FSM = {
	off: {
		buttonWasPressed: function() {
			console.log('关灯');
			this.button.innerHTML = '下一次按我是开灯';
			this.currState = FSM.on;
		}
	},
	on: {
		buttonWasPressed: function() {
			console.log('开灯');
			this.button.innerHTML = '下一次按我是关灯';
			this.currState = FSM.off;
		}
	}
};
var light = new Light();
light.init();

///delegate(委托)实现JavaScript状态机
var delegate = function(client, delegation) {
	return {
		buttonWasPressed: function() { // 将客户的操作委托给delegation 对象
			return delegation.buttonWasPressed.apply(client, arguments);
		}
	}
};

var FSM = {
	off: {
		buttonWasPressed: function() {
			console.log('关灯');
			this.button.innerHTML = '下一次按我是开灯';
			this.currState = this.onState;
		}
	},
	on: {
		buttonWasPressed: function() {
			console.log('开灯');
			this.button.innerHTML = '下一次按我是关灯';
			this.currState = this.offState;
		}
	}
};

var Light = function() {
	this.offState = delegate(this, FSM.off);
	this.onState = delegate(this, FSM.on);
	this.currState = this.offState; // 设置初始状态为关闭状态
	this.button = null;
};

Light.prototype.init = function() {
	var button = document.createElement('button'),
		self = this;
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild(button);
	this.button.onclick = function() {
		self.currState.buttonWasPressed();
	}
};
var light = new Light();
light.init();

///表驱动的有限状态机
var fsm = StateMachine.create({
	initial: 'off',
	events: [{
		name: 'buttonWasPressed',
		from: 'off',
		to: 'on'
	}, {
		name: 'buttonWasPressed',
		from: 'on',
		to: 'off'
	}],
	callbacks: {
		onbuttonWasPressed: function(event, from, to) {
			console.log(arguments);
		}
	},
	error: function(eventName, from, to, args, errorCode, errorMessage) {
		console.log(arguments); // 从一种状态试图切换到一种不可能到达的状态的时候
	}
});

button.onclick = function() {
	fsm.buttonWasPressed();
}

///街头霸王游戏
var FSM = {
	walk: {
		attack: function() {
			console.log('攻击');
		},
		defense: function() {
			console.log('防御');
		},
		jump: function() {
			console.log('跳跃');
		}
	},
	attack: {
		walk: function() {
			console.log('攻击的时候不能行走');
		},
		defense: function() {
			console.log('攻击的时候不能防御');
		},
		jump: function() {
			console.log('攻击的时候不能跳跃');
		}
	}
}