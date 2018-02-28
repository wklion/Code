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
import com.spd.flashflood.model.CountyRain;
import com.spd.flashflood.model.GridDataBaseConfig;
import com.spd.util.DateUtil;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class CalCountyLiveForecastRain {

	public static void main(String[] args) {
		Boolean debug = false;
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 9);
			cal.set(Calendar.DAY_OF_MONTH, 30);
			cal.set(Calendar.HOUR_OF_DAY, 13);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		GridConfig gridConfig = new GridConfig();
		GridDataBaseConfig gridDataBaseConfig = gridConfig.get();
		ConfigC configC = new ConfigC();
		Config config = configC.get();
		CommonAlert commonAlert = new CommonAlert();
		//1、连接风格数据引擎
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				gridDataBaseConfig.getType(), gridDataBaseConfig.getAlias(), gridDataBaseConfig.getServer(), 
				gridDataBaseConfig.getUser(),gridDataBaseConfig.getPassword(), gridDataBaseConfig.getDatabase(), 
				gridDataBaseConfig.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);
		int count = m_datasource.GetDatasetCount();
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
		FileHelper fileHelper = new FileHelper();
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
		//7、计算区县面雨量
		List<CountyRain> lsCountyRain = commonAlert.calCountyRain(dsForcast,"T_ADMINDIV_COUNTY.shp",forcastHR);
		//8、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("8、连接数据库完成");
		//6、入库
		String fSql = "insert into t_county_rain(countyName,datetime,strategy,r3,r6,r24) values(?,?,2,?,?,?)";
		try {
			dpConn.setAutoCommit(false);
			PreparedStatement ps = dpConn.prepareStatement(fSql);
			for(CountyRain countyRain:lsCountyRain){
				ps.setString(1, countyRain.getName());
				ps.setString(2, strProductDatetime);
				ps.setDouble(3, countyRain.getR3());
				ps.setDouble(4, countyRain.getR6());
				ps.setDouble(5, countyRain.getR24());
				ps.addBatch();
			}
			ps.executeBatch();
			dpConn.commit();
			ps.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		
		try {
			dpConn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(strProductDatetime+",该时次产品制作成功!");
	}

}
