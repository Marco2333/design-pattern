/////////////////不采用享元模式/////////////////////
var id = 0;
window.startUpload = function(uploadType, files) {
    for (var i = 0, file; file = files[i++];) {
        var uploadObj = new Upload(uploadType, file.fileName, file.fileSize); // uploadType 区分是控件还是flash
        uploadObj.init(id++); // 给upload 对象设置一个唯一的id
    }
};

var Upload = function(uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
};

Upload.prototype.init = function(id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
        '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
        '<button class="delFile">删除</button>';
    this.dom.querySelector('.delFile').onclick = function() {
        that.delFile();
    }
    document.body.appendChild(this.dom);
};

Upload.prototype.delFile = function() {
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
};

startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000
}, {
    fileName: '2.html',
    fileSize: 3000
}, {
    fileName: '3.txt',
    fileSize: 5000
}]);
startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000
}, {
    fileName: '5.html',
    fileSize: 3000
}, {
    fileName: '6.txt',
    fileSize: 5000
}]);


///////////////////////////////////采用享元模式///////////////////////////////////
var Upload = function(uploadType) {
    this.uploadType = uploadType;
};

Upload.prototype.delFile = function(id) {
    uploadManager.setExternalState(id, this); // 将当前id对应的对象的外部状态都组装到共享对象中
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }

    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
}

//定义一个工厂来创建upload 对象，如果某种内部状态对应的共享对象已经被创建过，那么直接返回这个对象，否则创建一个新的对象
var UploadFactory = (function() {
    var createdFlyWeightObjs = {};
    return {
        create: function(uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createdFlyWeightObjs[uploadType];
            }
            return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
        }
    }
})();

//完善前面提到的uploadManager 对象，它负责向UploadFactory 提交创建对象的请求，
//并用一个uploadDatabase 对象保存所有upload 对象的外部状态，以便在程序运行过程中给upload 共享对象设置外部状态
var uploadManager = (function() {
    var uploadDatabase = {};
    return {
        add: function(id, uploadType, filename, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);
            var dom = document.createElement('div');
            dom.innerHTML =
                '<span>文件名称:' + fileName + ', 文件大小: ' + fileSize + '</span>' +
                '<button class="delFile">删除</button>';
            dom.querySelector('.delFile').onclick = function() {
                flyWeightObj.delFile(id);
            }
            document.body.appendChild(dom);
            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            };
            return flyWeightObj;
        },
        setExternalState: function(id, flyWeightObj) {
            var uploadData = uploadDatabase[id];
            for (var i in uploadData) {
                flyWeightObj[i] = uploadData[i];
            }
        }
    }
})();

var id = 0;
window.startUpload = function(uploadType, files) {
    for (var i = 0, file; file = files[i++];) {
        var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
};

startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000
}, {
    fileName: '2.html',
    fileSize: 3000
}, {
    fileName: '3.txt',
    fileSize: 5000
}]);
startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000
}, {
    fileName: '5.html',
    fileSize: 3000
}, {
    fileName: '6.txt',
    fileSize: 5000
}]);