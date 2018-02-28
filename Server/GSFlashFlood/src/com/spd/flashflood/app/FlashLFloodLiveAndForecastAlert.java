package com.spd.flashflood.app;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoPoint;
import com.mg.objects.GeoRegion;
import com.mg.objects.Geometry;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.flashflood.model.Threshold;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.DatasourceConnectionConfigInfo;
import com.spd.grid.domain.FlashFloodAlert;
import com.spd.grid.jdbc.DataSourceSingleton;
import com.spd.grid.tool.DateUtil;
import com.spd.grid.tool.FileHelper;
/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-31
 * @最后修改: 2017-10-31
 * @功能: 山洪实况+预报预警
 **/
public class FlashLFloodLiveAndForecastAlert {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	private static int strategy = 2;//2为实况+预报
	private static String path = "E:/GS/Data/CMISS/ANALYSIS/CMPA/0P05/";
	public static void main(String[] args) throws Exception {
		Boolean debug = true;
		Calendar cal = Calendar.getInstance();
		if(debug){
			cal.set(Calendar.YEAR, 2017);
			cal.set(Calendar.MONTH, 9);
			cal.set(Calendar.DAY_OF_MONTH, 30);
			cal.set(Calendar.HOUR_OF_DAY, 13);
		}
		String strProductDatetime = DateUtil.format("yyyy-MM-dd HH:00:00", cal);
		//1、连接数据引擎
		DatasourceConnectionConfigInfo datasourceConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("datasourceConnectionConfigInfo");
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				datasourceConnectionConfigInfo.getType(), datasourceConnectionConfigInfo.getAlias(), datasourceConnectionConfigInfo.getServer(), 
				datasourceConnectionConfigInfo.getUser(),datasourceConnectionConfigInfo.getPassword(), datasourceConnectionConfigInfo.getDatabase(), 
				datasourceConnectionConfigInfo.getPort());
		Datasource m_datasource = Application.m_workspace.OpenDatasource(strJson);
		int count = m_datasource.GetDatasetCount();
		System.out.println(count);
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
			File findFile = getFileByDateTime(calLive);
			if(findFile==null){//没找到文件
				continue;
			}
			calLive.add(Calendar.HOUR, -1);
			getGridFromGrid2(ws,findFile,dr,i);
		}
		System.out.println("5、计算实况完成");
		CommonAlert commonAlert = new CommonAlert();
		//5、计算预报
		String fTableName = "t_prvn_r3_%s%s00_p_%s%s_%s_1000";
		String yyMMdd = DateUtil.format("yyMMdd", calForcast);
		fTableName = String.format(fTableName, yyMMdd,strMakeTime,yyMMdd,strForcastTime,"%s");
		int[] forcastHR = {3,6,24};
		commonAlert.calForcast(forcastHR,startHourspan,m_datasource,dsForcast,fTableName);
		System.out.println("5、获取预报完成");
		//6、融合实况到预报中
		if(liveHour>0){//有实况才整合
			RHGrid(dsForcast,dsLive);
		}
		//7、连接数据库
		DruidDataSource dds = DataSourceSingleton.getInstance();
		DruidPooledConnection dpConn = null;
		try {
			dpConn = dds.getConnection();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("7、连接数据库完成");
		//8、获取数据库阀值
		List<Threshold> lsThreshold = commonAlert.getThreshold(dpConn);	
		//9、获取产品ID
		int productID = commonAlert.getMaxProductID(dpConn, strategy);
		//10、获取山洪基础数据(中小河,山洪沟，隐患点)
		List<FlashFloodAlert> lsResult = null;
		lsResult = commonAlert.calDisasterPoint(dsForcast, forcastHR, "disasterPoint.shp", "地质灾害隐患点", productID, strProductDatetime, strategy,lsThreshold);
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsForcast, forcastHR, "riveRegion.shp", "中小河流", productID, strProductDatetime,strategy,lsThreshold);//中小河
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		lsResult = commonAlert.calRegion(dsForcast, forcastHR, "SHGRegion.shp", "中山洪沟河流", productID, strProductDatetime,strategy,lsThreshold);//山洪沟
		insertProduct(dpConn,lsResult);
		commonAlert.insertRainInfo(dpConn,lsResult);
		try {
			dpConn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("实况+预报计算完成");
		//ws.CloseDatasource("FlashLFloodLiveAlert");
	}
	private static void RHGrid(Datasource dsForecast,Datasource dsLive){
		Dataset dtForecast = dsForecast.GetDataset("d3");
		DatasetRaster drForecast = (DatasetRaster) dtForecast;
		Dataset dtLive = dsLive.GetDataset("d3");
		DatasetRaster drLive = (DatasetRaster) dtLive;
		int rows = drForecast.GetHeight();
		int cols = drForecast.GetWidth();
		Scanline slForecast = new Scanline(drForecast.GetValueType(),cols);
		Scanline slLive = new Scanline(drLive.GetValueType(),cols);
		for(int r=0;r<rows;r++){
			drForecast.GetScanline(0, r, slForecast);
			drLive.GetScanline(0, r, slLive);
			for(int c=0;c<cols;c++){
				double forecastVal = slForecast.GetValue(c);
				double liveVal = slLive.GetValue(c);
				if(liveVal>forecastVal){
					slForecast.SetValue(c, liveVal);
				}
			}
			drForecast.SetScanline(0, r, slForecast);
		}
		slForecast.Destroy();
		slLive.Destroy();
		drForecast.CalcExtreme();
		drForecast.FlushCache();
	}
	private static void getGridFromGrid2(Workspace ws,File file,DatasetRaster drResult,int index){
		String strFile = file.getAbsolutePath();
		strFile = strFile.replace("\\", "/");
		String strJson = "{\"Type\":\"grib_api\",\"Alias\":\"FlashLFloodLiveAlertGrid2\",\"Server\":\"%s\"}";
		strJson = String.format(strJson, strFile);
		Datasource ds = ws.OpenDatasource(strJson);
		Dataset dt = ds.GetDataset(0);
		DatasetRaster drSrc = ((DatasetRaster)dt);
		drSrc.Open();  //一定要调用Open
		drSrc.CalcExtreme();
		double[] bounds = {91.975,31.975,109.025,43.025};
		int rows = 221;
		int cols = 341;
		Rectangle2D r2d = drSrc.GetBounds();
		int offX = (int) ((bounds[0]-r2d.getX())/0.05);
		int offY = (int) ((bounds[1]-r2d.getY())/0.05);
		int totalWidth = drSrc.GetWidth();
		Scanline slSrc = new Scanline(drSrc.GetValueType(), totalWidth);
		Scanline slResult = new Scanline(drResult.GetValueType(), cols);
		double max = 0;
		for(int r = rows-1;r>=0;r--){
			drSrc.GetScanline(0, r+offY, slSrc);
			drResult.GetScanline(0, r, slResult);
			for(int c=0;c<cols;c++){
				double val = slSrc.GetValue(c+offX);
				if(index==1){
					slResult.SetValue(c, val);
					if(val>max){
						max = val;
					}
				}
				else{
					double oldVal = slResult.GetValue(c);
					double sum = val+oldVal;
					slResult.SetValue(c, sum);
					if(sum>max){
						max = sum;
					}
				}
			}
			drResult.SetScanline(0, r, slResult);
		}
		System.out.println("最大值:"+max);
		slSrc.Destroy();
		slResult.Destroy();
		drResult.CalcExtreme();
		drResult.FlushCache();
		ws.CloseDatasource("FlashLFloodLiveAlertGrid2");
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月31日
	 * @修改日期:2017年10月31日
	 * @参数:cal-日期
	 * @返回:文件
	 * @说明:根据日期获取文件
	 */
	private static File getFileByDateTime(Calendar cal){
		int year = cal.get(Calendar.YEAR);
		String strYYYYMMDD = DateUtil.format("yyyyMMdd", cal);
		String strYYYYMMddHH = DateUtil.format("yyyyMMddHH", cal);
		String strFormater = strYYYYMMddHH+".GRB2";
		FileHelper fileHelper = new FileHelper();
		String newPath = path+year+"/"+strYYYYMMDD+"/";
		File findFile = fileHelper.findGrid2(newPath, strFormater);
		return findFile;
	}
	private static void calForcast(int[] forcastHR,int startHS,Datasource dsDB,Datasource dsTemp,String fTableName){
		int hrSize = forcastHR.length;
		for(int i=0;i<hrSize;i++){
			int curHR = forcastHR[i];
			int resCount = curHR/3;//用到的资料数
			DatasetRaster tempDR = null;
			for(int j=0;j<resCount;j++){
				int curHS = startHS+j*3;
				String strCurHS = String.format("%03d", curHS);
				String tempTableName = String.format(fTableName, strCurHS);//完整表名
				Dataset dataset = dsDB.GetDataset(tempTableName);
				DatasetRaster dr = (DatasetRaster) dataset;
				dr.CalcExtreme();
				if(j==0){
					tempDR = createTempDS(dsTemp,dr,curHR);
					tempDR.Open();
				}
				int rows = dr.GetHeight();
				int cols = dr.GetWidth();
				Scanline sl = new Scanline(dr.GetValueType(),cols);
				Scanline slResult = new Scanline(tempDR.GetValueType(),cols);
				for(int r=0;r<rows;r++){
					dr.GetScanline(0, r, sl);
					tempDR.GetScanline(0, r, slResult);
					for(int c=0;c<cols;c++){
						double thisVal = sl.GetValue(c);
						if(j==0){
							slResult.SetValue(c, thisVal);
						}
						else{
							double oldVal = slResult.GetValue(c);
							double sum = oldVal+thisVal;
							slResult.SetValue(c, sum);
						}
					}
					tempDR.SetScanline(0, r, slResult);
				}
				tempDR.CalcExtreme();
				tempDR.FlushCache();
			}
		}
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:创建临时数据集
	 */
	private static DatasetRaster createTempDS(Datasource ds,DatasetRaster srcDR,int hr){
		Rectangle2D rcBounds = srcDR.GetBounds();
		String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight()); //左 上 宽 高
		String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
				"D"+hr, "Single", srcDR.GetWidth(), srcDR.GetHeight(), "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, srcDR.GetNoDataValue());
		DatasetRaster drResult = ds.CreateDatasetRaster(str);
		drResult.SetBounds(rcBounds);
		return drResult;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:裁剪DatasetRaster
	 */
	private static DatasetRaster clipDatasetRasterByGeo(Datasource ds,DatasetRaster dr,Geometry geo){
		//1、创建临时数据集
		 String strJson = "{\"Name\":\"temp\",\"Type\":\"Region\"}";
		 ds.DeleteDataset("temp");
		 DatasetVector dv = ds.CreateDatasetVector(strJson);
		 //2、把GEO加到DV中
		 Recordset rs = dv.Query("", null);
		 rs.AddNew(geo);
		 rs.Update();
		 rs.Destroy();
		 //3、裁剪
		 Analyst pAnalyst = Analyst.CreateInstance("RasterClip", Application.m_workspace); //A裁剪B
		 strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dv.GetDatasource().GetAlias(), dv.GetName());
		 pAnalyst.SetPropertyValue("ClipRegion", strJson);
		 strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dr.GetDatasource().GetAlias(), dr.GetName());
		 pAnalyst.SetPropertyValue("Input", strJson);
		 String strClipDatasetName =  dr.GetName() + "_Clip";
		 ds.DeleteDataset(strClipDatasetName);//不管存不存在，删除
		 strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", ds.GetAlias(), strClipDatasetName);
		 pAnalyst.SetPropertyValue("Output", strJson);
		 pAnalyst.Execute();
		 pAnalyst.Destroy();
		 DatasetRaster drResult = (DatasetRaster) ds.GetDataset(strClipDatasetName);
		 drResult.Open();
		 drResult.CalcExtreme();
		 return drResult;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:计算格点的平均值
	 */
	private static double calDatasetRasterAvg(DatasetRaster dr){
		int rows = dr.GetHeight();
		int cols = dr.GetWidth();
		double noVal = dr.GetNoDataValue();
		Scanline sl = new Scanline(dr.GetValueType(),cols);
		int gridCount = 0;
		double sum = 0;
		for(int r=0;r<rows;r++){
			dr.GetScanline(0, r, sl);
			for(int c=0;c<cols;c++){
				double val = sl.GetValue(c);
				if(val!=noVal){
					sum += val;
					gridCount++;
				}
			}
		}
		if(gridCount==0){
			return 0;
		}
		else{
			return sum/gridCount;
		}
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:最大产品ID+1
	 */
	private static int getMaxProductID(DruidPooledConnection conn){
		String sql = "select max(productID) from t_flashflood_alert";
		int productID = 1;
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			rs.first();
			int rows = rs.getRow();
			rs.first();
			if(rows>0){
				productID = rs.getInt(1)+1;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return productID;
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
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
