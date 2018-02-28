package com.spd.flashflood.app;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.sql.PreparedStatement;
import java.util.Calendar;
import java.util.List;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.DatasetRaster;
import com.weathermap.objects.Datasource;
import com.weathermap.objects.Workspace;
import com.spd.config.ConfigC;
import com.spd.config.GridConfig;
import com.spd.flashflood.app.child.CommonAlert;
import com.spd.flashflood.database.DataSourceSingleton;
import com.spd.flashflood.file.FileHelper;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.Config;
import com.spd.flashflood.model.FlashFloodAlert;
import com.spd.flashflood.model.GridDataBaseConfig;
import com.spd.util.DateUtil;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class FlashLFloodLiveForecastAlert {
	private static int strategy = 2;//2为实况+预报
	public static void main(String[] args) {
		Boolean debug = true;
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 9);
			cal.set(Calendar.DAY_OF_MONTH, 30);
			cal.set(Calendar.HOUR_OF_DAY, 13);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		ConfigC configC = new ConfigC();
		Config config = configC.get();
		GridConfig gridConfig = new GridConfig();
		GridDataBaseConfig gridDataBaseConfig = gridConfig.get();
		CommonAlert commonAlert = new CommonAlert();
		FileHelper fileHelper = new FileHelper();
		//1、连接风格数据引擎
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				gridDataBaseConfig.getType(), gridDataBaseConfig.getAlias(), gridDataBaseConfig.getServer(), 
				gridDataBaseConfig.getUser(),gridDataBaseConfig.getPassword(), gridDataBaseConfig.getDatabase(), 
				gridDataBaseConfig.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);
		int count = m_datasource.GetDatasetCount();
		System.out.println(count);
		System.out.println("1、连接数据引擎完成");
		//2、计算用什么时间的预报
		int curHour = cal.get(Calendar.HOUR_OF_DAY);
		Calendar calForcast = (Calendar) cal.clone();
		Calendar calLive = (Calendar) cal.clone();
		String strMakeTime = "";
		String strForcastTime = "";
		int startHourspan = 3;
		int liveHour = 1;//实况用时
		if(curHour>8&&curHour<20){//用早上的预报
			strMakeTime = "05";
			strForcastTime = "08";
			startHourspan = ((curHour-8)/3+1)*3;
			calForcast.set(Calendar.HOUR_OF_DAY, 8);
			calForcast.add(Calendar.HOUR, ((curHour-8)/3)*3);
			liveHour = (curHour-8)%3;
		}
		else{//下午的预报
			strMakeTime = "16";
			strForcastTime = "20";
			if(curHour<8){//前一天的预报
				cal.add(Calendar.DATE, -1);
				startHourspan = ((curHour+24-20)/3+1)*3;
				calForcast.add(Calendar.DATE, -1);
				liveHour = (curHour+24-20)%3;
				
			}
			else{
				startHourspan = ((curHour-20)/3+1)*3;
				liveHour = (curHour-20)%3;
			}
			calForcast.set(Calendar.HOUR_OF_DAY, 20);
			calForcast.add(Calendar.HOUR, ((curHour-20)/3)*3);
		}
		//3、创建临时数据集，存放实况
		Workspace ws = Application.m_workspace;
		String strJSON = "{\"Type\":\"Memory\",\"Alias\":\"LiveAndForecastOfLive\",\"Server\":\"\"}";
		Datasource dsLive = ws.CreateDatasource(strJSON);
		Rectangle2D r2d = new Rectangle2D.Double(91.975,31.975,109.025-91.975,43.025-31.975);
		int w= 341;
		int h= 221;
		strJSON = String.format("{\"Name\":\"d%d\",\"ValueType\":\"Single\",\"Width\":%d,\"Height\":%d}", 3,w, h);
		DatasetRaster dr = dsLive.CreateDatasetRaster(strJSON);
		dr.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
		dr.SetBounds(r2d);
		dr.Open();
		
		strJSON = "{\"Type\":\"Memory\",\"Alias\":\"LiveAndForecastOfForcast\",\"Server\":\"\"}";
		Datasource dsForcast = ws.CreateDatasource(strJSON);
		//4、计算实况
		for(int i=1;i<=liveHour;i++){
			File findFile = fileHelper.getFileByDateTime(calLive,config.getLiveGridDic());
			if(findFile==null){//没找到文件
				continue;
			}
			calLive.add(Calendar.HOUR, -1);
			commonAlert.getGridFromGrid2(ws,findFile,dr,i);
		}
		System.out.println("4、计算实况完成");
		//5、计算预报
		String fTableName = "t_prvn_r3_%s%s00_p_%s%s_%s_1000";
		String yyMMdd = DateUtil.format("yyMMdd", calForcast);
		fTableName = String.format(fTableName, yyMMdd,strMakeTime,yyMMdd,strForcastTime,"%s");
		int[] forcastHR = {3,6,24};
		commonAlert.calForcast(forcastHR,startHourspan,m_datasource,dsForcast,fTableName);
		System.out.println("5、获取预报完成");
		//6、融合实况到预报中
		if(liveHour>0){//有实况才整合
			commonAlert.RHGrid(dsForcast,dsLive);
		}
		//7、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("7、连接数据库完成");
		//8、获取产品ID
		int productID = commonAlert.getMaxProductID(dpConn, strategy);
		//9、获取山洪基础数据(中小河,山洪沟，隐患点)
		List<FlashFloodAlert> lsResult = null;
		lsResult = commonAlert.calDisasterPoint(dsForcast, forcastHR, "disasterPoint.shp", "地质灾害隐患点", productID, strProductDatetime, strategy);
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsForcast, forcastHR, "riveRegion.shp", "中小河流", productID, strProductDatetime,strategy);//中小河
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsForcast, forcastHR, "SHGRegion.shp", "中山洪沟河流", productID, strProductDatetime,strategy);//山洪沟
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		try {
			dpConn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("实况+预报计算完成");
		ws.CloseDatasource("LiveAndForecastOfLive");
		ws.CloseDatasource("LiveAndForecastOfForcast");
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
