//initialize onload
var mapObj,toolBar;

var locationInfo = new AMap.LngLat(0, 0);


var clicklnglat = new AMap.LngLat(0, 0);

var geolocation;

var gcircle = null;

var marker = new Array();
var windowsArr = new Array();
//function printlog(str)
//{
    //document.getElementById("log").innerHTML+= str;
    //document.getElementById("log").innerHTML+= "<br>";
//} 

 
function getCurrentPos(){
	return locationInfo;
}
 
//鼠标在地图上点击，获取经纬度坐标
function getClickLnglat(e){ 
    //document.getElementById("lngX").value=e.lnglat.getLng(); 
    //document.getElementById("latY").value=e.lnglat.getLat();  
    //clicklnglat.lng = e.lnglat.getLng(); 
    //clicklnglat.lat = e.lnglat.getLat();
    clicklnglat = e.lnglat;
}


function showClickPos(e) {
    getClickLnglat(e);
    //locationInfo = clicklnglat;
    //printlog("current pos:"+clicklnglat.lng + ","+clicklnglat.lat);
    searchShopServcie(clicklnglat,1000);
}




//获取定位位置信息
function showLocationInfo()
{
    var _loc = getCurrentPos();
	
	var locationX = _loc.lng; //定位坐标经度值
    var locationY = _loc.lat; //定位坐标纬度值
    document.getElementById('info').innerHTML = "定位点坐标：("+locationX+","+locationY+")";
}



/*
 *解析定位结果
 */
function onComplete (data) {
    var str = '<p>定位成功</p>';
    str += '<p>经度：' + data.position.getLng() + '</p>';
    str += '<p>纬度：' + data.position.getLat() + '</p>';
    str += '<p>精度：' + data.accuracy + ' 米</p>';
    str += '<p>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</p>';
	
	//locationInfo.lng = data.position.getLng();
	//locationInfo.lat = data.position.getLat();
	alert(str);
};



/*
 *解析定位错误信息
 */
function onError (data) {
	alert("定位解析失败");
};
   

//初始化地图对象，加载地图
//center及level属性缺省，地图默认显示用户所在城市范围
//it have to be call at onload of body
function mapInit(){
    mapObj = new AMap.Map("iCenter",{
        view: new AMap.View2D({
        zoom:13 //地图显示的缩放级别
        })
    });
    //地图中添加地图操作ToolBar插件
    mapObj.plugin(["AMap.ToolBar","AMap.Geolocation"],function(){     
        toolBar = new AMap.ToolBar(); //设置地位标记为自定义标记
        mapObj.addControl(toolBar); 
        AMap.event.addListener(toolBar,'location',function callback(e){
            locationInfo = e.lnglat;           
        });	
		
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
		
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
	});

    AMap.event.addListener(mapObj,'click', showClickPos);
    document.getElementById("keyword").oninput = autoSearch;

}

function shareMapInit(){
    mapObj = new AMap.Map("iCenter",{
        view: new AMap.View2D({
        zoom:13 //地图显示的缩放级别
        })
    });

    //alert("1placesearch");
    //地图中添加地图操作ToolBar插件
    mapObj.plugin(["AMap.ToolBar"],function(){     
        toolBar = new AMap.ToolBar(); //设置地位标记为自定义标记
        mapObj.addControl(toolBar); 
        AMap.event.addListener(toolBar,'location',function callback(e){
            locationInfo = e.lnglat;           

            //alert("placesearch");
            placeSearch(locationInfo, 1000, "购物中心","060101", getFirstSearchRes_CallBack);
         

        });	
        posCurrent();
        document.getElementById("shopname").oninput = autoSearchShopName;
		
   	});
}
 
/*
 *获取当前位置信息
 */
function getCurrentPosition () {
    geolocation.getCurrentPosition();
};
/*
 *监控当前位置并获取当前位置信息
 */
function watchPosition () {
    geolocation.watchPosition();
};

function posCurrent(){
	toolBar.doLocation();
}


function autoSearchShopName() {
    var keywords = document.getElementById("shopname").value;
    var auto;
    //加载输入提示插件
    mapObj.plugin(["AMap.Autocomplete"], function() {
        var autoOptions = {
            city: "beijing", //城市，默认全国
            type: "060000"
        };
        auto = new AMap.Autocomplete(autoOptions);
        //查询成功时返回查询结果
        if ( keywords.length > 0) {
            AMap.event.addListener(auto,"complete",autocompleteShopName_CallBack);

            auto.search(keywords);
        }
        else {
            document.getElementById("shopsearchres").style.display = "none";
        }
    });
}

