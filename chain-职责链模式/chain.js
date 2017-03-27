///////////////订单（不采用职责链模式）///////////////////////////
var order = function(orderType, pay, stock) {
  if (orderType == 1) { //500元订金  
    if (pay == true) {
      console.log('<span style="color:#006600;">500元定金预购,得到100元优惠券</span>');
    } else {
      if (stock > 0) {
        console.log('<span style="color:#006600;">普通购买,无优惠券</span>');
      } else {
        console.log('<span style="color:#009900;">手机库存不足</span>');
      }
    }
  } else if (orderType === 2) { //200元订金  
    if (pay == true) {
      console.log('<span style="color:#006600;">200元定金预购,得到50元优惠券</span>');
    } else {
      if (stock > 0) {
        console.log('<span style="color:#009900;">普通购买,无优惠券</span>');
      } else {
        console.log('<span style="color:#006600;">手机库存不足</span>');
      }
    }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log('<span style="color:#009900;">普通购买,无优惠券</span>');
    } else {
      console.log('<span style="color:#006600;">手机库存不足</span>');
    }
  }
}

order(1, true, 500); //输出:500元定金预购，得到100优惠卷

//////////////////////////////用职责链模式重构代码//////////////////////////////
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('<span style="color:#009900;">500元订金预购,得到100优惠券</span>');
  } else {
    order200(orderType, pay, stock);
  }
}

var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('<span style="color:#ff0000;">100元订金预购,得到50优惠券</span>');
  } else {
    orderNormal(orderType, pay, stock);
  }
}

var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买,无优惠券');
  } else {
    console.log('手机库存不足');
  }
}

//测试结果  
order500(1, true, 500); //500元定金预购，得到100优惠券  
order500(1, false, 500); //普通购买，无优惠券  
order500(2, true, 500); //200元定金预购，得到50优惠券  
order500(3, false, 500) //手机购买无优惠  
order500(3, false, 0); //手机库存不足

var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元订金预购,得到100优惠券');
  } else {
    order200(orderType, pay, stock); //order500和order200耦合在一起
  }
}

////////////////////////////////灵活可拆分的职责链节点//////////////////////////////
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元订金预购,得到100优惠券');
  } else {
    return 'nextSuccessor'; //我知道下一个节点是谁,反正把请求往后面传递
  }
}

var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('100元订金预购,得到50优惠券');
  } else {
    return‘ nextSuccessor’; //我知道下一个节点是谁,反正把请求往后面传递

  }
}

var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买,无优惠券');
  } else {
    console.log('手机库存不足');
  }
}

var Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
}

Chain.prototype.setNextSuccessor = function(successor) {
  return this.successor = successor;
}

Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
}

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = newChain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1, true, 500);
chainOrder500.passRequest(2, true, 500);
chainOrder500.passRequest(3, true, 500);
chainOrder500.passRequest(1, false, 0);

//这时候如果加了300元的订单也很方便
var order300 = function() {…}
chainOrder300 = new Chain(order3);
chainOrder500.setNextSuccess(chainOrder300);
chainOrder300.setNextSuccess(chainOrder200);

//////////////////////////////////异步的职责链////////////////////////////////////
Chain.prototype.next = function() {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments);
}

var fn1 = new Chain(function() {
  console.log(1);
  return 'nextSuccessor';
});

var fn2 = new Chain(function() {
  console.log(2);
  var self = this;
  setTimeout(function() {
    self.next();
  }, 1000);
});
var fn3 = new Chain(function() {
  console.log(3);
});

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

////////////////////////用AOP实现职责链///////////////////////////////////
Function.prototype.after = function(fn) {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
}

var order = order500.after(order200).after(orderNormal);
order(1, true, 500);
order(2, true, 500);
order(1, false, 500);

/////////////////////////用职责链模式获取文件上传对象//////////////////////////
var getActiveUploadObj = function() {
  try {
    return new ActiveXObject('TXFTNActiveX.FTNUpload'); //IE上传控件  
  } catch (e) {
    return 'nextSuccessor';
  }
};

var getFlashUploadObj = function() {
  if (supportFlash()) {
    var str = '<objecttype="application/x-shockwave-flash"></object>';
    return $(str).appendTo($('body'));
  }
  return 'nextSuccessor';
}

var getFormUploadObj = function() {
  return $("<form><input type='file' name='file'></form>").appendTo($('body'));
}

var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUploadObj);
console.log(getUploadObj());