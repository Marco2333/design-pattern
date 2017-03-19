var miniConsole = (function() {
	var cache = [];
	var handler = function(ev) {
		if (ev.keyCode === 113) {
			var script = document.createElement('script');
			script.onload = function() {
				for (var i = 0, fn; fn = cache[i++];) {
					fn();
				}
			};
			script.src = 'miniConsole.js';
			document.getElementsByTagName('head')[0].appendChild(script);
			document.body.removeEventListener('keydown', handler);
		}
	};
	document.body.addEventListener('keydown', handler, false);
	return {
		log: function() {
			var args = arguments;
			cache.push(function() {
				return miniConsole.log.apply(miniConsole, args);
			});
		}
	}
})();

miniConsole.log(1);