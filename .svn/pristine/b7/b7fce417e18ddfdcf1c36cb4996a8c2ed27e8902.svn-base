package com.spd.grid.tool;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;

import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;

import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.MGEventListener;
import com.mg.objects.MGEventObject;
import com.mg.objects.ProgressChangedEventObject;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.grid.tool.BaoWenFileFilter;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;

public class ReadWarm {

	private static String m_strType;	 //模式类型
	private static String m_strElement;	 //要素
	private static String m_strLevel;	 //层次
	private static String m_strPath;	 //数据路径
	private static String m_filter; //文件名过滤条件，例如(.*)TMP(.*)date(.*).GRIB2，其中的date会被替换
	private static Boolean m_bSum = false;       //原始数据是否为累计值（日本逐3小时降水等，它属于累计值，同化处理时需要减去前一个时次的值）
	//private static String m_nStatisticsElement = "";	//统计要素，例如"tmax 24 max"，表示逐24小时统计最高作为最高气温
	private static int m_nStatisticsHourSpan = -1;  //统计时效 ，例如"tmax 24 max"，表示逐24小时统计最高作为最高气温
	private static String m_strStatisticsMethod = ""; //统计方法 ，例如"tmax 24 max"，表示逐24小时统计最高作为最高气温
	
	private static String m_strAlias;
	private static Workspace m_workspace;
	private static String m_strConnectionInfo;
	
	private static Double m_dResolutionX = 0.05;
	private static Double m_dResolutionY = 0.05;
	private static Double m_left = 109.0;
	private static Double m_bottom = 34.0;
	private static Double m_width = 6.1;
	private static Double m_height = 7.1;
//	private static Double m_left = 104.175;
//	private static Double m_bottom = 19.475;
//	private static Double m_width = 8.05;
//	private static Double m_height = 7.05;
	private  Logger log=null;
	
	static {
		m_workspace = new Workspace();
		CommonTool commonTool = new CommonTool();
//		m_strConnectionInfo = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
//				commonTool.getValue("Type"), commonTool.getValue("Alias"), commonTool.getValue("Server"), commonTool.getValue("User"),
//				commonTool.getValue("Password"), commonTool.getValue("DB"), commonTool.getValue("Port"));
//		m_strAlias = commonTool.getValue("Alias");	
//		m_dResolutionX = Double.valueOf(commonTool.getValue("ResolutionX"));
//		m_dResolutionY = Double.valueOf(commonTool.getValue("ResolutionY"));
//		m_left = Double.valueOf(commonTool.getValue("Left"));
//		m_bottom = Double.valueOf(commonTool.getValue("Bottom"));
//		m_width = Double.valueOf(commonTool.getValue("Width"));
//		m_height = Double.valueOf(commonTool.getValue("Height"));
	}
	
	/**
	 * 获取格点数据源
	 * @return
	 */
	private Datasource getDatasource()
	{
		Datasource ds = m_workspace.GetDatasource(m_strAlias);
		if(ds == null){
			ds = m_workspace.OpenDatasource(m_strConnectionInfo);
		}
//		if(ds == null)	//首次部署时创建数据源
//		{
//			LogTool.logger.info("创建数据源："+m_strConnectionInfo);
//			ds = m_workspace.CreateDatasource(m_strConnectionInfo);
//		}
		return ds;
	}
	
	/**
	 * 查询返回全部的需要同步的文件
	 * @return
	 */
	public ArrayList<File> getFiles(Date date) {
		ArrayList<File> arrayFile = null;
		
		try{
			log.info(m_strType + "_" + m_strElement + "：正在搜索待同步的文件...");
			String filter = m_filter;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			String dateStr = sdf.format(date);
			filter = filter.replaceAll("date", dateStr);
			File dataFile = new File(ReadWarm.m_strPath);
			File[] micapsFiles = dataFile.listFiles(new BaoWenFileFilter(filter));
			if(micapsFiles != null && micapsFiles.length > 0){
				arrayFile = new ArrayList<File>(); 
				for(int i=0; i<micapsFiles.length; i++)
					arrayFile.add(micapsFiles[i]);
				//排序一下，以备后用
				Collections.sort(arrayFile, new Comparator<File>() { 
				    @Override
				    public int compare(File o1, File o2) {
				        if (o1.isDirectory() && o2.isFile())
				            return -1;
				        if (o1.isFile() && o2.isDirectory())
				            return 1;
				        //return o2.getName().compareTo(o1.getName()); //倒序
				        return o1.getName().compareTo(o2.getName());   //顺序
				    }
				});	
			}
		}
		catch (Exception e) {
			log.info(e.getMessage());
		}		
		return arrayFile;
	}
	
