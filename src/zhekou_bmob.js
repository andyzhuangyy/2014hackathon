
//Bmob.initialize("f68361468fc3da0e4cad11abe332f52b", "24bea47249265caff6d88889ff0aaf01");
function PubDaZhe(_usr, _brand, _discount, _desc, _lat, _longi, _geo_id) {
	var dat = new Date();
	var time = dat.toLocaleDateString();
	var geo_point = new Bmob.GeoPoint(_lat, _longi);
	//var geo_id = _geo_id;//"B000A83U0P";
	var ZheKouInfo = Bmob.Object.extend("ZheKouInfo");
	var zhe_kou_info = new ZheKouInfo();
	zhe_kou_info.save({
		usr:_usr,
		geo_point:geo_point,
		geo_id:_geo_id,
		brand:_brand,
		agree:"0",
		start_dat:time,
		end_dat:"reserve",
		discount:_discount,
		desc:_desc
			},{
				success: function(zhe_kou_info) {
					//alert("Pub Ok.");
					},
				err: function(zhe_kou_info, error) {
				alert("Pub Error.");
				}
			})
}

function QueryDaZheByBrand(_brand, func) {
	var dat = new Date();
	var time = dat.toLocaleDateString();
	var ZheKouInfo = Bmob.Object.extend("ZheKouInfo");
	var query = new Bmob.Query(ZheKouInfo);

	query.equalTo("start_dat", time);
	query.equalTo("brand", _brand);

	query.find({
				success: function(results){
					//alert("Query " + results.length + "条记录.");
					/*
					for(var i = 0; i < results.length; i++) {
						var obj = results[i];
						alert(obj.id + "-" + obj.get('brand'));
					}
					*/
					func(results);
				},
				error: function(error){
					alert("Query Error.");
					return null;
				}
			}
			);
	return null;
}

function QueryDaZheByGeo(_geo_point, func) {
	var dat = new Date();
	var time = dat.toLocaleDateString();
	var ZheKouInfo = Bmob.Object.extend("ZheKouInfo");
	var query = new Bmob.Query(ZheKouInfo);

	var geo_southwest = new Bmob.GeoPoint(_geo_point.latitude - 0.1, _geo_point.longitude - 0.1);
	var geo_northeast = new Bmob.GeoPoint(_geo_point.latitude + 0.1, _geo_point.longitude + 0.1);

	query.equalTo("start_dat", time);
	//query.withinRadians("geo_point", _geo_point, 0.01);
	query.withinGeoBox("geo_point", geo_southwest, geo_northeast);
	//query.equalTo("geo_point", _geo_point);

	query.find({
				success: function(results){
					//alert("Query " + results.length + "条记录.");
					/*
					for(var i = 0; i < results.length; i++) {
						var obj = results[i];
						alert(obj.id + "-" + obj.get('brand'));
					}
					*/
					func(results);
				},
				error: function(error){
					alert("Query Error.");
					return null;
				}
			}
			);
	return null;
}