//从输入提示框中选择关键字并查询
function selectResultShopName(index) {
    //截取输入提示的关键字部分
    var text = document.getElementById("divid" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g,"");;
    document.getElementById("shopname").value = text;
    document.getElementById("shopsearchres").style.display = "none";
    //document.getElementById("lng").value = resultArr[0].location.getLng();
    //document.getElementById("lat").value = resultArr[0].location.getLat();
    //根据选择的输入提示关键字查询
    mapObj.plugin(["AMap.PlaceSearch"], function() {       
        var msearch = new AMap.PlaceSearch();  //构造地点查询类
        AMap.event.addListener(msearch, "complete", getFirstSearchRes_CallBack); //查询成功时的回调函数
        msearch.search(text);  //关键字查询查询
    });


}

function autocompleteShopName_CallBack(data) {
    var resultStr = "";
    var tipArr = [];
    if(data.tips == undefined)
        return;
    tipArr = data.tips;
     
    if (tipArr.length>0) {                
        for (var i = 0; i < tipArr.length; i++) {
            resultStr += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById1(" + (i + 1)
                        + ",this)' onclick='selectResultShopName(" + i + ")' onmouseout='onmouseout_MarkerStyle(" + (i + 1)
                        + ",this)' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\">" + tipArr[i].name + "<span style='color:#C1C1C1;'>"+ tipArr[i].district + "</span></div>";
        }
    }
    else  {
        resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
    }
    document.getElementById("shopsearchres").innerHTML = resultStr;
    document.getElementById("shopsearchres").style.display = "block";
}

//输入提示
function autoSearch() {
    var keywords = document.getElementById("keyword").value;
    var auto;
    //加载输入提示插件
    mapObj.plugin(["AMap.Autocomplete"], function() {
        var autoOptions = {
            city: "beijing", //城市，默认全国
            type: "060000"
        };
        auto = new AMap.Autocomplete(autoOptions);
        //查询成功时返回查询结果
        if ( keywords.length > 0) {
            AMap.event.addListener(auto,"complete",autocomplete_CallBack);

            auto.search(keywords);
        }
        else {
            document.getElementById("result1").style.display = "none";
        }
    });
}



function autocomplete_CallBack(data) {
    var resultStr = "";
    var tipArr = [];
    tipArr = data.tips;
    if (tipArr.length>0) {                
        for (var i = 0; i < tipArr.length; i++) {
            resultStr += "<div id='divid" + (i + 1) + "' onmouseover='openMarkerTipById1(" + (i + 1)
                        + ",this)' onclick='selectResult(" + i + ")' onmouseout='onmouseout_MarkerStyle(" + (i + 1)
                        + ",this)' style=\"font-size: 13px;cursor:pointer;padding:5px 5px 5px 5px;\">" + tipArr[i].name + "<span style='color:#C1C1C1;'>"+ tipArr[i].district + "</span></div>";
        }
    }
    else  {
        resultStr = " π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确。<br />2.尝试不同的关键字。<br />3.尝试更宽泛的关键字。";
    }
    document.getElementById("result1").innerHTML = resultStr;
    document.getElementById("result1").style.display = "block";
}


//从输入提示框中选择关键字并查询
function selectResult(index) {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        document.getElementById("keyword").onpropertychange = null;
        document.getElementById("keyword").onfocus = focus_callback;
    }
    //截取输入提示的关键字部分
    var text = document.getElementById("divid" + (index + 1)).innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g,"");;
    document.getElementById("keyword").value = text;
    document.getElementById("result1").style.display = "none";
    //根据选择的输入提示关键字查询
    mapObj.plugin(["AMap.PlaceSearch"], function() {       
        var msearch = new AMap.PlaceSearch();  //构造地点查询类
        AMap.event.addListener(msearch, "complete", placeSearch_CallBack); //查询成功时的回调函数
        msearch.search(text);  //关键字查询查询
    });
}
 



//查询
function searchShopServcie(_lnglat,radius){
    //var precise = {lng: 0.05, lat: 0.05};
    //var radius = 1000;
    var poi = "060000";
    placeSearch(_lnglat, radius,"商场", poi, placeSearch_CallBack);
}




