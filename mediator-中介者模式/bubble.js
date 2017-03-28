function Player(name) {
	this.name = name;
	this.enemy = null;
}
Player.prototype.win = function() {
	console.log(this.name + 'won');
}
Player.prototype.lose = function() {
	console.log(this.name + 'lost');
}
Player.prototype.die = function() {
	this.lose();
	this.enemy.win();
}

var player1 = new Player('皮蛋');
var player2 = new Player('小乖');

player1.enemy = player2;
player2.enemy = player1;

player1.die();


//为游戏增加队伍
var players = [];

function Player(name, teamColor) {
	this.partners = [];
	this.enemies = [];
	this.state = 'live';
	this.name = name;
	this.teamColor = teamColor;
}

Player.prototype.win = function() {
	console.log('winner:' + this.name);
}
Player.prototype.lose = function() {
	console.log('loser:' + this.name);
}

Player.prototye.die = function() {
	var all_dead = true;
	this.state = 'dead';
	for (var i = 0, partner; partner = this.partners[i++];) {
		if (partner.state !== 'dead') {
			all_dead = false;
			break;
		}
	}
	if (all_dead === true) {
		this.lose();
		for (var i = 0, partner; partner = this.partners[i++];) {
			partner.lose();
		}
		for (var i = 0, enemy; emeny = this.enemies[i++];) {
			enemy.win();
		}
	}
}

var playerFactory = function(name, teamColor) {
	var newPlayer = newPlayer(name, teamColor);

	for (var i = 0, player; player = players[i++];) {
		if (player.teamColor === newPlayer.teamColor) {
			player.partners.push(newPlayer);
			newPlayer.partners.push(player);
		} else {
			player.enemies.push(newPlayer);
			newPlayer.enemies.push(Player);
		}
	}
	players.push(newPlayer);

	return newPlayer;
}

///////////////////////////////////中介者模式改造/////////////////////////////////////
function Player(name, teamColor) {
	this.name = name;
	this.teamColor = teamColor;
	this.state = 'alive'; //玩家生存状态
}
Player.prototype.win = function() {
	console.log(this.name + "won");
};
Player.prototype.lose = function() {
	console.log(this.name + "lost");
};

/*******玩家死亡*******/
Player.prototype.die = function() {
	this.state = 'dead';
	playerDirector.ReceiveMessage('playerDead', this); //给中介者发送消息，玩家死亡
};
Player.prototype.remove = function() {
	playerDirector.ReceiveMessage('removePlayer', this);
};
Player.prototype.changeTeam = function(color) {
	playerDirector.ReceiveMessage('changeTeam', this, color);
};

var playerFactory = function(name, teamColor) {
	var newPlayer = new player(name, teamColor);
	playerDirector.ReceiveMessage('addPlayer', newPlayer);
	return newPlayer;
};

var playerDirector = (function() {
	var players = {}, // 保存所有玩家
		operations = {}; // 中介者可以执行的操作

	//新增玩家
	operations.addPlayer = function(player) {
		var teamColor = player.teamColor;
		players[teamColor] = players[teamColor] || [];
		players[teamColor].push(player);
	};

	//移除玩家
	operations.removePlayer = function(player) {
		var teamColor = player.teamColor;
		var teamPlayers = players[teamColor] || []; // 该队所有成员
		for (var i = teamPlayers.length - 1; i >= 0; i--) {
			if (teamPlayers[i] === player) {
				teamPlayers.splice(i, 1);
			}
		}
	};

	//玩家换队
	operations.changeTeam = function(player, newTeamColor) {
		operations.removePlayer(player);
		player.teamColor = newTeamColor;
		operations.addPlayer(player);
	};

	//玩家死亡
	operations.playerDead = function(player) {
		var i, all_dead = true,
			teamColor = player.teamColor,
			teamPlayers = players[teamColor];

		for (i = 0; player = teamPlayers[i++];) {
			if (player.state !== 'dead') {
				all_dead = false;
				break;
			}
		}

		if (all_dead === true) {
			for (i = 0; player = teamPlayers[i++];) {
				player.lose();
			}
			for (var color in players) {
				if (color != teamColor) {
					teamPlayers = players[color];
					for (i = 0; player = teamPlayers[i++];) {
						player.win();
					}
				}
			}
		}
	};

	var ReceiveMessage = function() {
		var message = Array.prototype.shift.call(arguments);
		operations[message].apply(this, arguments);
	};

	return {
		ReceiveMessage: ReceiveMessage
	}
})();