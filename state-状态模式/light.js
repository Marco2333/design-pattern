/////////////////////////////////电灯程序//////////////////////////////////////
var Light = function() {
	this.state = 'off'; // 给电灯设置初始状态off
	this.button = null; // 电灯开关按钮
};

Light.prototype.init = function() {
	var button = document.createElement('button'),
		self = this;
	button.innerHTML = '开关';
	this.button = document.body.appendChild(button);
	this.button.onclick = function() {
		self.buttonWasPressed();
	}
};

Light.prototype.buttonWasPressed = function() {
	if (this.state === 'off') {
		console.log('开灯');
		this.state = 'on';
	} else if (this.state === 'on') {
		console.log('关灯');
		this.state = 'off';
	}
};

var light = new Light();
light.init();

///增加状态
Light.prototype.buttonWasPressed = function() {
	if (this.state === 'off') {
		console.log('弱光');
		this.state = 'weakLight';
	} else if (this.state === 'weakLight') {
		console.log('强光');
		this.state = 'strongLight';
	} else if (this.state === 'strongLight') {
		console.log('关灯');
		this.state = 'off';
	}
};

///////////////////////////////////状态模式改进电灯程序///////////////////////////////////
var OffLightState = function(light) {
	this.light = light;
};
OffLightState.prototype.buttonWasPressed = function() {
	console.log('弱光'); // offLightState 对应的行为
	this.light.setState(this.light.weakLightState); // 切换状态到weakLightState
};

var WeakLightState = function(light) {
	this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function() {
	console.log('强光'); // weakLightState 对应的行为
	this.light.setState(this.light.strongLightState); // 切换状态到strongLightState
};

var StrongLightState = function(light) {
	this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function() {
	console.log('关灯'); // strongLightState 对应的行为
	this.light.setState(this.light.offLightState); // 切换状态到offLightState
};

//Light类为上下文（Context）
var Light = function() {
	this.offLightState = new OffLightState(this);
	this.weakLightState = new WeakLightState(this);
	this.strongLightState = new StrongLightState(this);
	this.button = null;
};

Light.prototype.init = function() {
	var button = document.createElement('button'),
		self = this;
	this.button = document.body.appendChild(button);
	this.button.innerHTML = '开关';
	this.currState = this.offLightState; // 设置当前状态
	this.button.onclick = function() {
		self.currState.buttonWasPressed();
	}
};

Light.prototype.setState = function(newState) {
	this.currState = newState;
};

var light = new Light();
light.init();

///防止错误，让抽象父类的抽象方法直接抛出异常
var State = function() {};
State.prototype.buttonWasPressed = function() {
	throw new Error('父类的buttonWasPressed 方法必须被重写');
};
var SuperStrongLightState = function(light) {
	this.light = light;
};

SuperStrongLightState.prototype = new State(); // 继承抽象父类
SuperStrongLightState.prototype.buttonWasPressed = function() { // 重写buttonWasPressed 方法
	console.log('关灯');
	this.light.setState(this.light.offLightState);
};