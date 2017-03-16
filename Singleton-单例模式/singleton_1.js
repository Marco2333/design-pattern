var Singleton = function(name) {
	this.name = name;
	this.instance = null;
}

Singleton.prototype.getName = function() {
	return this.name;
}

Singleton.getInstance = function(name) {
	if (!this.instance) {
		this.instance = new Singleton(name);
	}
	return this.instance;
}

var a = Singleton.getInstance('s1');
var b = Singleton.getInstance('s2');

console.log(a === b); // true



//////////////////////////////////////////////////////////////
var Singleton = function(name) {
	this.name = name;
}

Singleton.prototype.getName = function() {
	return this.name;
}

Singleton.getInstance = (function() {
	var instance = null;
	return function(name) {
		if (!instance) {
			instance = new Singleton(name);
		}
		return instance;
	}
})();


var a = Singleton.getInstance('s1');
var b = Singleton.getInstance('s2');

console.log(a === b); // true