function searchNearestPlace(centerpos, keyword){
    var arr = new Array()
    var MSearch;
   
    mapObj.plugin(["AMap.PlaceSearch"], function() { //加载PlaceSearch服务插件     
        MSearch = new AMap.PlaceSearch({
            pageSize: 8
        }); //构造地点查询类
        AMap.event.addListener(MSearch, "complete", placeSearch_CallBack); //查询成功时的回调函数
        AMap.event.addListener(MSearch, "error", function(){
            alert("msearch error!");
        }); //查询成功时的回调函数
        //MSearch.searchInBounds("", new AMap.Bounds(lefttop, rightbot)); //范围查询
        //printlog("center pos: "+centerpos.lng + "," + centerpos.lat);
        //alert(""+centerpos);
        MSearch.searchNearBy(keyword, centerpos, 10); //范围查询
    });

}

function placeSearchFirst_CallBack(data){
    //alert("placesearch ok");
    var resultStr="";
    var resultArr = data.poiList.pois;
    var resultNum = resultArr.length; 
    alert("len:" + resultNum);
    for (var i = 0; i < resultNum; i++) { 
        resultStr += "<div id='divid"+(i+1)+"' onmouseover='openMarkerTipById1("+i+",this)' onmouseout='onmouseout_MarkerStyle("+(i+1)+",this)' style=\"font-size: 12px;cursor:pointer;padding:2px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"http://webapi.amap.com/images/"+(i+1)+".png\"></td>"+"<td><h3><font color=\"#00a6ac\">名称: "+resultArr[i].name+"</font></h3>";
        resultStr += TipContents(resultArr[i].type, resultArr[i].address, resultArr[i].tel)+"</td></tr></table></div>";
        addmarker(i, resultArr[i]);
    }

    mapObj.setFitView();
    document.getElementById("result").innerHTML += resultStr;
}  




function TestShowMarkOnMap(){

    var poiarr = new Array();


}


function showMarkOnMap(mypoiarr){
    var arrlen = mypoiarr.length;
    for(var i = 0; i < arrlen; ++i){
        addmarker(i, mypoiarr[i],ShopContents);
    }
}






//地点查询函数    
//centerpos = {lng:"", lat:""};
function placeSearch(centerpos, radius, keyword,placetype, callback){
    mapObj.clearMap();
    var arr = new Array();
    var MSearch;
    mapObj.plugin(["AMap.PlaceSearch"], function() { //加载PlaceSearch服务插件     
        MSearch = new AMap.PlaceSearch({
            pageSize: 8,
            type: placetype
        }); //构造地点查询类
        AMap.event.addListener(MSearch, "complete", callback); //查询成功时的回调函数
        AMap.event.addListener(MSearch, "error", function(){
            alert("msearch error!");
        }); //查询成功时的回调函数
        //MSearch.searchInBounds("", new AMap.Bounds(lefttop, rightbot)); //范围查询
        //printlog("center pos: "+centerpos.lng + "," + centerpos.lat);
        //alert(""+centerpos);
        MSearch.searchNearBy(keyword, centerpos, radius); //范围查询
    });
}


function getFirstSearchRes_CallBack(data){
    var resultStr="";
    var resultArr = data.poiList.pois;
    var resultNum = resultArr.length; 

    //printlog("resultNum:"+resultNum);

    if(resultNum > 0){
        document.getElementById("shopname").value = resultArr[0].name;
        document.getElementById("lng").value = resultArr[0].location.getLng();
        document.getElementById("lat").value = resultArr[0].location.getLat();
    }
}

//地点查询回调函数
function placeSearch_CallBack(data){
    //alert("placesearch ok");
    var resultStr="";
    var resultArr = data.poiList.pois;
    var resultNum = resultArr.length; 
    //alert(""+resultArr);
    alert("len:" + resultNum);
    for (var i = 0; i < resultNum; i++) { 
        resultStr += "<div id='divid"+(i+1)+"' onmouseover='openMarkerTipById1("+i+",this)' onmouseout='onmouseout_MarkerStyle("+(i+1)+",this)' style=\"font-size: 12px;cursor:pointer;padding:2px 0 4px 2px; border-bottom:1px solid #C1FFC1;\"><table><tr><td><img src=\"http://webapi.amap.com/images/"+(i+1)+".png\"></td>"+"<td><h3><font color=\"#00a6ac\">名称: "+resultArr[i].name+"</font></h3>";
        resultStr += TipContents(resultArr[i].type, resultArr[i].address, resultArr[i].tel)+"</td></tr></table></div>";
        addmarker(i, resultArr[i], TipContents);
    }
    mapObj.setFitView();
    document.getElementById("result").innerHTML = resultStr;
}  