	public Datasource openDAT(String filePath) throws IOException{
		FileInputStream in;
		try {
			in = new FileInputStream(filePath);
			//in = new FileInputStream(fileName);
			DataInputStream din = new DataInputStream(in);  
	        // 文件数据  
	        int length = din.available();  
	        byte[] data = new byte[length];  
	        // 读取文件到字节数组  
	        din.read(data);
	        float[] dataR = new float[length/4];
	        float[][][] dataResult = new float[30][71][61];
	        byte[] data1 = new byte[4];
	        for(int i=length-1;i>=0;i--){
	        	data1[3-i%4] = data[i];
	        	if(i%4 == 0){
	        		ByteBuffer bb = ByteBuffer.wrap(data1);
	    	        FloatBuffer fb = bb.asFloatBuffer();
	    	        dataR[i/4] = fb.get();
	        	}
	        }
	        for(int i=0;i<30;i++){
	        	for(int j=0;j<71;j++){
	        		for(int k=0;k<61;k++){
	        			dataResult[i][j][k] = dataR[k+61*j+61*71*i];
	        		}
	        	}
	        }
	        Datasource dsSum = null;
	        String strJson = "{\"Type\":\"Memory\",\"Alias\":\"warm\",\"Server\":\"\"}";
	        dsSum = m_workspace.CreateDatasource(strJson);
            Rectangle2D rectangle2d = new Rectangle2D.Double(m_left, m_bottom, m_width, m_height);
			double dDelta = 0.1;
			int cols = (int)Math.round(rectangle2d.getWidth()/dDelta);
			int rows = (int)Math.round(rectangle2d.getHeight()/dDelta);
			double noDataValue = -9999.0f;
			Rectangle2D rcBounds = rectangle2d;
			for(int i=0;i<dataResult.length;i++){
				String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight());
				String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
						"dataset"+i, "Double", cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
				DatasetRaster dgTarget = dsSum.CreateDatasetRaster(str);
				dgTarget.SetBounds(rectangle2d);
				dgTarget.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
				dgTarget.Open();
				Scanline sl = new Scanline("Double", cols);
				for (int k=0; k<rows; k++)
	            {
					dgTarget.GetScanline(0, k, sl);
					for(int l=0; l<cols; l++){
							sl.SetValue(l, dataResult[i][k][l]);
					}				    								
					dgTarget.SetScanline(0, k, sl);
	            }
				sl.Destroy();
			}
			return dsSum;
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
        
		return null;
	}
	
