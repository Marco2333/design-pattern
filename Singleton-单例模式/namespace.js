var MyApp = {};

MyApp.namespace = function(name) {
	var parts = name.split('.');
	var current = MyApp;
	for (var i in parts) {
		if (!current[parts[i]]) {
			current[parts[i]] = {};
		}
		current = current[parts[i]];
	}
}

MyApp.namespace('event');
MyApp.namespace('dom.style');
console.log(MyApp);