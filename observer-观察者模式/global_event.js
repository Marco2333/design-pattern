/////////////////////////////////////全局的发布-订阅对象//////////////////////////////////////
var Event = (function() {
    var clientList = {},
        listen, trigger, remove;

    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function() {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];

        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function(key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                fns.splice(l, 1);
            }
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
})();

Event.listen('squareMeter88', function(price) { // 小红订阅消息
    console.log('价格= ' + price); // 输出：'价格=2000000'
});

Event.trigger('squareMeter88', 2000000); // 售楼处发布消息


///////////////////////模块通信///////////////////////////
// <html>
// <body>
//     <button id="count">点我</button>
//     <div id="show"></div>
// </body>
// <script type="text/JavaScript">
//a模块
(function() {
    var count = 0;
    var button = document.getElementById('count');
    button.onclick = function() {
        Event.trigger('add', count++);
    }
})();
//b模块
(function() {
    var div = document.getElementById('show');
    Event.listen('add', function(count) {
        div.innerHTML = count;
    });
})();
// </script>
// </html>

///////////////////////////命名空间（解决全局事件的命名冲突）（允许先发布后订阅）//////////////////////////////
var Event = (function() {
    var global = this,
        Event,
        _default = 'default';

    Event = function() {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                var ret;
                for (var i = 0, l = ary.length; i < l; i++) {
                    var n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };

        _listen = function(key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function(key, cache, fn) {
            var cacheKey;
            if (cacheKey = cache[key]) {
                if (fn) {
                    for (var i = cacheKey.length - 1; i >= 0; i--) {
                        if (cacheKey[i] === fn) {
                            cacheKey.splice(i, 1);
                        }
                    }
                } else {
                    cacheKey = [];
                }
            }
        };
        _trigger = function() {
            var cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret,
                stack = cache[key];

            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function() {
                return this.apply(_self, args);
            })
        };
        _create = function(namespace) {
            var namespace = namespace || _default;
            var cache = {},
                offlineStack = [], //离线事件
                ret = {
                    listen: function(key, fn, last) {
                        _listen(key, fn, cache);
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') {
                            offlineStack.length && offlineStack.pop()();
                        } else {
                            each(offlineStack, function() {
                                this();
                            });
                        }

                        offlineStack = null;
                    },
                    one: function(key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last);
                    },
                    remove: function(key, fn) {
                        _remove(key, cache, fn);
                    },
                    trigger: function() {
                        var fn,
                            args,
                            _self = this;

                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function() {
                            return _trigger.apply(_self, args);
                        };
                        if (offlineStack) {
                            return offlineStack.push(fn);
                        }
                        return fn();
                    }
                };

            return namespace ?
                (namespaceCache[namespace] ? namespaceCache[namespace] :
                    namespaceCache[namespace] = ret) : ret;
        };

        return {
            create: _create,
            one: function(key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function(key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function(key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function() {
                var event = this.create();
                event.trigger.apply(this, arguments);
            }
        };
    }();

    return Event

})();


/************** 先发布后订阅 ********************/
Event.trigger('click', 1);
Event.listen('click', function(a) {
    console.log(a); // 输出:1
});

/************** 使用命名空间 ********************/
Event.create('namespace1').listen('click', function(a) {
    console.log(a); // 输出:1
});
Event.create('namespace1').trigger('click', 1);
Event.create('namespace2').listen('click', function(a) {
    console.log(a); // 输出:2
});
Event.create('namespace2').trigger('click', 2);