package com.spd.flashflood.app;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;

import com.alibaba.druid.pool.DruidPooledConnection;
import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoPoint;
import com.mg.objects.Geometry;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.spd.flashflood.model.Threshold;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.CountyRain;
import com.spd.grid.domain.FlashFloodAlert;
import com.spd.grid.tool.ClassUtil;
import com.spd.grid.tool.DBUtil;
import com.spd.weathermap.util.LogTool;

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
	public static List<FlashFloodAlert> calDisasterPoint(Datasource dsTemp,int[] forcastHR,String shpFile,String dataType,int productID,String strProductDatetime,int strategy,List<Threshold> lsThreshold){
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
		ClassUtil classUtil = new ClassUtil();
		while(!rs.IsEOF()){
			String type = rs.GetFieldValue("Type").toString();
			String id = rs.GetFieldValue("ID").toString();
			GeoPoint gp = (GeoPoint) rs.GetGeometry();
			double lon = gp.GetPoint().getX();
			double lat = gp.GetPoint().getY();
			int level = 4;
			int hrSize = forcastHR.length;
			double[] rains = new double[hrSize];
			Threshold threshold = getThresholdByTypeAndGeoID(lsThreshold,dataType,id);
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
					double thresholdVal = Double.parseDouble(classUtil.getFieldValueByName(filed, threshold).toString());//临界值
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
	public List<FlashFloodAlert> calRegion(Datasource dsTemp,int[] forcastHR,String shpFile,String dataType,int productID,String strProductDatetime,int strategy,List<Threshold> lsThreshold){
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
		ClassUtil classUtil = new ClassUtil();
		while(!rs.IsEOF()){
			String id = rs.GetFieldValue("ID").toString();
			Geometry geo = rs.GetGeometry();
			int level = 4;
			int hrSize = forcastHR.length;
			double[] rains = new double[hrSize];
			Threshold threshold = getThresholdByTypeAndGeoID(lsThreshold,dataType,id);
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
					double thresholdVal = Double.parseDouble(classUtil.getFieldValueByName(filed, threshold).toString());//临界值
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
	/**
	 * @throws Exception 
	 * @作者:wangkun
	 * @日期:2017年11月27日
	 * @修改日期:2017年11月27日
	 * @参数:conn-数据库连接
	 * @返回:阀值列表
	 * @说明:获取阀值
	 */
	public static List<Threshold> getThreshold(DruidPooledConnection conn) throws Exception{
		String sql = "select * from t_threshold";
		PreparedStatement ps = conn.prepareStatement(sql);
		ResultSet rs = ps.executeQuery();
		DBUtil dBUtil = new DBUtil();
		List<Threshold> lsThreshold = dBUtil.populate(rs, Threshold.class);
		return lsThreshold;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年11月27日
	 * @修改日期:2017年11月27日
	 * @参数:lsThreshold-阀值列表,type-类型，geoID-id
	 * @返回:值
	 * @说明:获取字段值
	 */
	public static Threshold getThresholdByTypeAndGeoID(List<Threshold> lsThreshold,String type,String geoID){
		Threshold findObj = null;
		for(Threshold threshold:lsThreshold){
			if(!type.equals(threshold.getFromdata())){
				continue;
			}
			if(!geoID.equals(threshold.getGeoID())){
				continue;
			}
			findObj = threshold;
			break;
		}
		return findObj;
	}
}
