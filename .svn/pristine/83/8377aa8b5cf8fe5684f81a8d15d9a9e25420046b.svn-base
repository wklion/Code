package com.spd.grid.ws;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.slf4j.Logger;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.google.gson.Gson;
import com.mg.objects.DatasetVector;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.CommonResult;
import com.spd.grid.domain.DatagramData;
import com.spd.grid.domain.FlashFloodThreshold;
import com.spd.grid.domain.GetCountyRainParam;
import com.spd.grid.domain.GetCountyRainResult;
import com.spd.grid.domain.GetProductTimeParam;
import com.spd.grid.domain.GetRainInfoParam;
import com.spd.grid.domain.GetThresholdByIdsAndTypeParam;
import com.spd.grid.domain.MakeDatagramParam;
import com.spd.grid.domain.UpdateIssueParam;
import com.spd.grid.domain.UpdateThresholdByIdsAndColParam;
import com.spd.grid.jdbc.DataSourceSingleton;
import com.spd.grid.tool.DBUtil;
import com.spd.grid.tool.DatagramUtil;
import com.spd.grid.tool.DatasetUtil;
import com.spd.grid.tool.DateUtil;
import com.spd.grid.tool.FileUtil;
import com.spd.weathermap.util.LogTool;

/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-11-1
 * @最后修改: 2017-11-1
 * @功能: 山洪服务
 **/
