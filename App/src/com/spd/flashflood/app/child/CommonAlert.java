package com.spd.flashflood.app.child;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.alibaba.druid.pool.DruidPooledConnection;
import com.weathermap.objects.Analyst;
import com.weathermap.objects.Dataset;
import com.weathermap.objects.DatasetRaster;
import com.weathermap.objects.DatasetVector;
import com.weathermap.objects.Datasource;
import com.weathermap.objects.GeoPoint;
import com.weathermap.objects.Geometry;
import com.weathermap.objects.Recordset;
import com.weathermap.objects.Scanline;
import com.weathermap.objects.Workspace;
import com.spd.flashflood.model.Application;
import com.spd.flashflood.model.CountyRain;
import com.spd.flashflood.model.FlashFloodAlert;

public class CommonAlert {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:隐患点
	 */
	public static List<FlashFloodAlert> calDisasterPoint(Datasource dsTemp,int[] forcastHR,String shpFile,String dataType,int productID,String strProductDatetime,int strategy){
		List<FlashFloodAlert> lsFlashFloodAlert = new ArrayList();
		String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"disasterPoint\",\"Server\":\"%s\"}", root + "../data/"+shpFile);
		Datasource dsBase = Application.m_workspace.OpenDatasource(strJson);
		DatasetVector dvBase = (DatasetVector) dsBase.GetDataset(0);
		Recordset rs = dvBase.Query("", null);
		if(rs == null){
			System.out.println("隐患点记录为空!");
			return lsFlashFloodAlert;
		}
		rs.MoveFirst();
		while(!rs.IsEOF()){
			String name = rs.GetFieldValue("Name").toString();
			String type = rs.GetFieldValue("Type").toString();
			String id = rs.GetFieldValue("ID").toString();
			GeoPoint gp = (GeoPoint) rs.GetGeometry();
			double lon = gp.GetPoint().getX();
			double lat = gp.GetPoint().getY();
			int level = 4;
			int hrSize = forcastHR.length;
			double[] rains = new double[hrSize];
			for(int h=0;h<hrSize;h++){//时效,时效在外，由等级高到底判断
				//取当前时效的降水数据
				DatasetRaster dr = (DatasetRaster) dsTemp.GetDataset("D"+forcastHR[h]);
				Point2D p2d = new Point2D.Double(lon,lat);
				Point2D pCell = dr.PointToCell(p2d);
				double fVal = dr.GetValue((int)pCell.getX(), (int)pCell.getY());//值
				fVal = ((int)(fVal*100))/100.0;
				rains[h] = fVal;
				if(fVal<0.1){//什么都不会发生，不用后台判断
					continue;
				}
				for(int l=1;l<level;l++){//等级
					String filed = "L"+l+"_H"+forcastHR[h];
					double thresholdVal = Double.parseDouble(rs.GetFieldValue(filed).toString());//临界值
					thresholdVal = thresholdVal/10;//用作测试
					if(fVal>thresholdVal){
						FlashFloodAlert flashFloodAlert = new FlashFloodAlert();
						flashFloodAlert.setProductID(productID);
						flashFloodAlert.setType(dataType);
						flashFloodAlert.setGeoID(id);
						flashFloodAlert.setLevel(l);
						flashFloodAlert.setHourspan(forcastHR[h]);
						flashFloodAlert.setDatetime(strProductDatetime);
						flashFloodAlert.setRain(fVal);
						flashFloodAlert.setStrategy(strategy);
						flashFloodAlert.setRains(rains);
						lsFlashFloodAlert.add(flashFloodAlert);
						break;
					}
				}
			}
			rs.MoveNext();
		}
		rs.Destroy();
		return lsFlashFloodAlert;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:计算面
	 */
	public List<FlashFloodAlert> calRegion(Datasource dsTemp,int[] forcastHR,String shpFile,String dataType,int productID,String strProductDatetime,int strategy){
		List<FlashFloodAlert> lsFlashFloodAlert = new ArrayList();
		String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", shpFile,root + "../data/"+shpFile);
		Datasource dsBase = Application.m_workspace.OpenDatasource(strJson);
		DatasetVector dvBase = (DatasetVector) dsBase.GetDataset(0);
		Recordset rs = dvBase.Query("", null);
		if(rs == null){
			System.out.println("记录为空!");
			return lsFlashFloodAlert;
		}
		rs.MoveFirst();
		while(!rs.IsEOF()){
			String name = rs.GetFieldValue("Name").toString();
			String id = rs.GetFieldValue("ID").toString();
			Geometry geo = rs.GetGeometry();
			int level = 4;
			int hrSize = forcastHR.length;
			double[] rains = new double[hrSize];
			for(int h=0;h<hrSize;h++){//时效,时效在外，由等级高到底判断
				DatasetRaster dr = (DatasetRaster) dsTemp.GetDataset("D"+forcastHR[h]);
				DatasetRaster drCliped = clipDatasetRasterByGeo(dsTemp,dr,geo);
				double fVal = calDatasetRasterAvg(drCliped);
				fVal = ((int)(fVal*100))/100.0;
				rains[h] = fVal;
				if(fVal<0.1){//什么都不会发生，不用后台判断
					continue;
				}
				for(int l=1;l<=level;l++){//等级
					String filed = "L"+l+"_H"+forcastHR[h];
					double thresholdVal = Double.parseDouble(rs.GetFieldValue(filed).toString());//临界值
					thresholdVal = thresholdVal/500;//用作测试
					if(fVal>thresholdVal){
						FlashFloodAlert flashFloodAlert = new FlashFloodAlert();
						flashFloodAlert.setProductID(productID);
						flashFloodAlert.setType(dataType);
						flashFloodAlert.setGeoID(id);
						flashFloodAlert.setLevel(l);
						flashFloodAlert.setHourspan(forcastHR[h]);
						flashFloodAlert.setDatetime(strProductDatetime);
						flashFloodAlert.setRain(fVal);
						flashFloodAlert.setStrategy(strategy);
						flashFloodAlert.setRains(rains);
						lsFlashFloodAlert.add(flashFloodAlert);
						break;
					}
				}
			}
			rs.MoveNext();
		}
		rs.Destroy();
		return lsFlashFloodAlert;
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
	 * @说明:计算格点的平均值
	 */
	private static double calDatasetRasterMax(DatasetRaster dr){
		int rows = dr.GetHeight();
		int cols = dr.GetWidth();
		double noVal = dr.GetNoDataValue();
		Scanline sl = new Scanline(dr.GetValueType(),cols);
		double max = 0;
		for(int r=0;r<rows;r++){
			dr.GetScanline(0, r, sl);
			for(int c=0;c<cols;c++){
				double val = sl.GetValue(c);
				if(val>max){
					max = val;
				}
			}
		}
		return max;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:最大产品ID+1
	 */
	public static int getMaxProductID(DruidPooledConnection conn,int strategy){
		String sql = "select max(productID) from t_flashflood_alert where strategy=%d";
		sql = String.format(sql, strategy);
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
	public Boolean calForcast(int[] forcastHR,int startHS,Datasource dsDB,Datasource dsTemp,String fTableName){
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
				if(dataset==null){
					return false;
				}
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
		return true;
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
	public List<CountyRain> calCountyRain(Datasource dsTemp,String shpFile,int[] forcastHR){
		String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"disasterPoint\",\"Server\":\"%s\"}", root + "../data/"+shpFile);
		Datasource dsBase = Application.m_workspace.OpenDatasource(strJson);
		DatasetVector dvBase = (DatasetVector) dsBase.GetDataset(0);
		Recordset rs = dvBase.Query("", null);
		if(rs == null){
			System.out.println("记录为空!");
		}
		List<CountyRain> lsCountyRain = new ArrayList();
		rs.MoveFirst();
		while(!rs.IsEOF()){
			String name = rs.GetFieldValue("Name").toString();
			Geometry geo = rs.GetGeometry();
			int hrSize = forcastHR.length;
			CountyRain countyRain = new CountyRain();
			countyRain.setName(name);
			for(int h=0;h<hrSize;h++){//时效,时效在外，由等级高到底判断
				DatasetRaster dr = (DatasetRaster) dsTemp.GetDataset("D"+forcastHR[h]);
				DatasetRaster drCliped = clipDatasetRasterByGeo(dsTemp,dr,geo);
				double val = calDatasetRasterMax(drCliped);
				val = ((int)(val*100))/100.0;
				if(h==0){
					countyRain.setR3(val);
				}
				else if(h==1){
					countyRain.setR6(val);
				}
				else if(h==2){
					countyRain.setR24(val);
				}
			}
			lsCountyRain.add(countyRain);
			rs.MoveNext();
		}
		return lsCountyRain;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:插入数据库
	 */
	public static void insertRainInfo(DruidPooledConnection conn,List<FlashFloodAlert> lsFlashFloodAlert){
		String fSql = "insert into t_flashflood_rain(productID,geoID,strategy,r3,r6,r24) values(?,?,?,?,?,?)";
		try {
			conn.setAutoCommit(false);
			PreparedStatement ps = conn.prepareStatement(fSql);
			for(FlashFloodAlert flashFloodAlert:lsFlashFloodAlert){
				ps.setInt(1, flashFloodAlert.getProductID());
				ps.setString(2, flashFloodAlert.getGeoID());
				ps.setInt(3, flashFloodAlert.getStrategy());
				double[] rains = flashFloodAlert.getRains();
				ps.setDouble(4, rains[0]);
				ps.setDouble(5, rains[1]);
				ps.setDouble(6, rains[2]);
				ps.addBatch();
			}
			ps.executeBatch();
			conn.commit();
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	public void getGridFromGrid2(Workspace ws,File file,DatasetRaster drResult,int index){
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
		double noVal = drSrc.GetNoDataValue();
		for(int r = rows-1;r>=0;r--){
			drSrc.GetScanline(0, r+offY, slSrc);
			drResult.GetScanline(0, r, slResult);
			for(int c=0;c<cols;c++){
				double val = slSrc.GetValue(c+offX);
				if(val==noVal){
					continue;
				}
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
	public void RHGrid(Datasource dsForecast,Datasource dsLive){
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
}
