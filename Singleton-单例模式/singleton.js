var Singleton = (function() {
    var instance;

    function init() {
        /*这里定义单例代码*/
        return {
            publicMethod: function() {
                console.log('hello world');
            },
            publicProperty: 'test'
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();

/*调用公有的方法来获取实例:*/
Singleton.getInstance().publicMethod();