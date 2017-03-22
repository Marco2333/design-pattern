var MacroCommand = function() {
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command);
        },
        execute: function() {
            for (var i = 0, command; command = this.commandsList[i++];) {
                command.execute();
            }
        }
    }
};
var openAcCommand = {
    execute: function() {
        console.log('打开空调');
    }
};
/**********家里的电视和音响是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音响的命令*********/
var openTvCommand = {
    execute: function() {
        console.log('打开电视');
    }
};
var openSoundCommand = {
    execute: function() {
        console.log('打开音响');
    }
};
var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);
/*********关门、打开电脑和打登录QQ 的命令****************/
var closeDoorCommand = {
    execute: function() {
        console.log('关门');
    }
};
var openPcCommand = {
    execute: function() {
        console.log('开电脑');
    }
};
var openQQCommand = {
    execute: function() {
        console.log('登录QQ');
    }
};
var macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQCommand);
/*********现在把所有的命令组合成一个“超级命令”**********/
var macroCommand = MacroCommand();
macroCommand.add(openAcCommand);
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);
/*********最后给遥控器绑定“超级命令”**********/
var setCommand = (function(command) {
    document.getElementById('button').onclick = function() {
        command.execute();
    }
})(macroCommand);


//透明性带来的问题
var openTvCommand = {
    execute: function() {
        console.log('打开电视');
    },
    add: function() {
        throw new Error('叶对象不能添加子节点'); // 抛出异常提醒用户
    }
}

var macroCommand = MacroCommand();
macroCommand.add(openTvCommand);
openTvCommand.add(macroCommand) // Uncaught Error: 叶对象不能添加子节点