@Stateless
@Path("FlashFloodService")
public class FlashFloodService {
	private  Logger log = LogTool.getLogger(this.getClass());
	private String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	@POST
	@Path("getRainInfo")
	@Produces("application/json")
	public Object getRainInfo(@FormParam("para") String para ) throws Exception{
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		GetRainInfoParam param = gson.fromJson(para, GetRainInfoParam.class);
		int strategy = param.getStrategy();
		String sql = "select r3,r6,r24 from t_flashflood_rain where geoID='%s' and strategy=%d and productID=%d";
		sql = String.format(sql, param.getGeoID(),strategy,param.getProductID());
		//1、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		PreparedStatement ps;
		double[] vals = null;
		try {
			ps = dpConn.prepareStatement(sql);
			ResultSet rsDB = ps.executeQuery();
			if(rsDB.first()){
				vals = new double[3];
				vals[0] = rsDB.getDouble(1);
				vals[1] = rsDB.getDouble(2);
				vals[2] = rsDB.getDouble(3);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		if(vals!=null){
			commonResult.setSuc(vals);
		}
		dpConn.close();
		return commonResult;
	}
	@POST
	@Path("getIssue")
	@Produces("application/json")
	public Object getIssue(@FormParam("para") String para ) throws Exception{
		CommonResult commonResult = new CommonResult();
		String sql = "select max(issue) from t_flashflood_product";
		//1、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		PreparedStatement ps;
		int issue = 1;
		try {
			ps = dpConn.prepareStatement(sql);
			ResultSet rsDB = ps.executeQuery();
			if(rsDB.first()){
				issue = rsDB.getInt(1);
			}
			issue++;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		commonResult.setSuc(issue);
		dpConn.close();
		return commonResult;
	}
	@POST
	@Path("updateIssue")
	@Produces("application/json")
	public Object updateIssue(@FormParam("para") String para ) throws Exception{
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		UpdateIssueParam updateIssueParam = gson.fromJson(para, UpdateIssueParam.class);
		
		String sql = "update t_flashflood_product set issue = %d";
		sql = String.format(sql, updateIssueParam.getIssue());
		//1、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		PreparedStatement ps;
		try {
			ps = dpConn.prepareStatement(sql);
			ps.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		commonResult.setSuc(true);
		dpConn.close();
		return commonResult;
	}
	@POST
	@Path("getCountyRain")
	@Produces("application/json")
	public Object getCountyRain(@FormParam("para") String para ) throws Exception{
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		GetCountyRainParam getCountyRainParam = gson.fromJson(para, GetCountyRainParam.class);
		
		int strategy = getCountyRainParam.getStrategy();
		int hourSpan = getCountyRainParam.getHourSpan();
		String strDateTime = getCountyRainParam.getDatetime();
		
		String fSql = "select countyName,r%d from t_county_rain where strategy=%d and datetime='%s' order by r%d desc limit 0,10";
		String sql = String.format(fSql, hourSpan,strategy,strDateTime,hourSpan);
		//1、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		List<GetCountyRainResult> lsGetCountyRainResult = new ArrayList();
		GetCountyRainResult getCountyRainResult = null;
		PreparedStatement ps;
		try {
			ps = dpConn.prepareStatement(sql);
			ResultSet rsDB = ps.executeQuery();
			while(rsDB.next()){
				getCountyRainResult = new GetCountyRainResult();
				String countyName = rsDB.getString(1);
				double val = rsDB.getDouble(2);
				getCountyRainResult.setCountyName(countyName);
				getCountyRainResult.setValue(val);
				lsGetCountyRainResult.add(getCountyRainResult);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		commonResult.setSuc(lsGetCountyRainResult);
		dpConn.close();
		return commonResult;
	}
	@POST
	@Path("makeDatagram")
	@Produces("application/json")
	public Object makeDatagram(@FormParam("para") String para ){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		MakeDatagramParam makeDatagramParam = gson.fromJson(para, MakeDatagramParam.class);
		String type = makeDatagramParam.getType();
		List<DatagramData> lsDatagramData = makeDatagramParam.getLsDatagramData();
		FileUtil fileUtil = new FileUtil();
		DatasetUtil dsUtil = new DatasetUtil();
		String shpFileName = "";
		if(type.equals("中小河流")){
			shpFileName = "riverRegion.shp";
		}
		else if(type.equals("山洪沟")){
			shpFileName = "SHGRegion.shp";
		}
		else if(type.equals("地质灾害隐患点")){
			shpFileName = "disasterPoint.shp";
		}
		if(shpFileName.equals("")){
			log.error("传入的类型不能识别,请传入(中小河流、山洪沟、地质灾害隐患点)");
			return commonResult;
		}
		DatasetVector dvShp = fileUtil.openShp(shpFileName);
		if(dvShp==null){
			System.out.println(shpFileName+"--失量数据打开失败!");
			return commonResult;
		}
		DatagramUtil datagramUtil = new DatagramUtil();
		String strDateTime = makeDatagramParam.getDatetime();
		Calendar cal = DateUtil.parse("yyyy-MM-dd HH:mm:ss", strDateTime);
		int hourspan = makeDatagramParam.getHourspan();
		int strategy = makeDatagramParam.getStrategy();
		String dic = makeDatagramParam.getDic();
		String fileName = makeDatagramParam.getFileName();
		Boolean b = datagramUtil.makeDatagram(cal, hourspan, type, lsDatagramData, dvShp, strategy, dic, fileName);
		commonResult.setSuc(b);
		Application.m_workspace.CloseDatasource(shpFileName);//关闭数据源
		return commonResult;
	}
	@POST
	@Path("getProductTime")
	@Produces("application/json")
	public Object getProductTime(@FormParam("para") String para ){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		GetProductTimeParam getProductTimeParam = gson.fromJson(para, GetProductTimeParam.class);
		String strDateTime = getProductTimeParam.getDatetime();
		int strategy = getProductTimeParam.getStrategy();
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		String fSql = "select max(datetime) from t_flashflood_alert where strategy=%d and datetime<='%s'";
		String sql = String.format(fSql, strategy,strDateTime);
		PreparedStatement ps;
		try {
			ps = dpConn.prepareStatement(sql);
			ResultSet rsDB = ps.executeQuery();
			if(rsDB.first()){
				String newDateTime = rsDB.getString(1);
				commonResult.setSuc(newDateTime);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			dpConn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return commonResult;
	}
	@POST
	@Path("getThresholdByIdsAndType")
	@Produces("application/json")
	public Object getThresholdByIdsAndType(@FormParam("para") String para ){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		GetThresholdByIdsAndTypeParam param = gson.fromJson(para, GetThresholdByIdsAndTypeParam.class);
		String sql = "select * from t_threshold where fromdata='%s' and geoID in(%s)";
		String[] ids = param.getIds();
		String strIds = "";
		for(String id:ids){
			strIds+="'";
			strIds+=id;
			strIds+="'";
			strIds+=",";
		}
		strIds = strIds.substring(0, strIds.length()-1);
		sql = String.format(sql, param.getType(),strIds);

		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			commonResult.setErr(e.getMessage());
			e.printStackTrace();
		}
		
		PreparedStatement ps;
		List lsFlashFloodThreshold = null;
		DBUtil dbUtil = new DBUtil();
		try{
			ps = dpConn.prepareStatement(sql);
			ResultSet rsDB = ps.executeQuery();
			lsFlashFloodThreshold = dbUtil.populate(rsDB, FlashFloodThreshold.class);
			ps.close();
			dpConn.close();
		}
		catch(Exception ex){
			commonResult.setErr(ex.getMessage());
			log.error(ex.getMessage());
		}
		if(lsFlashFloodThreshold!=null){
			commonResult.setSuc(lsFlashFloodThreshold);
		}
		return commonResult;
	}
	@POST
	@Path("updateThresholdByIdsAndCol")
	@Produces("application/json")
	public Object updateThresholdByIdsAndCol(@FormParam("para") String para ){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		UpdateThresholdByIdsAndColParam param = gson.fromJson(para, UpdateThresholdByIdsAndColParam.class);
		String sql = "update t_threshold set %s = %f where fromdata='%s' and geoID in(%s)";
		String[] ids = param.getIds();
		String strIds = "";
		for(String id:ids){
			strIds+="'";
			strIds+=id;
			strIds+="'";
			strIds+=",";
		}
		strIds = strIds.substring(0, strIds.length()-1);
		sql = String.format(sql, param.getColName(),param.getValue(),param.getType(),strIds);

		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			commonResult.setErr(e.getMessage());
			e.printStackTrace();
		}
		
		PreparedStatement ps;
		try{
			ps = dpConn.prepareStatement(sql);
			int result = ps.executeUpdate();
			ps.close();
			dpConn.close();
			commonResult.setSuc(result);
		}
		catch(Exception ex){
			commonResult.setErr(ex.getMessage());
			log.error(ex.getMessage());
		}
		return commonResult;
	}
}