	public void sync(ArrayList<File> files) {
		if(files == null || files.size() == 0)
		{
			log.info("当前没有需要同化的数据");
			return;
		}
			
		Datasource dsMySQL = getDatasource();
		try {
		if(dsMySQL == null)
			log.info("数据源打开失败！");
		Datasource dsTarget = dsMySQL;
		
		for(int i=0; i<files.size(); i++)
		{
			File file = files.get(i);
			String fileFullName = file.getName();
			log.info("正在处理" + fileFullName + "...");
			String filename = fileFullName.substring(0, fileFullName.lastIndexOf("."));			
			String[] strs = filename.split("-");
			int hourSpanInterval = 1;			
			String strDateTime = strs[strs.length - 2];
			String strYear = strDateTime.substring(2, 4);
			String strMonth = strDateTime.substring(4, 6);
			String strDay = strDateTime.substring(6, 8);
			String strHour = strs[strs.length - 1].substring(0, 2);
			
//			String strJson = String.format("{\"Type\":\"GRIB\",\"Alias\":\"%s\",\"Server\":\"%s\"}", 
//					"ds"+strYear+strMonth+strDay+strHour, file.getAbsolutePath());
			/*String strJson = String.format("{\"Type\":\"grib_api\",\"Alias\":\"%s\",\"Server\":\"%s\"}", 
			"ds"+strYear+strMonth+strDay+strHour, file.getAbsolutePath());
			strJson=strJson.replace('\\', '/');
			Datasource dsGrib = m_workspace.OpenDatasource(strJson);*/
			String strJson = "";
			Datasource dsGrib = openDAT(file.getPath());
			if(dsGrib == null){
				log.info("Grib2数据源打开失败！");
				continue;
			}
			
			//如果是需要统计
			String strAliasMem = "dsMem";
			int nStatisticsMethod = -1;
			Boolean bStatistics = m_nStatisticsHourSpan>1 && !m_strStatisticsMethod.equals(""); 
			if(bStatistics){			
				//转换为整数，后面计算快
				if(m_strStatisticsMethod.equals("max"))
					nStatisticsMethod = 0;
				else if(m_strStatisticsMethod.equals("min"))
					nStatisticsMethod = 1;
				else if(m_strStatisticsMethod.equals("sum"))
					nStatisticsMethod = 2;
				strJson = "{\"Type\":\"Memory\",\"Alias\":\""+ strAliasMem +"\",\"Server\":\"\"}";
				dsTarget = m_workspace.GetDatasource(strAliasMem);
				if(dsTarget != null)
					m_workspace.CloseDatasource(dsTarget.GetAlias());
	            dsTarget = m_workspace.CreateDatasource(strJson);
			}
			
			int datasetCountTotal = dsGrib.GetDatasetCount();
			if(datasetCountTotal == 0)
				log.error("数据集个数为0");
			for(int k=0; k<datasetCountTotal; k++){
				int hourSpan = (k+1)*hourSpanInterval;
				if(!dsGrib.GetDataset(k).GetType().equals("Raster"))
					continue;
				DatasetRaster dr = (DatasetRaster)dsGrib.GetDataset(k);
				dr.Open();
				dr.CalcExtreme();
				String strForecastDate = strYear+strMonth+strDay+strHour;
				String desDatasetName = String.format("t_%s_%s_%s00_p_%s_%03d_%s", ReadWarm.m_strType, ReadWarm.m_strElement, strForecastDate, strForecastDate, hourSpan, ReadWarm.m_strLevel);
				
				String desDatasetNameStatistics = "";
				if(bStatistics)
				{
					int currentStatisticsHourSpan = (int)Math.ceil((double)(hourSpan)/(double)(ReadWarm.m_nStatisticsHourSpan))*m_nStatisticsHourSpan;
					desDatasetNameStatistics = String.format("t_%s_%s_%s00_p_%s_%03d_%s", ReadWarm.m_strType, ReadWarm.m_strElement, strForecastDate, strForecastDate, currentStatisticsHourSpan, ReadWarm.m_strLevel);
					boolean bfound = dsMySQL.GetDataset(desDatasetNameStatistics) != null;
					if(bfound)
					{
						log.info(desDatasetNameStatistics + "已经同化过，无需同化");
						continue;
					}
				}
				
				Boolean bfound = dsTarget.GetDataset(desDatasetName) != null;
				if(!bfound) //如果是风向风速，数据集+u、v，再判断一下
				{
					if(m_strElement.toLowerCase().equals("10uv") || m_strElement.toLowerCase().equals("wmax")){
						bfound = (dsTarget.GetDataset(desDatasetName+"_u") != null && dsTarget.GetDataset(desDatasetName+"_v") != null);
					}
			    }
				if(!bfound) {				
					try {
						String resultDatasetName = desDatasetName;
						if(m_strElement.toLowerCase().equals("10uv") || m_strElement.toLowerCase().equals("wmax")){
							resultDatasetName += ("_" + (m_filter.indexOf("u")!=-1?"u":"v"));
						}						

						if(true)
						{
							//既然引擎无法确定无效值，只能这么处理啦
							Double maxValue = dr.GetMaxValue(); 
							if(maxValue == 9999.0)
								dr.SetNoDataValue(9999.0);
							else if(maxValue == -9999.0)
								dr.SetNoDataValue(-9999.0);
							else if(maxValue == 999.9)
								dr.SetNoDataValue(999.9);
							else if(maxValue == -999.9)
								dr.SetNoDataValue(-999.9);
							dr.CalcExtreme();								
							//double detaX = dr.GetBounds().getWidth()/dr.GetWidth();
				            //格点裁剪
				            Analyst pAnalystRasterClip = Analyst.CreateInstance("RasterClip", m_workspace);
				            strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsGrib.GetAlias(), dr.GetName());
				            pAnalystRasterClip.SetPropertyValue("Input", strJson);
				            strJson = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"dsClip\",\"Server\":\"./data/T_CLIP.shp\"}";
				            Datasource dsClip = m_workspace.OpenDatasource(strJson);
				            Dataset dtClip = dsClip.GetDataset(0);
				            strJson = ((DatasetVector)dtClip).GetFields();
				            strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\",\"Where\":\"%s\"}", dsClip.GetAlias(), dtClip.GetName(), "[ID]=1");
				            pAnalystRasterClip.SetPropertyValue("ClipRegion", strJson);
				            strJson = "{\"Type\":\"Memory\",\"Alias\":\"dsRasterClip\",\"Server\":\"\"}";
				            Datasource dsRasterClip = m_workspace.CreateDatasource(strJson);
				            //strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", detaX > m_dResolutionX ? dsRasterClip.GetAlias():dsTarget.GetAlias(), resultDatasetName);
				            strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsRasterClip.GetAlias(), resultDatasetName);
				            pAnalystRasterClip.SetPropertyValue("Output", strJson);
				            pAnalystRasterClip.Execute();
				            pAnalystRasterClip.Destroy();
				            
				            //格点降尺度
							Datasource dsResample = null;
							double detaX = dr.GetBounds().getWidth()/(dr.GetWidth()-1);
							if(Math.abs(detaX-m_dResolutionX)>0.000001) //如果格距不同
							{
								Analyst pAnalystResample = Analyst.CreateInstance("Resample", m_workspace);
								strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsRasterClip.GetAlias(), resultDatasetName);
								pAnalystResample.SetPropertyValue("Input", strJson);
								pAnalystResample.SetPropertyValue("OutputCellSize", String.format("%s %s", m_dResolutionX, m_dResolutionY));
								pAnalystResample.SetPropertyValue("ResamplingType", "Bilinear"); //ResamplingType:NearestNeighbor,Bilinear,Bicubic					            
								strJson = "{\"Type\":\"Memory\",\"Alias\":\"dsResample\",\"Server\":\"\"}";
								dsResample = m_workspace.CreateDatasource(strJson);
								strJson = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsResample.GetAlias(), resultDatasetName);
								pAnalystResample.SetPropertyValue("Output", strJson);
								//pAnalystResample.AddListener(new ProgressChangedEventListener());
								pAnalystResample.Execute();
								pAnalystResample.Destroy();
							}
							else{
								dsResample = dsRasterClip;
							}
				            
				            //赋值到标准（产品）网格
				            double valueScale = 0;
				            if(m_strElement.toLowerCase().equals("2t") 
				            		|| m_strElement.toLowerCase().equals("tmax") 
				            		|| m_strElement.toLowerCase().equals("tmin")) //气温、高温、低温要除以10
				            	valueScale = 0;
				            
				            Dataset dtResample = dsResample.GetDataset(resultDatasetName);
				            if(dtResample != null){
				            	DatasetRaster dgResample = (DatasetRaster)dtResample;
				            	Rectangle2D rectangle2d = new Rectangle2D.Double(m_left, m_bottom, m_width, m_height);
								double dDelta = m_dResolutionX;
								int cols = (int)Math.round(rectangle2d.getWidth()/dDelta);
								int rows = (int)Math.round(rectangle2d.getHeight()/dDelta);
								double noDataValue = -9999.0f;
								Rectangle2D rcBounds = rectangle2d;
								String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight());
								String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
										resultDatasetName, dgResample.GetValueType(), cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
								DatasetRaster dgTarget = dsTarget.CreateDatasetRaster(str);
								if(dgTarget != null){
									dgTarget.Open();
//										Point2D pt2d00 = dgTarget.CellToPoint(new Point2D.Double(0, 0));
									Point2D pt2d00 = new Point2D.Double(Math.round((rcBounds.getX()+dDelta/2)*10000.0)/10000.0, 
											Math.round((rcBounds.getY()+dDelta/2)*10000.0)/10000.0);
							        Point2D cell00 = dgResample.PointToCell(pt2d00);
									int offsetX = (int)(cell00.getX());
									int offsetY = (int)(cell00.getY());
									Scanline sl = new Scanline(dgTarget.GetValueType(), cols);
		    						Scanline slResample = new Scanline(dgResample.GetValueType(), dgResample.GetWidth());
		    						for (int kk = 0; kk<rows; kk++)
						            {
		    							dgTarget.GetScanline(0, kk, sl);
		    							dgResample.GetScanline(0, kk+offsetY, slResample);
		    							for(int ll=0; ll<cols; ll++)
		    								sl.SetValue(ll, slResample.GetValue(ll+offsetX) - valueScale);
		    							dgTarget.SetScanline(0, kk, sl);
						            }
		    						dgTarget.FlushCache();
		    						dgTarget.CalcExtreme();
								}
				            }
				            
				            if(!bStatistics)
				            	log.info(resultDatasetName + "成功完成同化");
						}
						
						
						if(bStatistics){
							if(hourSpan%m_nStatisticsHourSpan == 0){ //累积时效已满足条件
								//创建结果数据集
								DatasetRaster dg0 = (DatasetRaster)dsTarget.GetDataset(0);
								if(m_strElement.equals("wmax")) //日最大风，特殊处理
								{
									//Rectangle2D rcBounds = dg0.GetBounds();
									Rectangle2D rcBounds = new Rectangle2D.Double(m_left, m_bottom, m_width, m_height);
									double dDelta = m_dResolutionX;
									int cols = (int)Math.round(rcBounds.getWidth()/dDelta);
									int rows = (int)Math.round(rcBounds.getHeight()/dDelta);
									String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight()); //左 上 宽 高
									String strU = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
											desDatasetNameStatistics+"_u", dg0.GetValueType(), cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, dg0.GetNoDataValue());
									String strV = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
											desDatasetNameStatistics+"_v", dg0.GetValueType(), cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, dg0.GetNoDataValue());
									DatasetRaster dgU = dsMySQL.CreateDatasetRaster(strU);
									DatasetRaster dgV = dsMySQL.CreateDatasetRaster(strV);
									if(dgU == null || dgV == null)
									{
										log.error("数据集创建失败:"+desDatasetNameStatistics);
										return;
									}
									