//添加marker和infowindow 
//{lng:12,lat:111}
function addmarker_cus(i, lnglat, _content){
    var lngX = lnglat.lng;
    var latY = lnglat.lat
    var markerOption = {
        map:mapObj,
        icon:"http://webapi.amap.com/images/"+(i+1)+".png",
        position:new AMap.LngLat(lngX, latY) 
    };           
    var mar =new AMap.Marker(markerOption); 
    marker.push(new AMap.LngLat(lngX, latY));
 
    var infoWindow = new AMap.InfoWindow({
        content: _content,
        size:new AMap.Size(300, 0),
        autoMove:true,
        offset:new AMap.Pixel(0,-30)
    }); 
    windowsArr.push(infoWindow);  
    var aa = function(){infoWindow.open(mapObj, mar.getPosition());}; 
    AMap.event.addListener(mar, "click", aa); 
}



//添加圆覆盖物
function addCircle(_lnglat, _radius) {
   gcircle = new AMap.Circle({
       center:new AMap.LngLat(lnglat.lng,lnglat.lat),// 圆心位置
       radius:_radius, //半径
       strokeColor: "#F33", //线颜色
       strokeOpacity: 1, //线透明度
       strokeWeight: 3, //线粗细度
       fillColor: "#ee2200", //填充颜色
       fillOpacity: 0.35//填充透明度
   });
   gcircle.setMap(mapObj);
}

//更新圆形，除此以外还可通过插件AMap.CircleEditor进行线覆盖物的更新，详情参看AMap.CircleEditor相关示例介绍
function updateCircle(_lnglat, _radius){
    //新圆形属性
    var circleoptions={      
        center:new AMap.LngLat(lnglat.lng,lnglat.lat),// 新圆心位置
        radius:_radius, //新半径
        strokeColor: "#0000FF", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: "#ee2200", //填充颜色
        fillOpacity: 0.35//填充透明度
    };
    gcircle.setOptions(circleoptions);//更新圆属性
}

function HideCircle(){
    gcircle.hide();
}
function ShowCircle(_lnglat, _radius){
    if(null == gcircle){
        addCircle(_lnglat, _radius);
    }
    else{
        updateCircle(_lnglat, _radius);
    }

    gcircle.show();
}



function FilterInCircle(data, centerLnglat, radius){
    var tmpArr = new Array();
    var center = new AMap.LngLat(centerLnglat.lng, centerLnglat.lat);
    var len = data.length;
    for(var i = 0; i < len; ++i){
        var tmpobj = new AMap.LngLat(data[i].geo_point.lng, data[i].geo_point.lat);
        if(center.distance(tmpobj) <= radius)
            tmpArr.push(data[i]);
    }
    return tmpArr;
}



//添加marker和infowindow 
function addmarker(i, d, contentfunc){
    var lngX = d.location.getLng();
    var latY = d.location.getLat();
    var markerOption = {
        map:mapObj,
        icon:"http://webapi.amap.com/images/"+(i+1)+".png",
        position:new AMap.LngLat(lngX, latY) 
    };           
    var mar =new AMap.Marker(markerOption); 
    marker.push(new AMap.LngLat(lngX, latY));
 
    var infoWindow = new AMap.InfoWindow({
        content:"<h3><font color=\"#00a6ac\">  "+(i+1) + "."+ d.name +"</h3></font>"+contentfunc(d.type, d.address, d.tel),
        size:new AMap.Size(300, 0),
        autoMove:true,
        offset:new AMap.Pixel(0,-30)
    }); 
    windowsArr.push(infoWindow);  
    var aa = function(){infoWindow.open(mapObj, mar.getPosition());}; 
    AMap.event.addListener(mar, "click", aa); 
}





function ShopContents(type,address,tel){  //窗体内容
    if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") { 
        type = "暂无"; 
    } 
    if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") { 
        address = "暂无"; 
    } 
    if (tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") { 
        tel = "暂无"; 
    } 
    var str ="  地址：" + address + "<br />  电话：" + tel + " <br />  类型："+type; 
    return str; 
} 



function TipContents(type,address,tel){  //窗体内容
    if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") { 
        type = "暂无"; 
    } 
    if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") { 
        address = "暂无"; 
    } 
    if (tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") { 
        tel = "暂无"; 
    } 
    var str ="  地址：" + address + "<br />  电话：" + tel + " <br />  类型："+type; 
    return str; 
} 


function openMarkerTipById1(pointid,thiss){  //根据id打开搜索结果点tip 
    thiss.style.background='#CAE1FF'; 
    if(windowsArr !=undefined && windowsArr[pointid] != undefined)
        windowsArr[pointid].open(mapObj, marker[pointid]);     
} 
function onmouseout_MarkerStyle(pointid,thiss) { //鼠标移开后点样式恢复 
   thiss.style.background="";  
}



