package com.spd.flashflood.app;

import java.sql.PreparedStatement;
import java.util.Calendar;
import java.util.List;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.Datasource;
import com.spd.config.GridConfig;
import com.spd.flashflood.app.child.CommonAlert;
import com.spd.flashflood.database.DataSourceSingleton;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.FlashFloodAlert;
import com.spd.flashflood.model.GridDataBaseConfig;
import com.spd.util.DateUtil;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:山洪预报预警
*/
public class FlashLFloodForecastAlert {
	private static int strategy = 3;//3为预报
	public static void main(String[] args) {
		Boolean debug = false;
		GridConfig gridConfig = new GridConfig();
		GridDataBaseConfig gridDataBaseConfig = gridConfig.get();
		CommonAlert commonAlert = new CommonAlert();
		//1、连接风格数据引擎
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				gridDataBaseConfig.getType(), gridDataBaseConfig.getAlias(), gridDataBaseConfig.getServer(), 
				gridDataBaseConfig.getUser(),gridDataBaseConfig.getPassword(), gridDataBaseConfig.getDatabase(), 
				gridDataBaseConfig.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);
		int count = m_datasource.GetDatasetCount();
		System.out.println(count);
		System.out.println("1、连接数据引擎完成");
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 6);
			cal.set(Calendar.DAY_OF_MONTH, 4);
			cal.set(Calendar.HOUR_OF_DAY, 10);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		System.out.println("产品时间:"+strProductDatetime);
		//2、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("2、连接数据库完成");
		//3、获取产品ID
		int productID = commonAlert.getMaxProductID(dpConn, strategy);
		//4、创建一个内存数据源
		strJson = "{\"Type\":\"Memory\",\"Alias\":\"SHForecast\",\"Server\":\"\"}";
		Datasource dsTemp = Application.m_workspace.CreateDatasource(strJson);
		System.out.println("4、创建一个内存数据源完成");
		//5、获取预报
		String fTableName = "t_prvn_r3_%s%s00_p_%s%s_%s_1000";
		int curHour = cal.get(Calendar.HOUR_OF_DAY);
		Calendar calProduct = (Calendar) cal.clone();
		String strMakeTime = "";
		String strForcastTime = "";
		int startHourspan = 3;
		if(curHour>8&&curHour<20){//用早上的预报
			strMakeTime = "05";
			strForcastTime = "08";
			startHourspan = ((curHour-8)/3+1)*3;
			calProduct.set(Calendar.HOUR_OF_DAY, 8);
			calProduct.add(Calendar.HOUR, ((curHour-8)/3)*3);
		}
		else{//下午的预报
			strMakeTime = "16";
			strForcastTime = "20";
			if(curHour<8){//前一天的预报
				cal.add(Calendar.DATE, -1);
				startHourspan = ((curHour+24-20)/3+1)*3;
				calProduct.add(Calendar.DATE, -1);
			}
			else{
				startHourspan = ((curHour-20)/3+1)*3;
			}
			calProduct.set(Calendar.HOUR_OF_DAY, 20);
			calProduct.add(Calendar.HOUR, ((curHour-20)/3)*3);
		}
		String yyMMdd = DateUtil.format("yyMMdd", cal);
		fTableName = String.format(fTableName, yyMMdd,strMakeTime,yyMMdd,strForcastTime,"%s");
		int[] forcastHR = {3,6,24};
		commonAlert.calForcast(forcastHR,startHourspan,m_datasource,dsTemp,fTableName);
		System.out.println("5、获取预报完成");
		//4、获取山洪基础数据(中小河,山洪沟，隐患点)
		List<FlashFloodAlert> lsResult = null;
		lsResult = commonAlert.calDisasterPoint(dsTemp, forcastHR, "disasterPoint.shp", "地质灾害隐患点", productID, strProductDatetime, strategy);//地质灾害隐患点
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsTemp, forcastHR, "riveRegion.shp", "中小河流", productID, strProductDatetime,strategy);//中小河流
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsTemp, forcastHR, "SHGRegion.shp", "山洪沟", productID, strProductDatetime,strategy);//山洪沟
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		try {
			dpConn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(strProductDatetime+"预报预警生成完成!");
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:插入数据库
	 */
	private static void insertProduct(DruidPooledConnection conn,List<FlashFloodAlert> lsFlashFloodAlert){
		String fSql = "insert into t_flashflood_alert(productID,type,geoID,level,hourspan,datetime,strategy,rain) values(?,?,?,?,?,?,?,?)";
		try {
			conn.setAutoCommit(false);
			PreparedStatement ps = conn.prepareStatement(fSql);
			for(FlashFloodAlert flashFloodAlert:lsFlashFloodAlert){
				ps.setInt(1, flashFloodAlert.getProductID());
				ps.setString(2, flashFloodAlert.getType());
				ps.setString(3, flashFloodAlert.getGeoID());
				ps.setInt(4, flashFloodAlert.getLevel());
				ps.setInt(5, flashFloodAlert.getHourspan());
				ps.setString(6, flashFloodAlert.getDatetime());
				ps.setInt(7, flashFloodAlert.getStrategy());
				ps.setDouble(8, flashFloodAlert.getRain());
				ps.addBatch();
			}
			ps.executeBatch();
			conn.commit();
			ps.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
