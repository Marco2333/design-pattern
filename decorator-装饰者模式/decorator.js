///////////////////////////模拟传统面向对象语言的装饰者模式///////////////////////
var Plane = function() {};

Plane.prototype.fire = function() {
	console.log('发射普通子弹');
}

var MissileDecorator = function(plane) {
	this.plane = plane;
}
MissileDecorator.prototype.fire = function() {
	this.plane.fire();
	console.log('发射导弹');
}
var AtomDecorator = function(plane) {
	this.plane = plane;
}
AtomDecorator.prototype.fire = function() {
	this.plane.fire();
	console.log('发射原子弹');
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire();

/////////////////////////////JavaScript的装饰者模式//////////////////////////
var plane = {
	fire: function() {
		console.log('发射普通子弹');
	}
}
var missileDecorator = function() {
	console.log('发射导弹');
}
var atomDecorator = function() {
	console.log('发射原子弹');
}
var fire1 = plane.fire;
plane.fire = function() {
	fire1();
	missileDecorator();
}
var fire2 = plane.fire;
plane.fire = function() {
	fire2();
	atomDecorator();
}
plane.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹

////////////////////////保存原引用的方式///////////////////////////////
window.onload = function() {
	alert(1);
}

var _onload = window.onload || function() {};

window.onload = function() {
	_onload();
	alert();
}

//this劫持问题
var _getElementById = document.getElementById;
document.getElementById = function(id) {
	alert(1);
	return _getElementById(id);
}

var button = document.getElementById('button'); // Uncaught TypeError: Illegal invocation

//改进
var _getElementById = document.getElementById;
document.getElementById = function() {
	alert(1);
	return _getElementById.apply(document, arguments);
}

var button = document.getElementById('button');