									Scanline slU = new Scanline(dgU.GetValueType(), cols);
									Scanline slV = new Scanline(dgV.GetValueType(), cols);
									double dNoDataValue = dgU.GetNoDataValue();
									double dValueU = dNoDataValue;
									double dValueV = dNoDataValue;
									int uvCount = dsTarget.GetDatasetCount();
									if(uvCount % 2 != 0)
									{
										continue;
										/*LogTool.logger.error("日最大风处理错误：u、v数据集个数不匹配");
										return;*/
									}
									for (int j = 0; j<rows; j++)
						            {
										dgU.GetScanline(0, j, slU);
										dgV.GetScanline(0, j, slV);
										for(int k1 = 0; k1< cols; k1++){							
											dValueU = dNoDataValue;
											dValueV = dNoDataValue;
											double dWindSpeedMax = 0.0;
											for(int l=0; l<uvCount; l+=2){
												DatasetRaster dgTempU = (DatasetRaster)dsTarget.GetDataset(l);   //第一个是u，第二个是v
												DatasetRaster dgTempV = (DatasetRaster)dsTarget.GetDataset(l+1);
												double u = dgTempU.GetValue(k1, j);
												double v = dgTempV.GetValue(k1, j);											
												if(u == dNoDataValue || v == dNoDataValue)
													continue;
												double dWindSpeed = Math.sqrt(u*u + v*v);
												if(dWindSpeed > dWindSpeedMax)
												{
													dWindSpeedMax = dWindSpeed;
													dValueU = u;
													dValueV = v;
												}
											}
											slU.SetValue(k1, dValueU);
											slV.SetValue(k1, dValueV);
										}								
		    							dgU.SetScanline(0, j, slU);
		    							dgV.SetScanline(0, j, slV);
						            }
									slU.Destroy();
									slV.Destroy();
									dgU.FlushCache();
		    						dgU.CalcExtreme();
		    						dgV.FlushCache();
		    						dgV.CalcExtreme();
								}
								else //常规要素
								{
									//Rectangle2D rcBounds = dg0.GetBounds();
									Rectangle2D rcBounds = new Rectangle2D.Double(m_left, m_bottom, m_width, m_height);
									double dDelta = m_dResolutionX;
									int cols = (int)Math.round(rcBounds.getWidth()/dDelta);
									int rows = (int)Math.round(rcBounds.getHeight()/dDelta);
									String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight()); //左 上 宽 高
									String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
											desDatasetNameStatistics, dg0.GetValueType(), cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, dg0.GetNoDataValue());
									DatasetRaster dg = dsMySQL.CreateDatasetRaster(str);
									dg.Open();
									if(dg == null)
									{
										log.error("数据集创建失败:"+desDatasetNameStatistics);
										return;
									}
									
									Scanline sl = new Scanline(dg.GetValueType(), cols);
									double dNoDataValue = dg.GetNoDataValue();
									double dValue = dNoDataValue;							
									for (int r = 0; r<rows; r++)
						            {
										dg.GetScanline(0, r, sl);
										for(int c = 0; c< cols; c++){							
											dValue = dNoDataValue;
											
											for(int l=0; l<dsTarget.GetDatasetCount(); l++){
												DatasetRaster dgTemp = (DatasetRaster)dsTarget.GetDataset(l);
												double dValueTemp = dgTemp.GetValue(c, r);
												if(dValueTemp == dNoDataValue)
													continue;
												if(nStatisticsMethod == 0){ //最大
													if(dValue == dNoDataValue || dValueTemp > dValue)
														dValue = dValueTemp;
												}
												else if(nStatisticsMethod == 1){ //最小
													if(dValue == dNoDataValue || dValueTemp < dValue)
														dValue = dValueTemp;
												}
												else if(nStatisticsMethod == 2){ //求和
													{
														if(dValue == dNoDataValue)
															dValue = dValueTemp;
														else
															dValue += dValueTemp;
													}
												}
											}
											sl.SetValue(c, dValue);
										}								
		    							dg.SetScanline(0, r, sl);
						            }
									dg.FlushCache();
		    						dg.CalcExtreme();
								}
	    						
	    						//清空内存数据源
	    						int memDatasetCount = dsTarget.GetDatasetCount();
	    						for(int l=memDatasetCount - 1; l>=0; l--){
	    							dsTarget.DeleteDataset(dsTarget.GetDataset(l).GetName());
	    						}
	    						
	    						log.info(desDatasetNameStatistics + "成功完成同化");
							}
						}
						
					} catch (Exception e) {
						e.printStackTrace();
					}
					dr.Close();
				} else {
					log.info(desDatasetName + "已经同化过，无需同化");
				}
			}
		}
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
		}
	}
	
	public void delete(Date date)
	{
		try {
			Datasource dsMySQL = getDatasource();
			if(dsMySQL == null)
				return;
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyMMddHH");
			String dateStr = sdf.format(date);			
			String prefix = String.format("t_%s_%s", ReadWarm.m_strType, ReadWarm.m_strElement);
			String prefixLow = prefix.toLowerCase();
			int dsCount = dsMySQL.GetDatasetCount();
			ArrayList<String> arrayDataset = new ArrayList<String>();
			for(int i=dsCount - 1; i>=0; i--)
			{
				Dataset dt = dsMySQL.GetDataset(i);
				if(dt == null)
					continue;
				String strDatasetName = dt.GetName();				
				if(strDatasetName.toLowerCase().startsWith(prefixLow))
				{
					String[] strs = strDatasetName.split("_");
					if(strs.length >= 8)
					{
						if(strs[5].compareTo(dateStr)<0)
							arrayDataset.add(strDatasetName);
					}					
				}
			}
			for(int i=0; i<arrayDataset.size(); i++)
			{
				String strDatasetName = arrayDataset.get(i);
				dsMySQL.DeleteDataset(strDatasetName);
				log.info(strDatasetName+"已删除");
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			
		}
	}
	
	public void destroy(){
		m_workspace.Destroy();
	}
	
	class ProgressChangedEventListener implements MGEventListener
	{
		public int GetEventID()
		{
			return MGEventObject.MGE_ProgressChanged;
		}
		public void Fire(MGEventObject e)
		{
			ProgressChangedEventObject pceo = (ProgressChangedEventObject)e;
			System.out.println(pceo.GetJson());
		}
	}

}
