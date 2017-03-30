var googleMap = {
	show: function() {
		console.log('开始渲染谷歌地图');
	}
};
var baiduMap = {
	show: function() {
		console.log('开始渲染百度地图');
	}
};
var renderMap = function(map) {
	if (map.show instanceof Function) {
		map.show();
	}
};

renderMap(googleMap); // 输出：开始渲染谷歌地图
renderMap(baiduMap); // 输出：开始渲染百度地图


var googleMap = {
	show: function() {
		console.log('开始渲染谷歌地图');
	}
};
var baiduMap = {
	display: function() {
		console.log('开始渲染百度地图');
	}
};

//应用适配器
var baiduMapAdapter = {
	show: function() {
		return baiduMap.display();
	}
};

renderMap(googleMap); // 输出：开始渲染谷歌地图
renderMap(baiduMapAdapter); // 输出：开始渲染百度地图

var getGuangdongCity = function() {
	var guangdongCity = [{
		name: 'shenzhen',
		id: 11,
	}, {
		name: 'guangzhou',
		id: 12,
	}];
	return guangdongCity;
};
var render = function(fn) {
	console.log('开始渲染广东省地图');
	document.write(JSON.stringify(fn()));
};
render(getGuangdongCity);

var guangdongCity = {
	shenzhen: 11,
	guangzhou: 12,
	zhuhai: 13
};
var getGuangdongCity = function() {
	var guangdongCity = [{
			name: 'shenzhen',
			id: 11,
		}, {
			name: 'guangzhou',
			id: 12,
		}

	];
	return guangdongCity;
};
var render = function(fn) {
	console.log('开始渲染广东省地图');
	document.write(JSON.stringify(fn()));
};

//应用适配器
var addressAdapter = function(oldAddressfn) {
	var address = {},
		oldAddress = oldAddressfn();
	for (var i = 0, c; c = oldAddress[i++];) {
		address[c.name] = c.id;
	}
	return function() {
		return address;
	}
};
render(addressAdapter(getGuangdongCity));