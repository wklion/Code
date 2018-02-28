/**
 * 数据缓存类
 * Created by zouwei on 2015/11/10.
 */

function DataCache(name,isSaveFile){
    this.caches = null;
    this.name = name || "dataCache";
    this.isSaveFile = typeof(isSaveFile) == "undefined"?true:isSaveFile;//是否保存到文件系统中

    var t = this;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, 1024*1024*1024, initFS, errorHandler);
    function initFS(fs) {
        t.fs = fs;
        t.fs.root.getDirectory("Documents", {create: true}, function(dirEntry) {
            console.log("Directory successufully created");
        });
    }

    function errorHandler(err){
        console.log(err.message);
    };

    function createDir(rootDir, folders,callback) {
        rootDir.getDirectory(folders[0], {create: true}, function(dirEntry) {
            if (folders.length) {
                createDir(dirEntry, folders.slice(1),callback);
            }
            else{
                callback(dirEntry);
            }
        }, errorHandler);
    };
    /*
     * 描述：添加缓存数据
     * 缓存结构如下：
     *       maketime
     *           -date
     *               -version
     *                   -element
     *                           -hourspan
     *
     * 参数：
     *   maketime：制作时间（标识）
     *   version：版本（标识）
     *   date：预报时间（标识）
     *   element：要素（标识）
     *   hourspan：时效（标识）
     *   datasetGrid：格点数据
     *   status：数据状态
     *   recall;回调，add by wangkun 20161107
     * 返回：无
     * */
    this.addData = function(maketime, version, date, element, hourspan, datasetGrid, status,recall){
        if(t.caches == null)
            t.caches = {}
        if(!t.caches.hasOwnProperty(maketime))
            t.caches[maketime] = {};
        var maketimeData = t.caches[maketime];

        if(!maketimeData.hasOwnProperty(date))
            maketimeData[date] = {};
        var dateData = maketimeData[date];

        if(!dateData.hasOwnProperty(version))
            dateData[version] = {};
        var versionData = dateData[version];

        if(!versionData.hasOwnProperty(element))
            versionData[element] = {};
        var elementData = versionData[element];

        if(!elementData.hasOwnProperty(hourspan))
            elementData[hourspan] = {};
        var hourspanData = elementData[hourspan];
        hourspanData["data"] = datasetGrid;
        hourspanData["status"] = typeof(status)=="undefined"?0:status; //状态，-1，无数据，0-初始（默认），1-已修改，2-已提交，4-已（提交并）主观订正
        if(!t.isSaveFile || hourspan == -1)
            return;

        createDir(t.fs.root, ('Documents/' + t.name + '/'+ maketime + '/' + date + '/' + version + '/' + element + '/' + hourspan).split('/'), function (dirEntry) {
            dirEntry.getFile('data.txt', {create: true}, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    var blob = new Blob([datasetGrid?datasetGrid.grid.toString():""], {type: "text/plain"});
                    fileWriter.write(blob);
                    if(datasetGrid != null){
                        if(typeof (datasetGrid.del) != "undefined" && datasetGrid.del){
                            delete datasetGrid.grid;
                        }
                    }
                    recall&&recall();
                }, errorHandler);
            }, errorHandler);
            if(datasetGrid != null){
                dirEntry.getFile('data1.txt', {create: true}, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        var str = "";
                        str += datasetGrid.left+","+datasetGrid.top+","+datasetGrid.right+","+datasetGrid.bottom+","+datasetGrid.rows+","+datasetGrid.cols+","+datasetGrid.dimensions+","+datasetGrid.noDataValue+","+datasetGrid.dMin+","+datasetGrid.dMax+","+hourspanData["status"];
                        str += ","+(datasetGrid.tag?datasetGrid.tag:"");
                        str += ","+(datasetGrid.defaultTag?datasetGrid.defaultTag:"");

                        var blob = new Blob([str], {type: "text/plain"});
                        fileWriter.write(blob);
                    }, errorHandler);
                }, errorHandler);
            }
        }, errorHandler);
    };

    /*
     * 描述：获取缓存数据
     * 参数：
     *   maketime：制作时间（检索条件）
     *   version：版本（检索条件）
     *   date：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspan：时效（检索条件）
     * 返回：{data:xxx,status:yyyy}对象
     * */
    this.getData = function(maketime, version, date, element, hourspan,recall){
        var result = null;
        if(t.caches == null){
            recall&&recall(null);
            return result;
        }

        if(!t.caches.hasOwnProperty(maketime)){
            recall&&recall(null);
            return result;
        }

        var maketimeData = t.caches[maketime];
        if(!maketimeData.hasOwnProperty(date)){
            recall&&recall(null);
            return result;
        }

        var dateData = maketimeData[date];
        if(!dateData.hasOwnProperty(version)){
            recall&&recall(null);
            return result;
        }

        var versionData = dateData[version];
        if(!versionData.hasOwnProperty(element)){
            recall&&recall(null);
            return result;
        }

        var elementData = versionData[element];
        if(!hourspan)
            return elementData;
        else if(hourspan == -1 || !t.isSaveFile){
            if(!elementData.hasOwnProperty(hourspan))
                recall&&recall(null);
            else
                recall&&recall(elementData[hourspan]);
            return;
        }
        if(!recall)
            return null;

        var hourspanData = elementData[hourspan];
        if(typeof(hourspanData) == "undefined")
            recall(null);
        else if(hourspanData.data == null || (typeof (hourspanData.data.grid) != "undefined" && hourspanData.data.grid != null)){
            recall(hourspanData);
        }
        else{
            var dic='Documents/' + t.name + '/'+maketime+'/'+date+'/'+version+'/'+element+'/'+hourspan;
            t.fs.root.getDirectory(dic,{},function(dirEntry){
                    dirEntry.getFile('data.txt', {}, function (fileEntry) {
                        fileEntry.file(function(file){
                            var reader = new FileReader();
                            reader.onloadend = function (e)
                            {
                                var hourspanData=t.caches[maketime][date][version][element][hourspan];
                                if(hourspanData != null && hourspanData.data != null){
                                    var data = this.result.split(",");
                                    for(var i=0;i<data.length;i++){
                                        data[i] = parseFloat(data[i]);
                                    }
                                    if(typeof (hourspanData.data.grid) == "undefined" || hourspanData.data.grid == null) //就在我读取数据的刹那间，或许别的线程已读出来并订正了，为此这里再判断一下以免把别人修改的数据冲掉了
                                        hourspanData.data["grid"] = data;
                                }
                                recall(hourspanData);
                            }
                            reader.readAsText(file);
                        },function(){
                            recall();
                            //console.log(dic);
                            errorHandler
                        });
                    },function(){
                        recall();
                        //console.log(dic);
                        errorHandler
                    });
                },
                function(){
                    recall(null);
                    //console.log(dic);
                    errorHandler
                });
        }

    };

    /*
     * 描述：获取缓存数据
     * 参数：
     *   maketime：制作时间（检索条件）
     *   version：版本（检索条件）
     *   date：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspans：时效（检索条件）
     * 返回：{data:xxx,status:yyyy}对象
     * */
    this.getDatas = function(maketime, version, date, element, hourspans,recall){
        var num = 0;
        var datacaches = {};
        for(var i=0;i<hourspans.length;i++){
            getData(hourspans[i]);
        }
        function getData(hourspan){
            t.getData(maketime, version, date, element,hourspan,function(datacache){
                num++;
                if(datacache != null){
                    datacaches[hourspan] = datacache;
                }
                if(num == hourspans.length){
                    recall&&recall(datacaches);
                }
            });
        }
    };

    /*
     * 描述：设置缓存数据状态
     * 参数：
     *   date：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspan：时效（检索条件）
     *   status：状态
     * 返回：无
     * */
    this.setDataStatus = function(maketime, version, date, element, hourspan, status,datasetGrid){
        if(typeof (datasetGrid) != "undefined" && hourspan != -1){
            var GridStr = datasetGrid?datasetGrid.grid.toString():"";
            var statusStr = "";
            statusStr += datasetGrid.left+","+datasetGrid.top+","+datasetGrid.right+","+datasetGrid.bottom+","+datasetGrid.rows+","+datasetGrid.cols+","+datasetGrid.dimensions+","+datasetGrid.noDataValue+","+datasetGrid.dMin+","+datasetGrid.dMax+","+status;
            statusStr += ","+(datasetGrid.tag?datasetGrid.tag:"");
            statusStr += ","+(datasetGrid.defaultTag?datasetGrid.defaultTag:"");
            this.saveData(maketime, version, date, element, hourspan, GridStr,statusStr);
        }
        var datacaches = this.getData(maketime, version, date, element);
        var datacache = datacaches[hourspan];
        if(datacache != null)
        {
            datacache.status = status;
            if(datasetGrid)
                datacache["data"] = datasetGrid;
            if(element == GDYB.GridProductClass.currentElement){ //当且仅当该要素为当前要素，才更新UI
                if(status == 0){ //初始状态
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("disabled");
                }
                if(status == 1){ //已修改
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("disabled");
                    $("#yubaoshixiao").find("#"+hourspan+"h").addClass("modified");

                    //打破合理性
                    for(var key in CrossRelation){
                        var relation = CrossRelation[key];
                        if(relation.src == element){
                            relation.reasonable = false;
                        }
                    }
                }
                else if(status == 2){ //已提交
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("disabled");
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("modified");
                    $("#yubaoshixiao").find("#"+hourspan+"h").addClass("saved");
                }
                else if(status == 4){ //已（提交并）主观订正
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("disabled");
                    $("#yubaoshixiao").find("#"+hourspan+"h").removeClass("modified");
                    $("#yubaoshixiao").find("#"+hourspan+"h").addClass("subjective");
                }
            }
        }
    };

    /*
     * 描述：存grid数据
     * 返回：无
     * */
    this.saveData = function(maketime, version, date, element, hourspan,Gridstr,status){
        var filename='Documents/' + t.name + '/'+maketime+'/'+date+'/'+version+'/'+element+'/'+hourspan+'/';
        t.fs.root.getDirectory(filename, {}, function(dirEntry) {
            dirEntry.getFile("data.txt",{},function(fileEntry){
                fileEntry.remove(function() {
                    dirEntry.getFile('data.txt', {create: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            var blob = new Blob([Gridstr], {type: "text/plain"});
                            fileWriter.write(blob);
                        },errorHandler);
                    }, errorHandler);
                }, errorHandler);
            },errorHandler);
            dirEntry.getFile("data1.txt",{},function(fileEntry){
                fileEntry.remove(function() {
                    dirEntry.getFile('data1.txt', {create: true}, function (fileEntry) {
                        fileEntry.createWriter(function (fileWriter) {
                            var blob = new Blob([status], {type: "text/plain"});
                            fileWriter.write(blob);
                        },errorHandler);
                    }, errorHandler);
                }, errorHandler);
            },errorHandler);
        });
    }

    /*
     * 描述：清除缓存grid数据
     * */
    this.clearMem = function(){
        //删除grid
        for(var maketimeD in t.caches){
            var maketimeData = t.caches[maketimeD];
            if(maketimeData == null)
                continue;
            for(var dateD in  maketimeData){
                var dateData = maketimeData[dateD];
                if(dateData == null)
                    continue;
                for(var versionD in  dateData){
                    var versionData = dateData[versionD];
                    if(versionData == null)
                        continue;
                    for(var elementD in  versionData){
                        var elementData = versionData[elementD];
                        if(elementData == null)
                            continue;
                        for(var hourspanD in  elementData){
                            var hourspanData = elementData[hourspanD];
                            if(hourspanData == null || (elementD == GDYB.GridProductClass.currentElement && hourspanD == GDYB.GridProductClass.currentHourSpan))
                                continue;
                            if(hourspanData.data != null && typeof (hourspanData.data["grid"]) != "undefined"){
                                delete hourspanData.data.grid;
                            }
                        }
                    }
                }
            }
        }
    }

    /*
     * 描述：清除所有文件
     * */
    this.clearFile = function(callback){
        t.fs.root.getDirectory('Documents', {}, function(dirEntry) {
            dirEntry.removeRecursively(function(){
                console.log('Directory successufully removed.');
                callback&&callback();
            });
        }, errorHandler);
    }

    this.initInfos = function(){
        t.caches = null;
        var elements = [];
        var buttons = $("#div_element").find("button");
        for(var key in buttons){
            if(typeof(buttons[key].id) != "undefined" && buttons[key].id != "")
                elements.push(buttons[key].id);
        }
        var maketime = GDYB.GridProductClass.currentMakeTime;
        var date = GDYB.GDYBPage.myDateSelecter.getCurrentTime(false);
        var version = GDYB.GridProductClass.currentVersion
        var filePath = 'Documents/' + t.name + '/'+maketime+'/'+date+'/'+version+'/';
        var numX = 0;
        var numY = 0;
        if(!t.fs)
            return;
        for(var i =0;i<elements.length;i++){
            var element = elements[i];
            var hourSpans = GDYB.GDYBPage.getHourSpan(element);
            for(var j=0;j<hourSpans.length;j++){
                var hourspan = hourSpans[j];
                getData1(element,hourspan);
                numX++;
            }
        }
        function getData1(element,hourspan){
            var dic = filePath + element +"/"+ hourspan
            t.fs.root.getDirectory(dic,{},function(dirEntry){
                    dirEntry.getFile('data1.txt', {}, function (fileEntry) {
                        fileEntry.file(function(file){
                            var reader = new FileReader();
                            reader.onloadend = function (e)
                            {
                                var data = this.result.split(",");
                                if(t.caches == null)
                                    t.caches = {};
                                if(!t.caches.hasOwnProperty(maketime))
                                    t.caches[maketime] = {};
                                var maketimeData = t.caches[maketime];

                                if(!maketimeData.hasOwnProperty(date))
                                    maketimeData[date] = {};
                                var dateData = maketimeData[date];

                                if(!dateData.hasOwnProperty(version))
                                    dateData[version] = {};
                                var versionData = dateData[version];

                                if(!versionData.hasOwnProperty(element))
                                    versionData[element] = {};
                                var elementData = versionData[element];

                                if(!elementData.hasOwnProperty(hourspan))
                                    elementData[hourspan] = {};
                                var hourspanData = elementData[hourspan];
                                if(this.result != ""){
                                    var datasetGrid = new WeatherMap.DatasetGrid(parseFloat(data[0]), parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]), parseInt(data[4]), parseInt(data[5]), parseInt(data[6]));
                                    hourspanData["data"] = datasetGrid;
                                    datasetGrid.noDataValue = data[7];
                                    datasetGrid.dMin = parseFloat(data[8]);
                                    datasetGrid.dMax = parseFloat(data[9]);
                                    hourspanData["status"] = parseInt(data[10]);
                                }
                                numY++;
                                if(numX == numY){
                                    GDYB.GridProductClass.changeElement = true;
                                    GDYB.GDYBPage.updateHourSpanStatus();
                                    GDYB.GDYBPage.displayGridProduct();
                                }
                            }
                            reader.readAsText(file);
                        },function(){
                            numY++;
                            if(numX == numY){
                                GDYB.GDYBPage.updateHourSpanStatus();
                                GDYB.GDYBPage.displayGridProduct();
                            }
                            //console.log(dic);
                            errorHandler
                        });
                    },function(){
                        numY++;
                        if(numX == numY){
                            GDYB.GDYBPage.updateHourSpanStatus();
                            GDYB.GDYBPage.displayGridProduct();
                        }
                        //console.log(dic);
                        errorHandler
                    });
                },
                function(){
                    numY++;
                    if(numX == numY){
                        GDYB.GDYBPage.updateHourSpanStatus();
                        GDYB.GDYBPage.displayGridProduct();
                    }
                    //console.log(dic);
                    errorHandler
                });
        }
    }

    /*
     * 描述：获取缓存数据
     * 参数：
     *   maketime：制作时间（检索条件）
     *   version：版本（检索条件）
     *   date：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspan：所有时效（检索条件）
     * 返回：{data:xxx,status:yyyy}对象
     * */
    this.CheckHour = function(maketime, version, date, element, hourspan){
        var result = 0;
        if(t.caches == null)
            return result;
        if(!t.caches.hasOwnProperty(maketime))
            return result;
        var maketimeData = t.caches[maketime];
        if(!maketimeData.hasOwnProperty(date))
            return result;
        var dateData = maketimeData[date];
        if(!dateData.hasOwnProperty(version))
            return result;
        var versionData = dateData[version];
        if(!versionData.hasOwnProperty(element))
            return result;
        var elementData = versionData[element];
        if(!elementData.hasOwnProperty(hourspan))
            return result;
        result=elementData[hourspan].status;
        return result;
    }
    /*
     * 描述：检查文件是否存在
     * 参数：
     *   maketime：制作时间（检索条件）
     *   version：版本（检索条件）
     *   date：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspan：所有时效（检索条件）
     * 返回：是否存在
     * */
    this.CheckFileExit=function(maketime, version, date, element, hourspan){
        var isExit=false;
        if(t.caches == null)
            return isExit;
        if(!t.caches.hasOwnProperty(maketime))
            return isExit;
        var maketimeData = t.caches[maketime];
        if(!maketimeData.hasOwnProperty(date))
            return isExit;
        var dateData = maketimeData[date];
        if(!dateData.hasOwnProperty(version))
            return isExit;
        var versionData = dateData[version];
        if(!versionData.hasOwnProperty(element))
            return isExit;
        var elementData = versionData[element];
        if(!elementData.hasOwnProperty(hourspan))
            return isExit;
        isExit=true;
        return isExit
    }
    /*
     * 描述：检查文件是否存在
     * 参数：
     *   maketime：制作时间（检索条件）
     *   version：版本（检索条件）
     *   datetime：预报时间（检索条件）
     *   element：要素（检索条件）
     *   hourspan：所有时效（检索条件）
     * 返回：是否存在
     * */
    this.GetFileInfo=function(maketime, version, datetime, element, hourspan){
        var result=null;
        if(t.caches == null)
            return result;
        if(!t.caches.hasOwnProperty(maketime))
            return result;
        var maketimeData = t.caches[maketime];
        if(!maketimeData.hasOwnProperty(date))
            return result;
        var dateData = maketimeData[date];
        if(!dateData.hasOwnProperty(version))
            return result;
        var versionData = dateData[version];
        if(!versionData.hasOwnProperty(element))
            return result;
        var elementData = versionData[element];
        if(!elementData.hasOwnProperty(hourspan))
            return result;
        var hourspanData = elementData[hourspan];
        return hourspanData;
    }
}