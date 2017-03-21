//////////////////////////////////传统的命令模式///////////////////////////////////////////////
var setCommand = function(button, command) {
	button.onclick = function() {
		command.execute();
	}
}

var MenuBar = {
	refresh: function() {
		console.log('刷新菜单目录');
	}
};

var SubMenu = {
	add: function() {
		console.log('增加子菜单');
	},
	del: function() {
		console.log('删除子菜单');
	}
};
//将行为封装在命令类中
var RefreshMenuBarCommand = function(receiver) {
	this.receiver = receiver;
}

RefreshMenuBarCommand.prototype.execute = function() {
	this.receiver.refresh();
}

var AddSubMenuCommand = function(receiver) {
	this.receiver = receiver;
}

AddSubMenuCommand.prototype.execute = function() {
	this.receiver.add();
};

var DelSubMenuCommand = function(receiver) {
	this.receiver = receiver;
}
DelSubMenuCommand.prototype.execute = function() {
	this.receiver.del();
}

//将命令接收者传递到command对象中，并将command对象安装到button上面
var refreshMenucmd = new RefreshMenuBarCommand(MenuBar);
var addSubMenucmd = new AddSubMenuCommand(SubMenu);
var delSubMenucmd = new DelSubMenuCommand(SubMenu);

setCommand(btn1, refreshMenucmd);
setCommand(btn2, addSubMenucmd);
setCommand(btn3, delSubMenucmd);


//////////////////////常规直接调用方法///////////////////////////

var bindClick = function(button, func) {
	button.onclick = func;
}

var MenuBar = {
	refresh: function() {
		console.log('刷新菜单目录');
	}
};

var SubMenu = {
	add: function() {
		console.log('增加子菜单');
	}

		del: function() {
		console.log('删除子菜单');
	}
}
bindClick(btn1, MenuBar.refresh);
bindClick(btn2, SubMenu.add);
bindClick(btn2, SubMenu.del);

/////////////////////////////////JavaScript中的命令模式/////////////////////////////////////
///用闭包实现
var setCommand = function(button, func) {
	button.onclick = function() {
		func();
	}
}
var MenuBar = {
	refresh: function() {
		console.log('刷新菜单界面');
	}
};

var RefreshMenuBarCommand = function(receiver) {
	return function() {
		receiver.refresh();
	}
}

var refreshMenuBarCommand = RefreshMenuBarCommand(menubar);
setCommand(btn1, refreshMenuBarCommand);

//使用execute
var RefreshMenuBarCommand = function(receiver) {
	return {
		execute: function() {
			receiver.refresh();
		}
	}
}
var setCommand = function(button, command) {
	button.onclick = function() {
		command.execute();
	}
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(btn1, refreshMenuBarCommand);

///////////////////////////////撤销命令undo////////////////////////////////////
var ball = document.getElementById('ball');
var pos = document.getElementById('pos');
var moveBtn = document.getElementById('moveBtn');
var MoveCommand = function(receiver, pos) {
	this.receiver = receiver;
	this.pos = pos;
	this.oldPos = null;
}

MoveComand.prototype.execute = function() {
	this.receiver.start('left', this.pos, 1000, 'strongEaseOut');
	this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propertyName];
}

MoveCommand.prototype.undo = function() {
	this.receiver.start('left', this.oldPos, 1000, 'strongEaseOut');
}

var moveCommand;

moveBtn.onclick = function() {
	var animate = new Animate(ball);
	moveCommand = new MoveCommand(animate, pos.value);
	moveCommand.execute();
}
cancelBtn.onclick = function() {
	moveCommand.undo();
}

///////////////////////////撤销和重做/////////////////////////////
///先清除再重新执行
var Ryu = {
	attack: function() {
		console.log('攻击');
	},
	defense: function() {
		console.log('防御');
	},
	jump: function() {
		console.log('跳跃');
	},
	crouch: function() {
		console.log('蹲下');
	}
};

var makeCommand = function(receiver, state) {
	return function() {
		receiver[state]();
	}
};

var commands = {
	'119': 'jump', //w  
	'115': 'crouch', //s  
	'97': 'defense', //a  
	'100': 'attack' //d  
};

var commandStack = []; //保存命令的堆栈

document.onkeypress = function(ev) {
	var keyCode = ev.keyCode;
	command = makeCommand(Ryu, commands[keyCode]);
	if (command) {
		command(); //执行命令  
		commandStack.push(command);
	}
}

document.getElementById('replay').onclick = function() {
	var command;
	while (command = commandStack.shift()) {
		command();
	}
}

//////////////////////宏命令////////////////////////////////
var closeDoorCommand = { //不包含任何receiver信息
	execute: function() {
		console.log('关门');
	}
};

var openPcCommand = {
	execute: function() {
		console.log('开电脑');
	}
};

var openQQComand = {
	execute: function() {
		console.log('登录QQ');
	}
}

var MacroCommand = function() {
	return {
		commandsList: [],
		add: function() {
			this.commandsList.push(command);
		},
		execute: function() {
			for (var i = 0, command; command = this.commandsList[i++];) {
				command.execute();
			}
		}
	}
};

var macroCommand = MacroCommand();

macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);
macroCommand.execute();