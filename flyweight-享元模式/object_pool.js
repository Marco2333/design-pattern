//定义一个获取小气泡节点的工厂，作为对象池的数组成为私有属性被包含在工厂闭包里，　
var toolTipFactory = (function() {
    var toolTipPool = []; // toolTip 对象池
    return {
        create: function() {
            if (toolTipPool.length === 0) { // 如果对象池为空
                var div = document.createElement('div'); // 创建一个dom
                document.body.appendChild(div);
                return div;
            } else { // 如果对象池里不为空
                return toolTipPool.shift(); // 则从对象池中取出一个dom
            }
        },
        recover: function(tooltipDom) {
            return toolTipPool.push(tooltipDom); // 对象池回收dom
        }
    }
})();

//创建的小气泡节点
var ary = [];
for (var i = 0, str; str = ['A', 'B'][i++];) {
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    ary.push(toolTip);
};

//假设地图需要开始重新绘制，在此之前要把这两个节点回收进对象池
for (var i = 0, toolTip; toolTip = ary[i++];) {
    toolTipFactory.recover(toolTip);
};

//创建6 个小气泡
for (var i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++];) {
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
};


/////////////////////////通用对象池实现/////////////////////////////////////
var objectPoolFactory = function(createObjFn) {
    var objectPool = [];
    return {
        create: function() {
            var obj = objectPool.length === 0 ?
                createObjFn.apply(this, arguments) : objectPool.shift();
            return obj;
        },
        recover: function(obj) {
            objectPool.push(obj);
        }
    }
};

//现在利用objectPoolFactory 来创建一个装载一些iframe 的对象池
var iframeFactory = objectPoolFactory(function() {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.onload = function() {
        iframe.onload = null; // 防止iframe 重复加载的bug
        iframeFactory.recover(iframe); // iframe 加载完成之后回收节点
    }
    return iframe;
});

var iframe1 = iframeFactory.create();
iframe1.src = 'http://baidu.com';
var iframe2 = iframeFactory.create();
iframe2.src = 'http://QQ.com';
setTimeout(function() {
    var iframe3 = iframeFactory.create();
    iframe3.src = 'http://163.com';
})