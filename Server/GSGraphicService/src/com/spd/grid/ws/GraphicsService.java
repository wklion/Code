package com.spd.grid.ws;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.Legend;
import com.spd.grid.graphics.WMGraphics;
import com.spd.grid.pojo.CommonConfig;

@Stateless
@Path("GraphicsService")
public class GraphicsService {	
	static CommonConfig commonfig;
	static{
		commonfig = (CommonConfig)ApplicationContextFactory.getInstance().getBean("commonConifg");	
		//加载MySql的驱动类
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// 站点详情历史查询
	@POST
	@Path("getStationDetailByTimes")
	@Produces("application/json")
	public Object getStationDetailByTimes(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		try {			
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			String curtable = "HIS_HOUR_"+ObservTimesStart.substring(0, 6);
			String type = jsonObject.getString("type");
			String areaCode = jsonObject.getString("areaCode");
			boolean bShowValue = jsonObject.getBoolean("bShowValue");
			boolean bRemoveZero = jsonObject.getBoolean("bRemoveZero"); //作废，被阈值代替
			Double dthreshold = jsonObject.getDouble("threshold");		//填值阈值，大于该阈值的站点值将被显示
			String strElement = jsonObject.getString("element");
			String strTableField = jsonObject.getString("tableField");
			String strLegend = jsonObject.getString("legend");
			String strUnit = jsonObject.getString("unit");
			Gson gson = new Gson();
			JsonParser jsonParser = new JsonParser();
			JsonArray jsonArray = jsonParser.parse(strLegend).getAsJsonArray();
			List<Legend> lsLegend = new ArrayList<Legend>();
			for(JsonElement je:jsonArray){
				Legend legend = gson.fromJson(je, Legend.class);
				lsLegend.add(legend);
			}
			
			System.out.println(String.format("outputImage：%s-%s %s", ObservTimesStart, ObservTimesEnd, areaCode));
			
			String areaName = getAreaName(areaCode);
			String departName = getDepartName(areaCode);
			List resultList = queryStationData(curtable, ObservTimesStart, ObservTimesEnd, type,strTableField);
			 
			 SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHH");
			 java.util.Date dtStart=sdf.parse(ObservTimesStart);
			 java.util.Date dtEnd=sdf.parse(ObservTimesEnd);
			 WMGraphics g = new WMGraphics();
			 g.run(resultList, "val", areaCode, areaName, departName, dtStart, dtEnd, bShowValue, dthreshold, commonfig.getOutputPath(),strElement,lsLegend,strUnit);
			 
			 int count = resultList.size();
			 for(int i=count-1; i>=0; i--){
				 if(!(((HashMap)(resultList.get(i))).get("areaCode").toString().startsWith(areaCode)))
					 resultList.remove(i);
			 }
			 
			 return resultList;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// 通过客户端上传的站点数据出图
	@POST
	@Path("outputImageByJson")
	@Produces("application/json")
	public Object outputImageByJson(@FormParam("para") String para) {
		JSONObject jsonObject = null;
		Boolean result = true;
		try {			
			jsonObject = new JSONObject(para);
			String ObservTimesStart = jsonObject.getString("ObservTimesStart");
			String ObservTimesEnd = jsonObject.getString("ObservTimesEnd");
			String curtable = "HIS_HOUR_"+ObservTimesStart.substring(0, 6);
			String type = jsonObject.getString("type");
			String areaCode = jsonObject.getString("areaCode");
			boolean bShowValue = jsonObject.getBoolean("bShowValue");
			boolean bRemoveZero = jsonObject.getBoolean("bRemoveZero"); //作废，被阈值代替
			Double dthreshold = jsonObject.getDouble("threshold");		//填值阈值，大于该阈值的站点值将被显示
			String strElement = jsonObject.getString("element");
			String strTableField = jsonObject.getString("tableField");
			JSONArray jsonArrayPoint = jsonObject.getJSONArray("points");
			String strLegend = jsonObject.getString("legend");
			String strUnit = jsonObject.getString("unit");
			Gson gson = new Gson();
			JsonParser jsonParser = new JsonParser();
			JsonArray jsonArray = jsonParser.parse(strLegend).getAsJsonArray();
			List<Legend> lsLegend = new ArrayList<Legend>();
			for(JsonElement je:jsonArray){
				Legend legend = gson.fromJson(je, Legend.class);
				lsLegend.add(legend);
			}
			System.out.println(String.format("outputImageByJson：%s-%s %s", ObservTimesStart, ObservTimesEnd, areaCode));
			
			String areaName = getAreaName(areaCode);
			String departName = getDepartName(areaCode);
			List resultList = queryStationData(curtable, ObservTimesStart, ObservTimesEnd, type,strTableField);
			//if(areaCode.length() > 2)
			{
				List resultList2 = json2StationData(jsonArrayPoint, type,strTableField);
				mergeList(resultList, resultList2, strTableField, areaCode);//Precipitation
			}
			 
			 SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHH"); 
			 java.util.Date dtStart=sdf.parse(ObservTimesStart);
			 java.util.Date dtEnd=sdf.parse(ObservTimesEnd);			 
			 WMGraphics g = new WMGraphics();
			 g.run(resultList, "val", areaCode, areaName, departName, dtStart, dtEnd, bShowValue, dthreshold, commonfig.getOutputPath(),strElement,lsLegend,strUnit);
		} catch (Exception e) {
			e.printStackTrace();
			result = false;
		}
		return result;
	}
	
//	//查询站点数据，这个查询效率太低了
//	private List queryStationData(String curtable, String ObservTimesStart, String ObservTimesEnd, String type){
//		Long startTime = System.currentTimeMillis();
////		String sql = "select HH.StationNum,HH.Precipitation,D.* "+
////		"from (select StationNum, sum(Precipitation) as Precipitation "+"from "+curtable+" where ObservTimes >= '"+ObservTimesStart+"' and ObservTimes <= '"+ObservTimesEnd+"' and StationNum like '"+type+"' group by StationNum) as HH "+
////		 "left join D_Station as D on HH.StationNum = D.StaID where D.TownMapCode like '"+ areaCode +"%' order by HH.Precipitation desc";
//		String sql = "select HH.StationNum,HH.Precipitation,D.* "+
//		"from (select StationNum, sum(Precipitation) as Precipitation "+"from "+curtable+" where ObservTimes >= '"+ObservTimesStart+"' and ObservTimes <= '"+ObservTimesEnd+"' and StationNum like '"+type+"' group by StationNum) as HH "+
//		 "left join (select D_Station.*,D_Area.AreaName from D_Station left join D_Area on D_Station.TownMapCode = D_Area.AreaCode) as D on HH.StationNum = D.StaID order by HH.Precipitation desc"; 
//		 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
//		 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
//		 List resultList = jdbcTemplate.query(sql, new RowMapper() {
//			@Override
//			public Object mapRow(ResultSet rs, int index)throws SQLException {
//				Map u = new HashMap();
//				u.put("StationNum", rs.getString("StationNum"));
//				u.put("StationName", rs.getString("StaName"));
//				u.put("area", rs.getString("AreaName"));
//				u.put("areaCode", rs.getString("TownMapCode"));
//				u.put("Precipitation", rs.getDouble("Precipitation"));
//				u.put("Lon", rs.getDouble("Lon"));
//				u.put("Lat", rs.getDouble("Lat"));
//			    return u;
//			}
//		 });
//		 Long endTime = System.currentTimeMillis();
//		 System.out.println(endTime-startTime);
//		 return resultList;
//	}
	
	//查询站点数据
	private List queryStationData(String curtable, String ObservTimesStart, String ObservTimesEnd, String type,String strTableField){
		Long startTime = System.currentTimeMillis();
		//先查站点信息
		String sql = "select D_Station.*,D_Area.AreaName from D_Station left join D_Area on D_Station.TownMapCode = D_Area.AreaCode"; 
		 ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
		 JdbcTemplate jdbcTemplate = (JdbcTemplate) applicationContext.getBean("jdbcTemplate");
		 List stationList = jdbcTemplate.query(sql, new RowMapper() {
			@Override
			public Object mapRow(ResultSet rs, int index)throws SQLException {
				Map u = new HashMap();
				u.put("StationNum", rs.getString("StaID"));
				u.put("StaName", rs.getString("StaName"));
				u.put("AreaName", rs.getString("AreaName"));
				u.put("TownMapCode", rs.getString("TownMapCode"));
				u.put("Lon", rs.getDouble("Lon"));
				u.put("Lat", rs.getDouble("Lat"));
			    return u;
			}
		 });
		 
		//再查观测要素
		sql = "select HH.StationNum,HH.?  as val"+
		" from (select StationNum, stamethod(?) as ? from "+curtable+" where ObservTimes >= '"+ObservTimesStart+"' and ObservTimes <= '"+ObservTimesEnd+"' and StationNum like '"+type+"' group by StationNum) as HH "+
		 "order by HH.? desc";
		sql = sql.replaceAll("\\?", strTableField);
		String strStaMethod = "avg";
		if(strTableField.equals("Precipitation")){
			strStaMethod = "sum";
		}
		sql = sql.replace("stamethod", strStaMethod);
		 List dataList = jdbcTemplate.query(sql, new RowMapper() {
			@Override
			public Object mapRow(ResultSet rs, int index)throws SQLException {
				Map u = new HashMap();
				u.put("StationNum", rs.getString("StationNum"));
				double val = rs.getDouble("val");
				val = (int)(val*10)/10;
				u.put("val", val);
			    return u;
			}
		 });
		 
		 //合并
		 List resultList = new ArrayList();
		 for(int i=0; i<dataList.size(); i++){
			 Map data = (HashMap)dataList.get(i);
			 String stationNum = data.get("StationNum").toString();
			 for(int j=0; j<stationList.size(); j++){
				 Map station = (HashMap)stationList.get(j);
				 if(stationNum.equals(station.get("StationNum").toString())){
					 Map u = new HashMap();
					 u.put("StationNum", stationNum);
					 u.put("StationName", station.get("StaName"));
					 u.put("area", station.get("AreaName"));
					 u.put("areaCode", station.get("TownMapCode"));
					 u.put("val", data.get("val"));
					 u.put("Lon", station.get("Lon"));
					 u.put("Lat", station.get("Lat"));
					 resultList.add(u);
					 break;
				 }
			 } 
		 }
		 
		 Long endTime = System.currentTimeMillis();
		 System.out.println(String.format("queryStationData：use %dms, count %d", endTime-startTime, resultList.size()));
		 return resultList;
	}
	
	//json转站点数据
	private List json2StationData(JSONArray jsonArrayPoint, String type,String tableField) throws JSONException{
		Boolean bNation = type.equals("5%");
		Long startTime = System.currentTimeMillis();
		List resultList = new ArrayList();
		Integer nSize = jsonArrayPoint.length();
		for (int i = 0; i < nSize; i++) {  
			JSONObject jsonObjectPoint = jsonArrayPoint.getJSONObject(i);
			Map station = new HashMap<String, Object>();
			String stationNum = jsonObjectPoint.getString("StationNum");
			if(bNation && !stationNum.startsWith("5"))
				continue;
			station.put("StationNum", stationNum);
			station.put("areaCode", jsonObjectPoint.getString("areaCode"));
			station.put(tableField, jsonObjectPoint.getDouble("val"));
			station.put("Lon", jsonObjectPoint.getDouble("Lon"));
			station.put("Lat", jsonObjectPoint.getDouble("Lat"));
			resultList.add(station);
		}			
		 Long endTime = System.currentTimeMillis();
		 System.out.println(endTime-startTime);
		 return resultList;
	}
	
	// 合并列表
	private void mergeList(List list1, List list2, String element, String areaCode){
		for(int i=list1.size()-1; i>=0 ; i--){
			HashMap item1 = (HashMap)list1.get(i);
			String code = item1.get("areaCode").toString();
			if(code.startsWith(areaCode)){
				String stationNum = item1.get("StationNum").toString();
				HashMap item2 = null;
				for(int j=0; j<list2.size(); j++){
					HashMap item = (HashMap)list2.get(j);
					if(stationNum.equals((item.get("StationNum").toString()))){
						item2 = item;
						break;
					}
				}
				if(item2 == null){
					list1.remove(i); //未找到，则删除
				}
				else{
					item1.put(element, item2.get(element)); //找到，替换值
				}
			}
		}
	}
	
	//获取区域名称
	private String getAreaName(String areaCode) throws SQLException{
		String areaName = "";
		Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", commonfig.getIP(), commonfig.getPort(), commonfig.getDB()), commonfig.getUser(), commonfig.getPassWord());
		Statement stmt = conn.createStatement(); 
		String sql = String.format("select * from t_area where areaCode='%s'", areaCode);
		ResultSet resultSet = stmt.executeQuery(sql);
		while(resultSet.next()) {
			areaName = resultSet.getString("areaName");
			break;
		}
		stmt.close();
		conn.close();
		return areaName;
	}
	
	//获取部门名称
	private String getDepartName(String departCode) throws SQLException{
		String departName = "";
		Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", commonfig.getIP(), commonfig.getPort(), commonfig.getDB()), commonfig.getUser(), commonfig.getPassWord());
		Statement  stmt = conn.createStatement(); 
		String sql = String.format("select * from t_depart where departCode='%s'", departCode);
		ResultSet resultSet = stmt.executeQuery(sql);
		while(resultSet.next()) {
			departName = resultSet.getString("departName");
			break;
		}
		stmt.close();
		conn.close();
		return departName;
	}
}
