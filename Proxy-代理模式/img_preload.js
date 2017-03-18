var myImage = (function() {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return {
		setSrc: function(src) {
			imgNode.src = src
		}
	}
})();

var proxyImage = (function() {
	var img = new Image;
	img.onload = function() {
		myImage.setSrc(this.src);
	}
	return {
		setSrc: function(src) {
			myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
			img.src = src;
		}
	}
})();

proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');



///////////////代理和本体接口的一致性/////////////////////
///本体和代理都为函数
var myImage = (function() {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode);
	return function(src) {
		imgNode.src = src;
	}
})();

var proxyImage = (function() {
	var img = new Image;
	img.onload - function() {
		myImage(this.src);
	}
	return function() {
		myImage('file:// /C:/Users/svenzeng/Desktop/loading.gif');
		img.src = src;
	}
})();

proxyImage('http:// imgcache.qq.com/music// N/k/000GGDys0yA0Nk.jpg');