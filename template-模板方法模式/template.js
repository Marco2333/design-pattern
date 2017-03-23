/////////////////////coffee or tea/////////////////////////////
///饮料
var Beverage = function() {};
Beverage.prototype.boilWater = function() {
	console.log('把水者沸');
};
Beverage.prototype.brew = function() {
	throw new Error('子类必须重写brew方法')
};
Beverage.prototype.pourInCup = function() {
	throw new Error('子类必须重写pourInCup方法')
};
Beverage.prototype.addCondiments = function() {
	throw new Error('子类必须重写addCondiments方法')
}
Beverage.prototype.init = function() { // 模板方法
	this.boilWater();
	this.brew();
	this.pourInCup();
	this.addCondiments();
}

///咖啡
var Coffee = function() {};
Coffee.prototype = new Beverage();

Coffee.prototype.brew = function() {
	console.log('用沸水冲泡咖啡');
}

Coffee.prototype.pourInCup = function() {
	console.log('把咖啡倒进杯子');
}

Coffee.prototype.addCondiments = function() {
	console.log('加糖和牛奶');
}

var coffee = new Coffee();
coffee.init();

///茶
var Tea = function() {};
Tea.prototype = new Beverage();
Tea.prototype.brew = function() {
	console.log('用沸水浸泡茶叶');
}
Tea.prototype.pourInCup = function() {
	console.log('把茶倒进杯子');
}
Tea.prototype.addCondiments = function() {
	console.log('加柠檬');
}

var tea = new Tea();
tea.init();

//////////////////////////////////钩子方法////////////////////////////////////
var Beverage = function() {};
Beverage.prototype.boilWater = function() {
	console.log('把水煮沸');
}

Beverage.prototype.brew = function() {
	throw new Error('子类必须重写brew方法')
}

Beverage.prototype.pourInCup = function() {
	throw new Error('子类必须重写pourInCup方法')
}

Beverage.prototype.addCondiments = function() {
	throw new Error('子类必须重写addCondiments方法')
}

Beverage.prototype.customerWantsCondiments = function() {
	return true;
}
Beverage.prototype.init = function() {
	this.boilWater();
	this.brew();
	this.pourInCup();
	if (this.customerWantsCondiments()) { //如果挂钩返回true，则需要调料  
		this.addCondiments();
	}
}

var CoffeeWithHook = function() {};
CoffeeWithHook.prototype = new Beverage();
CoffeeWithHook.prototype.brew = function() {
	console.log('用沸水冲泡咖啡');
}
CoffeeWithHook.prototype.pourInCup = function() {
	console.log('把咖啡倒进杯子')
}
CoffeeWithHook.prototype.addCondiments = function() {
	console.log('加糖和牛奶')
}

CoffeeWithHook.prototype.customerWantsCondiments = function() {
	return window.confirm('请问需要调料吗？');
}

var coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();

//////////////////////////////////////非继承实现模板方法模式////////////////////////////////////
var Beverage = function(param) {
	var boilWater = function() {
		console.log('把水煮沸');
	};
	var brew = param.brew || function() {
		throw new Error('必须传递brew方法');
	};
	var pourInCup = param.pourInCup || function() {
		throw new Error('必须传递pourInCup方法');
	};
	var addCondiments = param.addCondiments || function() {
		throw new Error('必须传递addCondiments方法');
	};
	var F = function() {};
	F.prototype.init = function() {
		boilWater();
		brew();
		pourInCup();
		addCondiments();
	}
	return F;

}

var Coffee = Beverage({
	brew: function() {
		console.log('用沸水冲泡咖啡')
	},
	pourInCup: function() {
		console.log('把咖啡倒塌杯子')
	},
	addCondiments: function() {
		console.log("加糖加奶");
	}
});

var Tea = Beverage({
	brew: function() {
		console.log('用沸水冲泡茶叶')
	},
	pourInCup: function() {
		console.log('把茶倒塌杯子')
	},
	addCondiments: function() {
		console.log("加柠檬");
	}
});

var coffee = newCoffee();
coffee.init();

var tea = newTea();
tea.init();