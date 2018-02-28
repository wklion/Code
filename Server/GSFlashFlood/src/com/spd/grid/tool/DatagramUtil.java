package com.spd.grid.tool;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.mg.objects.DatasetVector;
import com.mg.objects.Recordset;
import com.spd.grid.domain.DatagramData;
import com.spd.grid.jdbc.DataSourceSingleton;

public class DatagramUtil {
	public Boolean makeDatagram(Calendar cal,int hourspan,String type,List<DatagramData> lsDatagramData,DatasetVector dvShp,int strategy,String dic,String fileName){
		String strYYYYMMddHHmmss = DateUtil.format("yyyyMMddHHmmss", cal);
		String strNormal = DateUtil.format("yyyy-MM-dd HH:mm:ss", cal);
		Calendar calNow = Calendar.getInstance();
		String strDateNow = DateUtil.format("yyyy-MM-dd HH:mm:ss", calNow);
		StringBuilder sb = new StringBuilder();
		String line = "Diamond 35 "+strYYYYMMddHHmmss+"_"+hourspan+"h"+type+"风险预报产品";
		sb.append(line);//第一行
		sb.append("\r\n");
		line = "TAB "+strDateNow+" 5715 9999";
		sb.append(line);//第二行
		sb.append("\r\n");
		//查询该类型对应雨量
		String sql = "select * from t_flashflood_rain where productID=(select productID from t_flashflood_alert where datetime='%s' and strategy=%d limit 0,1)";
		sql = String.format(sql, strNormal,strategy);
		//连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		Map<String,Double> mapRain = new HashMap();
		try {
			PreparedStatement ps = dpConn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				String geoID = rs.getString("geoID");
				double val = rs.getDouble("r"+hourspan);
				mapRain.put(geoID, val);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			dpConn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		line = "区域名 区域类型 区域编号 %dh面雨量 %dh临界雨量 %dh风险等级 综合风险等级";
		line = String.format(line, hourspan,hourspan,hourspan);
		sb.append(line);//第二行
		sb.append("\r\n");
		String queryFormat = "{\"Where\":\"[ID]='%s'\"}";
		for(DatagramData datagramData:lsDatagramData){
			sb.append("POINT 1");
			sb.append("\r\n");
			String geoID = datagramData.getGeoID();//区域编号
			String strJson = String.format(queryFormat, geoID);
			Recordset rsTemp = dvShp.Query(strJson, null);
			rsTemp.MoveFirst();
			//获取中心点
			double lon = rsTemp.GetGeometry().GetBounds().getCenterX();
			double lat = rsTemp.GetGeometry().GetBounds().getCenterY();
			line = lon+" "+lat+" "+0;
			sb.append(line);//第二行
			sb.append("\r\n");
			String areaName = rsTemp.GetFieldValue("Name").toString();//区域名
			String areaType = rsTemp.GetFieldValue("Type").toString();//区域类型
			double rain = 0.0;
			if(mapRain.get(geoID)!=null){
				rain = mapRain.get(geoID);
			}
			int level = datagramData.getLevel();
			String field = "L"+level+"_H"+hourspan;
			double maxRain = Double.parseDouble(rsTemp.GetFieldValue(field).toString());//临界雨量
			line = areaName+" "+areaType+" "+geoID+" "+rain+" "+maxRain+" "+level+" "+level;
			sb.append(line);//第二行
			sb.append("\r\n");
		}
		FileHelper fileHelper = new FileHelper();
		fileHelper.saveStringToFile(sb.toString(), dic, fileName);
		return true;
	}
	public void threeHourProduct(StringBuilder sb,List<DatagramData> lsDatagramData,DatasetVector dvShp,Map<String,double[]> mapRain,int hourspan){
		String line = "区域名 区域类型 区域编号 3h面雨量 3h临界雨量 3h风险等级 综合风险等级";
		
		String queryFormat = "{\"Where\":\"[ID]='%s'\"}";
		for(DatagramData datagramData:lsDatagramData){
			sb.append("POINT 1");
			sb.append("\r\n");
			String geoID = datagramData.getGeoID();//区域编号
			String strJson = String.format(queryFormat, geoID);
			Recordset rsTemp = dvShp.Query(strJson, null);
			//获取中心点
			double lon = rsTemp.GetGeometry().GetBounds().getCenterX();
			double lat = rsTemp.GetGeometry().GetBounds().getCenterY();
			line = lon+" "+lat+" "+0;
			sb.append(line);//第二行
			sb.append("\r\n");
			rsTemp.MoveFirst();
			String areaName = rsTemp.GetFieldValue("Name").toString();//区域名
			String type = rsTemp.GetFieldValue("Type").toString();//区域类型
			double oneHourRain = 0.0;//1h面雨量
			double oneHourMax = 30.0;//1h临界雨量
			double oneHourLevel = 9999;//1h风险等级
			double threeHourRain = mapRain.get(geoID)[0];//3h面雨量
			int level = datagramData.getLevel();//3h风险等级
			String field = "L"+level+"_H3";
			double threeHourMax = Double.parseDouble(rsTemp.GetFieldValue(field).toString());//3h临界雨量
			line = areaName+" "+type+" "+geoID+" "+oneHourRain+" "+oneHourMax+" "+oneHourLevel+" "+threeHourRain+" "+threeHourMax+" "+level+" "+level;
			sb.append(line);//第二行
			sb.append("\r\n");
		}
	}
}
