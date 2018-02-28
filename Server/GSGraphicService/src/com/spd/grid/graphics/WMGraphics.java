package com.spd.grid.graphics;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoPoint;
import com.mg.objects.GeoRegion;
import com.mg.objects.GeoText;
import com.mg.objects.Geometry;
import com.mg.objects.Graphics;
import com.mg.objects.Image;
import com.mg.objects.Layer;
import com.mg.objects.Layout;
import com.mg.objects.Map;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.grid.domain.Legend;

/*
 * 图形化
 * 流程：
 * 		1-打开白板图；
 *		2-根据站点数据，生成（内存）矢量数据集；
 *		3-插值-提取等值线色斑图-省界裁剪
 *		4-等值线色斑图显示；
 *		5-添加标题和图例，输出图片。
 * */
public class WMGraphics {
	private Workspace m_workspace;
	private String m_outputPath;
	private String classPath;
	private String m_areaCode;
	private String m_areaName;
	private String m_departName;
	
	public void run(List data, String elementName, String areaCode, String areaName, String departName, Date dtStart, Date dtEnd, Boolean bShowValue, 
			Double dthreshold, String outputPath,String strElement,List<Legend> lsLegend,String strUnit)
	{		
		try{
			String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
			classPath=classPath.substring(1);			
			m_outputPath = outputPath;
			m_areaCode = areaCode;
			m_areaName = areaName;
			m_departName = departName;
			
			m_workspace = new Workspace();
			m_workspace.LoadSymbol(classPath + "../data/symbol/test_symbol.svg");
			m_workspace.LoadSymbol(classPath + "../data/symbol/test_picture_symbol.svg");
			m_workspace.LoadSymbol(classPath + "../data/symbol/test_symbol_for_line.svg");
			m_workspace.LoadLineSymbol(classPath + "../data/symbol/test_line_symbol.xml");
			m_workspace.LoadSymbol(classPath + "../data/symbol/test_symbol_for_fill.svg");
			m_workspace.LoadFillSymbol(classPath + "../data/symbol/test_fill_symbol.xml");
			
			//创建内存数据源
			String strConnectionInfo = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"\"}", "Memory","dsMem");
			Datasource datasource = m_workspace.CreateDatasource(strConnectionInfo);
			
			//List转矢量数据集
			DatasetVector dtvStation = convertToDataset(datasource, data, elementName);
			if(dtvStation == null){
				this.destroy();
				return;	
			}				
			
			//打开行政区划数据，获取插值范围
			Dataset dtInterpaltionBounds = null;
			Rectangle2D rcInterpaltionBounds = null;
			String str = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", "dsClip", classPath + "../data/T_ADMINDIV_PROVINCE.shp");
			Datasource dsInterpaltionBounds = m_workspace.OpenDatasource(str);
			if(dsInterpaltionBounds != null)
			{
				dtInterpaltionBounds = dsInterpaltionBounds.GetDataset(0);
				rcInterpaltionBounds = dtInterpaltionBounds.GetBounds();
				rcInterpaltionBounds = new Rectangle2D.Double(dtInterpaltionBounds.GetBounds().getX()-0.5, dtInterpaltionBounds.GetBounds().getY()-0.5, dtInterpaltionBounds.GetBounds().getWidth()+1, dtInterpaltionBounds.GetBounds().getHeight()+1);
			}
			str = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", "dsCity", classPath + "../data/T_ADMINDIV_CITY.shp");
			Datasource dsCity = m_workspace.OpenDatasource(str);
			str = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", "dsCounty", classPath + "../data/T_ADMINDIV_COUNTY.shp");
			Datasource dsCounty = m_workspace.OpenDatasource(str);
			
			//插值
			DatasetRaster dg = Interpaltion(m_workspace, datasource, dtvStation, elementName, rcInterpaltionBounds);
			//DatasetRaster dg = InterpaltionKriging(m_workspace, datasource, dtvStation, elementName, rcClipBounds);

			//提取等值线
			if(dg != null)
			{
				String contourValues = "";
				for(Legend legend:lsLegend){
					contourValues += legend.getV()+" ";
				}
				contourValues = contourValues.trim();
				//String contourValues = "0.1 10.0 25.0 50.0 100.0 250.0";
				DatasetVector dtvContour = getContour(m_workspace, datasource, dg, contourValues);
				if(dtvContour != null)
				{					
					DatasetVector dtvIsoSurface = this.polygonizer(m_workspace, datasource, dtvContour, dg, null);
					//DatasetVector dtvIsoSurface = this.getIsoSurface(m_workspace, datasource, dtvContour, dg);
					if(dtvIsoSurface != null)
					{	
						//获取裁剪数据集
						Geometry geoClip = null;
						Dataset dtClip = null;
						if(areaCode.length() == 2) //省级
							dtClip = dtInterpaltionBounds;
						else{
							String strJson = "{\"Name\":\"dtClip\",\"Type\":\"Region\"}";
							dtClip = datasource.CreateDatasetVector(strJson);
							dtClip.SetProjection(dtInterpaltionBounds.GetProjection().GetParams());
							((DatasetVector)dtClip).AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","ID","Int16","ID"));
							DatasetVector dtAdmin = (DatasetVector)(areaCode.length()==4?dsCity.GetDataset(0):dsCounty.GetDataset(0));  //市县级
							strJson = String.format("{\"Where\":\"[CODE]='%s'\"}", areaCode);							
							Recordset rs = dtAdmin.Query(strJson, null);
							if(rs != null){
								if(rs.GetRecordCount() > 0){
									rs.MoveFirst();
									geoClip = rs.GetGeometry();
									
									Recordset rsClip = ((DatasetVector)dtClip).Query("", null);
									rsClip.AddNew(geoClip);
									rsClip.SetFieldValue("ID", 1);
									rsClip.Update();
									rsClip.Destroy();
									dtClip.SetBounds(geoClip.GetBounds());
								}
								rs.Destroy();
							}
						}
						
						if(dtClip != null){
							DatasetVector dtIsoSurfaceClip = this.clipDatasetVector(m_workspace, datasource, dtvIsoSurface, dtClip);
							normFiledValue(dtIsoSurfaceClip);
//							if(bRemoveZero)
//								removeZero(dtvStation, elementName);
//							if(areaCode.length() > 2)
//								removeOtherArea(dtvStation, areaCode);
							filterByThreshold(dtvStation, elementName, dthreshold);
							if(areaCode.length() > 2)
								removeOtherArea2(dtvStation, (GeoRegion)geoClip);
							outputImage(datasource, dtvStation, elementName, dtIsoSurfaceClip, dtStart, dtEnd, bShowValue,strElement,lsLegend,strUnit);	
						}						
					}
				}											
			}
			destroy();
		}
		catch(Exception e){
			e.printStackTrace();
		}
		this.destroy();
	}
	
	//规范化字段值
	private void normFiledValue(DatasetVector dtv){
		if(dtv == null)
			return;
		Double[] dValues = {0.1, 10.0, 25.0, 50.0, 100.0, 250.0, 1000.0};
		Recordset rs = dtv.Query("", null);
		if(rs.GetRecordCount() > 0){
			rs.MoveLast();
			while(!rs.IsBOF()){
				double dMinValue = Double.valueOf(rs.GetFieldValue("MGMinValue").toString());
				if(dMinValue == -9999){
					double dMaxValue = Double.valueOf(rs.GetFieldValue("MGMaxValue").toString());	
					for(int i=0; i<dValues.length; i++){
						if(dMaxValue<=dValues[i]){
							if(i==0)
								rs.Delete();
							else
								rs.SetFieldValue("MGMinValue", i==0?0.0:dValues[i-1]);						
							break;
						}
					}
				}
				rs.MovePrev();
			}
			rs.Update();	
		}		
		rs.Destroy();
	}
	
	//通过阈值过滤
	private void filterByThreshold(DatasetVector dtv, String element, Double dThreshold){
		if(dtv == null)
			return;
		Recordset rs = dtv.Query("", null);
		rs.MoveLast();
		while(!rs.IsBOF()){
			double dValue = Double.valueOf(rs.GetFieldValue(element).toString());
			if(dValue < dThreshold){
				rs.Delete();
			}
			else
				rs.MovePrev();
		}
		rs.Update();
		rs.Destroy();
	}
	
	//删除降水量为0的站点
	private void removeZero(DatasetVector dtv, String element){
		if(dtv == null)
			return;
		Recordset rs = dtv.Query("", null);
		rs.MoveLast();
		while(!rs.IsBOF()){
			double dValue = Double.valueOf(rs.GetFieldValue(element).toString());
			if(dValue < 0.1){
				rs.Delete();
			}
			else
				rs.MovePrev();
		}
		rs.Update();
		rs.Destroy();
	}
	
	
	//删除其他区域
	private void removeOtherArea(DatasetVector dtv, String areaCode){
		if(dtv == null)
			return;
		Recordset rs = dtv.Query("", null);
		rs.MoveLast();
		int n = rs.GetRecordCount();
		while(!rs.IsBOF()){
			String code = rs.GetFieldValue("areaCode").toString();
			if(!code.startsWith(areaCode)){
				rs.Delete();
			}
			else
				rs.MovePrev();
		}
		n = rs.GetRecordCount();
		rs.Update();
		rs.Destroy();
	}
	
	//删除其他区域
	private void removeOtherArea2(DatasetVector dtv, GeoRegion geo){
		if(dtv == null)
			return;
		String strJson = "{\"SpatialRel\":\"Contain\"}";
		Recordset rs = dtv.Query(strJson, geo);
		rs.MoveLast();
		List<Integer> ids = new ArrayList<Integer>();
		while(!rs.IsBOF()){
			ids.add(rs.GetID());
			rs.MovePrev();
		}
		rs.Destroy();
		
		rs = dtv.Query("", null);
		rs.MoveLast();
		while(!rs.IsBOF()){
			if(!ids.contains(rs.GetID())){
				rs.Delete();
			}
			else
				rs.MovePrev();
		}
		rs.Update();
		rs.Destroy();
	}
	
	private DatasetVector convertToDataset(Datasource ds, List data, String elementName){
		DatasetVector dtv = null;
		try{
			if(data == null || data.size() == 0)
				return null;
			String strJson = "{\"Name\":\"dtData\",\"Type\":\"Point\"}";
			dtv = ds.CreateDatasetVector(strJson);
			if(dtv != null)
			{
				dtv.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
				dtv.AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","StationNum","Text","StationNum"));
				dtv.AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","areaCode","Text","areaCode"));
				dtv.AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","Lon","Double","Lon"));
				dtv.AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","Lat","Double","Lat"));
				dtv.AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}",elementName,"Double",elementName));
				Recordset rs = dtv.Query("", null);
				Double dMinX = 180.0;
				Double dMaxX = -180.0;
				Double dMinY = 90.0;
				Double dMaxY = -90.0;
				for(int i=0; i< data.size(); i++){
					HashMap d = (HashMap)data.get(i);
					String areaCode = d.get("areaCode").toString();
					Double x = Double.valueOf(d.get("Lon").toString());
                    Double y = Double.valueOf(d.get("Lat").toString());
                    Double dValue = Double.valueOf(d.get(elementName).toString());
                    if(x < -180 || x > 180 || y < -90 || y > 90)
                    	continue;
					GeoPoint gp = new GeoPoint(x, y);
					rs.AddNew(gp);
					rs.SetFieldValue("areaCode", areaCode);
					rs.SetFieldValue(elementName, dValue);
					rs.Update();
					
					if(x < dMinX)
                    	dMinX = x;
                    if(x > dMaxX)
                    	dMaxX = x;
                    if(y < dMinY)
                    	dMinY = y;
                    if(y > dMaxY)
                    	dMaxY = y;
				}
				dtv.SetBounds(new Rectangle2D.Double(dMinX, dMinY, dMaxX - dMinX, dMaxY - dMinY));
                rs.Destroy();
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return dtv;
	}
	
	private DatasetRaster Interpaltion(Workspace ws, Datasource ds, DatasetVector dtv, String fieldName, Rectangle2D rc)
	{
		DatasetRaster drResult = null;
		try
		{
			Analyst pAnalystInterpolation = Analyst.CreateInstance("IDW", ws);
			pAnalystInterpolation.Lock("ProgressChanged"); //多线程与并发，需要屏蔽该事件，否则崩溃
			String str = "{\"Datasource\":\"" + dtv.GetDatasource().GetAlias() + "\",\"Dataset\":\"" + dtv.GetName() + "\"}";
			pAnalystInterpolation.SetPropertyValue("Point", str);				
			pAnalystInterpolation.SetPropertyValue("Field", fieldName);	
			if(rc == null)
				rc = dtv.GetBounds();
			str = String.format("{\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f}", rc.getMinX(), rc.getMinY(), rc.getMaxX(), rc.getMaxY());
			pAnalystInterpolation.SetPropertyValue("Bounds", str);
			
			pAnalystInterpolation.SetPropertyValue("CellSize", m_areaCode.length()==2?"0.05 0.05":"0.02 0.02"); //精确就0.02，粗略就0.1
			pAnalystInterpolation.SetPropertyValue("CellValueType", "Single");
			
			pAnalystInterpolation.SetPropertyValue("SearchMode", "RadiusVariable");
			str = String.format("{\"PointCount\":%d,\"MaxRadius\":%d}", 6, 0);
			pAnalystInterpolation.SetPropertyValue("RadiusVariable", str);
			
//			pAnalystInterpolation.SetPropertyValue("SearchMode", "FixedRadius");
//			str = String.format("{\"Radius\":%d,\"MinPointCount\":%d}", 1, 0);
//			pAnalystInterpolation.SetPropertyValue("FixedRadius", str);		
			
			pAnalystInterpolation.SetPropertyValue("Power", "6");				
			pAnalystInterpolation.SetPropertyValue("CrossValidation", "false"); //是否交叉验证，默认值为false
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"TextData_Raster\"}", ds.GetAlias());
			pAnalystInterpolation.SetPropertyValue("Raster", str);
			
			//pAnalystInterpolation.AddListener(new ProgressChangedEventListener());
			pAnalystInterpolation.Execute();
			//当决定系数越接近1时，表示相关的方程式参考价值越高。
			//System.out.println(pAnalystInterpolation.GetPropertyValue("CrossValidationResult")); //平均误差,平均绝对误差,均方根误差,决定系数
			pAnalystInterpolation.Destroy();
			drResult = (DatasetRaster)ds.GetDataset("TextData_Raster"); 
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return drResult;
	}
	
	//克里金插值
	private DatasetRaster InterpaltionKriging(Workspace ws, Datasource ds, DatasetVector dtv, String fieldName, Rectangle2D rc)
	{
		DatasetRaster drResult = null;
		try
		{
			//插值站点到格点
            Analyst pAnalyst = Analyst.CreateInstance("OrdinaryKriging", ws);
            String str = "{\"Datasource\":\"" + ds.GetAlias() + "\",\"Dataset\":\"" + dtv.GetName() + "\"}";
            pAnalyst.SetPropertyValue("Point", str);

            pAnalyst.SetPropertyValue("Field", fieldName);

            if(rc == null)
				rc = dtv.GetBounds();
			str = String.format("{\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f}", rc.getMinX(), rc.getMinY(), rc.getMaxX(), rc.getMaxY());
            pAnalyst.SetPropertyValue("Bounds", str);

            pAnalyst.SetPropertyValue("CellSize", "0.1");
            pAnalyst.SetPropertyValue("CellValueType", "Single");

            pAnalyst.SetPropertyValue("SearchMode", "RadiusVariable");
            str = String.format("{\"PointCount\":%d,\"MaxRadius\":%d}", 6, 0);
            pAnalyst.SetPropertyValue("RadiusVariable", str);
            //pAnalyst.SetPropertyValue("SearchMode", "RadiusFixed");
            //str = String.Format("\"Radius\":{0},\"MinPointCount\":{1}", 5);
            //pAnalyst.SetPropertyValue("RadiusFixed", "{" + str + "}");

            pAnalyst.SetPropertyValue("SemiVariogramModel", "Spherical"); //半变异函数模型,支持:Spherical,Exponential,Gaussian
            pAnalyst.SetPropertyValue("Range", "0.5"); //变程(Range)：区域化变量在空间上具有相关性的范围。
            pAnalyst.SetPropertyValue("Nugget", "0.01"); //块金值(Nugget)：相当于变量纯随机性的部分。 
            pAnalyst.SetPropertyValue("Sill", "0.5"); //基台值(Sill)：变量在空间上的总变异性大小；块金值和拱高之和
            
            pAnalyst.SetPropertyValue("Power", "4");				
            pAnalyst.SetPropertyValue("CrossValidation", "false"); //是否交叉验证，默认值为false
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"TextData_Raster\"}", ds.GetAlias());
			pAnalyst.SetPropertyValue("Raster", str);
            
            pAnalyst.Execute();
            pAnalyst.Destroy();
			drResult = (DatasetRaster)ds.GetDataset("TextData_Raster"); 
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return drResult;
	}
	
	private DatasetVector getContour(Workspace ws, Datasource ds, DatasetRaster dg, String contourValues)
	{
		DatasetVector dtvResult = null;
		dg.CalcExtreme();
		Analyst pAnalyst = Analyst.CreateInstance("Contour", ws);
		String str = "{\"Datasource\":\"" + ds.GetAlias() + "\",\"Dataset\":\"" + dg.GetName() + "\"}";
		pAnalyst.SetPropertyValue("Raster", str);
		if(contourValues == null || contourValues.length() == 0)
		{
			double d = (int)dg.GetMinValue();
			double dStep = 2.0;
			double dMax = dg.GetMaxValue();
			contourValues = "";
			while (d <= dMax)
			{
				contourValues += String.format("%f", d);
				contourValues += " ";
				d += dStep;
			}	
		}		
		pAnalyst.SetPropertyValue("Values", contourValues);				
		pAnalyst.SetPropertyValue("Smoothness", "5");				
		str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"dtContour\"}", ds.GetAlias());
		pAnalyst.SetPropertyValue("Contour", str);
		pAnalyst.Execute();
		pAnalyst.Destroy();
		
		Dataset dtContour = ds.GetDataset("dtContour");
		if(dtContour != null)
		{
			dtvResult = (DatasetVector)dtContour;
		}
		return dtvResult;
	}
	
	private DatasetVector getIsoSurface(Workspace ws, Datasource ds, Dataset dtContour, DatasetRaster dg)
	{
		DatasetVector dtv = null;
		try
		{
			dg.CalcExtreme();
			Analyst pAnalyst = Analyst.CreateInstance("FilledContour", ws);
			String str =String.format( "{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dtContour.GetDatasource().GetAlias(), dtContour.GetName());
			pAnalyst.SetPropertyValue("Contour", str);
			str = "{\"Datasource\":\"" + dg.GetDatasource().GetAlias() + "\",\"Dataset\":\"" + dg.GetName() + "\"}";
	        pAnalyst.SetPropertyValue("Ref", str);
	        str = String.format("{\"Name\":\"ZValue\",\"MinValue\":%f,\"MaxValue\":%f}", dg.GetMinValue() - 1.0, dg.GetMaxValue() + 1.0);
	        pAnalyst.SetPropertyValue("Field", str);
	        String strDatasetName = "dtIsoSurface";
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", ds.GetAlias(), strDatasetName);
			pAnalyst.SetPropertyValue("FilledContour", str);
			pAnalyst.Execute();
			pAnalyst.Destroy();
			Dataset dt = ds.GetDataset(strDatasetName);
			if(dt != null)
				dtv = (DatasetVector)dt;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return dtv;
	}
	
	/*
	 *提取有效边界线
	 * */
	private Dataset getValidBorder(Workspace ws, Datasource dsOutput, DatasetRaster dr)
	{
		Dataset dtResult = null;
		try
		{
			Analyst pAnalyst = Analyst.CreateInstance("Contour", ws);
			String str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dr.GetDatasource().GetAlias(), dr.GetName());
			pAnalyst.SetPropertyValue("Raster", str);
			pAnalyst.SetPropertyValue("Values", String.valueOf(dr.GetNoDataValue()));
			pAnalyst.SetPropertyValue("Smoothness", "0");
			
			String strDatasetName = "dtValidBorder";
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsOutput.GetAlias(), strDatasetName);
			//pAnalyst.SetPropertyValue("Contour", str);   //这个是提取等值线
			pAnalyst.SetPropertyValue("ValidBorder", str); //这个是提取有效边界
			
			pAnalyst.Execute();
			pAnalyst.Destroy();
			
			dtResult = dsOutput.GetDataset(strDatasetName);
	}
	catch(Exception e)
	{
		e.printStackTrace();
	}
	return dtResult;
	}
	
	/*
	 * 拓扑构面
	 * */
	private DatasetVector polygonizer(Workspace ws, Datasource dsOutput, DatasetVector dtvLine, DatasetRaster dr, Dataset dtValidBorder)
	{
		DatasetVector dtv = null;
		try
		{
			if(dtValidBorder == null)
			{
				dtValidBorder = this.getValidBorder(ws, dtvLine.GetDatasource(), dr); //提取有效边界
			}
			Analyst pAnalyst = Analyst.CreateInstance("Polygonizer", ws);
			String str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dtvLine.GetDatasource().GetAlias(), dtvLine.GetName());
			pAnalyst.AddPropertyValue("Input", str);
			if(dtValidBorder != null)
			{
				str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dtValidBorder.GetDatasource().GetAlias(), dtValidBorder.GetName());
				pAnalyst.AddPropertyValue("Input", str);	
			}				
			
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dr.GetDatasource().GetAlias(), dr.GetName());
			pAnalyst.SetPropertyValue("Ref", str);
			
			pAnalyst.SetPropertyValue("Field", String.format("{\"Name\":\"ZValue\",\"MinValue\":%f,\"MaxValue\":%f,\"NoDataValue\":%f}", dr.GetMinValue(), dr.GetMaxValue(), dr.GetNoDataValue()));
			//pAnalyst.SetPropertyValue("Field", String.format("{\"Name\":\"ZValue\",\"MinValue\":%f,\"MaxValue\":%f,\"NoDataValue\":%f}", dr.GetMinValue(), dr.GetMaxValue(), 9999.0));
			
			String strDatasetName = "dtIsoSurface";
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsOutput.GetAlias(), strDatasetName);
			pAnalyst.SetPropertyValue("Output", str);
			pAnalyst.Execute();
			pAnalyst.Destroy();

			Dataset dt = dsOutput.GetDataset(strDatasetName);
			if(dt != null)
				dtv = (DatasetVector)dt;
			
//			//test 输出到SHP文件
//			str = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", "dsSHP", "c:/temp/dsIsoSurface.shp");
//			Datasource dsIsoSurface = m_workspace.CreateDatasource(str);
//			String strJson = "{\"Name\":\"dtIsoSurface\",\"Type\":\"Region\"}";
//			Dataset dtIsoSurface = dsIsoSurface.CreateDatasetVector(strJson);
//			dtIsoSurface.SetProjection(dtv.GetProjection().GetParams());
//			((DatasetVector)dtIsoSurface).AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","MGMinValue","Single","MGMinValue"));
//			((DatasetVector)dtIsoSurface).AddField(String.format("{\"Name\":\"%s\",\"Type\":\"%s\",\"ForeignName\":\"%s\"}","MGMaxValue","Single","MGMaxValue"));							
//			Recordset rsISO = ((DatasetVector)dtIsoSurface).Query("", null);
//			Recordset rs = dtv.Query("", null);
//			if(rs.GetRecordCount() > 0){
//				rs.MoveFirst();
//				while(!rs.IsEOF()){						
//					rsISO.AddNew(rs.GetGeometry());
//					rsISO.SetFieldValue("MGMinValue", rs.GetFieldValue("MGMinValue"));
//					rsISO.SetFieldValue("MGMaxValue", rs.GetFieldValue("MGMaxValue"));
//					rsISO.Update();	
//					rs.MoveNext();
//				}
//			}
//			rsISO.Destroy();
//			rs.Destroy();
//			m_workspace.CloseDatasource(dsIsoSurface.GetAlias());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return dtv;
	}
	
	private DatasetVector clipDatasetVector(Workspace ws, Datasource dsOutput, DatasetVector dtv, Dataset dtClip)
	{
		DatasetVector dtvResult = null;
		if(dtClip != null)
		{
			Analyst pAnalyst = Analyst.CreateInstance("Clip", ws); //A裁剪B
			String str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\",\"Where\":\"[ID]=1\"}", dtClip.GetDatasource().GetAlias(), dtClip.GetName());
			pAnalyst.SetPropertyValue("A", str);
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dtv.GetDatasource().GetAlias(), dtv.GetName());
			pAnalyst.SetPropertyValue("B", str);
			String strClipDatasetName =  dtv.GetName() + "_Clip";
			str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsOutput.GetAlias(), strClipDatasetName);
			pAnalyst.SetPropertyValue("Output", str);
			pAnalyst.Execute();
			pAnalyst.Destroy();
			Dataset dtResult = dsOutput.GetDataset(strClipDatasetName);
			if(dtResult != null)
				dtvResult = (DatasetVector)dtResult;
		}
		else
		{
			dtvResult = dtv; //返回原数据
		}	
		return dtvResult;
	}
	
	//复制数据集
	//参数：dtv：源数据，filter：过滤查询条件，ds：输出数据源
	private DatasetVector copyDataset(Dataset dt, String filter, Datasource ds){
		DatasetVector result = null;
		try{
			DatasetVector dtv = (DatasetVector)dt;
			String strJson = String.format("{\"Name\":\"%s\",\"Type\":\"%s\"}", dtv.GetName(), dtv.GetType());
			result = ds.CreateDatasetVector(strJson);
			result.SetProjection(dtv.GetProjection().GetParams());
			
			strJson = dtv.GetFields();
			JSONArray ja = new JSONArray(strJson); 
			for (int i = 0; i < ja.length(); i++) 
			{
				JSONObject j = ja.getJSONObject(i);
				result.AddField(j.toString());
			}
			
			Recordset rs = dtv.Query(filter, null);
			Recordset rsResult = result.Query("", null);
			if(rs != null){
				if(rs.GetRecordCount() > 0){					
					rs.MoveFirst();
					while(!rs.IsEOF()){
						Geometry geo = rs.GetGeometry();
						rsResult.AddNew(geo);
						for (int i = 0; i < ja.length(); i++) 
						{
							JSONObject j = ja.getJSONObject(i);
							rsResult.SetFieldValue(j.getString("Name"), rs.GetFieldValue(j.getString("Name")));
						}
						rsResult.Update();
						rs.MoveNext();
					}
				}
				rsResult.Destroy();
				rs.Destroy();
			}
		}
		catch(Exception e){
			System.out.println(e.getMessage());
		}
		return result;
	}

	//出图
	private String outputImage(Datasource datasource, DatasetVector dtvPoint, String elementName, DatasetVector dtv, Date dtStart, Date dtEnd, Boolean bShowValue,
			String strElement,List<Legend> lsLegend,String strUnit) throws IOException, JSONException {
		String result = "";
		try {
			
			//创建地图
			Point2D ptViewport = new Point2D.Double(1024, 768);
			Map pMap = new Map();
			m_workspace.InsertMap(pMap, -1);
			//pMap.SetBackgroundStyle("{\"BackColor\":\"RGBA(0,0,0,0)\",\"ForeColor\":\"RGBA(255,255,255,0)\",\"SymbolID\":0}");
			pMap.SetName("test");
			pMap.SetSize((int)ptViewport.getX(), (int)ptViewport.getY()); //设备尺寸
			pMap.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");	
			
			Layer pLayer = Layer.CreateInstance("VectorRange", m_workspace);
			pLayer.SetDataset(dtv);			
			pLayer.SetPropertyValue("RangeExpression", "MGMinValue");			
			pLayer.SetPropertyValue("FilledContour", "false");			
			
//			String str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",10.0, 152,251,152);
//			pLayer.AddPropertyValue("VectorRangeItem", str);
//			str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",25.0, 34,139,34);
//			pLayer.AddPropertyValue("VectorRangeItem", str);
//			str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",50.0, 92,172,238);
//			pLayer.AddPropertyValue("VectorRangeItem", str);
//			str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",100.0, 0,0,205);
//			pLayer.AddPropertyValue("VectorRangeItem", str);
//			str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",200.0, 238,0,238);
//			pLayer.AddPropertyValue("VectorRangeItem", str);
//			str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",500.0, 139,0,0,255);
//			pLayer.AddPropertyValue("VectorRangeItem", str);			
			String str = "";
			for(Legend legend:lsLegend){
				double val = legend.getV();
				int r = legend.getR();
				int g = legend.getG();
				int b = legend.getB();
				str = String.format("{\"Value\":%f,\"FillStyle\":{\"ForeColor\":\"RGB(%d,%d,%d)\"}}",val, r,g,b);
				pLayer.AddPropertyValue("VectorRangeItem", str);
			}		
			pMap.InsertLayer(pLayer, -1);
	        
	        if (pMap.GetLayerCount() > 0)
			{
				str = pMap.GetLayer(0).GetDataset().GetProjection().GetParams();
				if (str != null && !str.isEmpty())
				{					
					String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
					classPath=classPath.substring(1);
					
					Datasource dsCity = null;
					Datasource dsCounty = null;
					Dataset dtCity = null;
					Dataset dtCounty = null;
					//叠加市级行政区划
					if(m_areaCode.length()<6){
						str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_CITY\",\"Server\":\"" + classPath + "../data/T_ADMINDIV_CITY.shp\"}";
						dsCity = m_workspace.OpenDatasource(str);
						dtCity = dsCity.GetDataset(0);
						if(m_areaCode.length() == 4)
							dtCity = copyDataset(dtCity, String.format("{\"Where\":\"[CODE]='%s'\"}", m_areaCode), datasource);
						pLayer = Layer.CreateInstance("Region", m_workspace);
						pLayer.SetDataset(dtCity);
						pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(150,150,150)\",\"Width\":1}"); //如果线宽为0，不绘制线
		                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
						pMap.InsertLayer(pLayer, -1);	
					}	
					
					//叠加县级行政区划
					str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_COUNTY\",\"Server\":\"" + classPath + "../data/T_ADMINDIV_COUNTY.shp\"}";
					dsCounty = m_workspace.OpenDatasource(str);
					dtCounty = dsCounty.GetDataset(0);
					if(m_areaCode.length() == 4)
						dtCounty = copyDataset(dtCounty, String.format("{\"Where\":\"[PCODE]='%s'\"}", m_areaCode), datasource);
					else if(m_areaCode.length() == 6)
						dtCounty = copyDataset(dtCounty, String.format("{\"Where\":\"[CODE]='%s'\"}", m_areaCode), datasource);
					pLayer = Layer.CreateInstance("Region", m_workspace);
					pLayer.SetDataset(dtCounty);
					pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(200,200,200)\",\"Width\":1}"); //如果线宽为0，不绘制线
	                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
					pMap.InsertLayer(pLayer, -1);	
					
					//叠加标注
//					if(m_areaCode.length() == 2)
//						str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_CITY\",\"Server\":\""+classPath + "../data/T_ADMINDIV_CITY.shp\"}";
//					else if(m_areaCode.length() == 4)
//						str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_COUNTY\",\"Server\":\""+classPath + "../data/T_ADMINDIV_COUNTY.shp\"}";
//					else
//						str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_COUNTY\",\"Server\":\""+classPath + "../data/T_ADMINDIV_COUNTY.shp\"}";
//					pds = m_workspace.OpenDatasource(str);
//					pDataset = pds.GetDataset(0);
					pLayer = Layer.CreateInstance("Label", m_workspace);
		            pLayer.SetDataset(m_areaCode.length() == 2?dtCity:dtCounty);
		            pLayer.SetPropertyValue("LabelExpression", "NAME");
		            pLayer.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"MiddleCenter\",\"ForeColor\":\"RGB(60,60,60)\",\"FontSize\":3.8,\"Weight\":0.6}".getBytes("UTF-8")));
		            pMap.InsertLayer(pLayer, -1);
		            
//		            //叠加填值图层
//					drMem.SetNoDataValue(0.0);
//			        pLayer = Layer.CreateInstance("ScalarField", m_workspace);
//			        pLayer.SetDataset(drMem);
//			        pLayer.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"ForeColor\":\"RGB(60,60,60)\"}".getBytes("UTF-8")));
//			        pLayer.SetPropertyValue("Format", "%.1f");
//			        pMap.InsertLayer(pLayer, -1);
			        
//			      	//叠加遮罩图层
//					str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_MapErase\",\"Server\":\""+classPath + "../data/T_MapErase.shp\"}";
//					pds = m_workspace.OpenDatasource(str);
//					pDataset = pds.GetDataset(0);
//					pLayer = Layer.CreateInstance("Region", m_workspace);
//					pLayer.SetDataset(pDataset);
//					pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(0,0,0,0)\",\"Width\":0}"); //如果线宽为0，不绘制线
//	                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(255,255,255,255)\"}");
//					pMap.InsertLayer(pLayer, -1);
					
					//叠加省级行政区划
		            if(m_areaCode.length() == 2){
		            	str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_ADMINDIV_PROVINCE\",\"Server\":\""+classPath + "../data/T_ADMINDIV_PROVINCE.shp\"}";
						Datasource dsProvince = m_workspace.OpenDatasource(str);
						Dataset dtProvince = dsProvince.GetDataset(0);
						pLayer = Layer.CreateInstance("Region", m_workspace);
						pLayer.SetDataset(dtProvince);
						pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(100, 100, 100)\",\"Width\":2}"); //如果线宽为0，不绘制线
		                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
						pMap.InsertLayer(pLayer, -1);	
		            }
					
//					//叠加等值线
//					pDataset = datasource.GetDataset("dtContour");
//					pLayer = Layer.CreateInstance("Line", m_workspace);
//					pLayer.SetDataset(pDataset);
//					pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(255,0,0)\",\"Width\":2}"); //如果线宽为0，不绘制线
//					pMap.InsertLayer(pLayer, -1);					
					
					//叠加边框
					//str = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\"T_MAPBOUNDS\",\"Server\":\""+classPath + "../data/T_MAPBOUNDS.shp\"}";
					//pds = m_workspace.OpenDatasource(str);
					Rectangle2D rc = dtv.GetBounds();
					double dscale = 1.1;
					rc.setRect(rc.getMinX()-rc.getWidth()*((dscale-1.0)/2.0), rc.getMinY()-rc.getHeight()*((dscale-1.0)/2.0), rc.getWidth()*dscale, rc.getHeight()*dscale);
					pMap.SetBounds(rc);
					rc = pMap.GetBounds();
					str = "{\"Name\":\"dtMAPBOUNDS\",\"Type\":\"Region\"}";					
					DatasetVector dtMAPBOUNDS = (DatasetVector)dtv.GetDatasource().CreateDatasetVector(str);
					dtMAPBOUNDS.SetProjection(dtv.GetProjection().GetParams());
					dtMAPBOUNDS.SetBounds(rc);
					Recordset rs = dtMAPBOUNDS.Query("", null);
					if(rs != null){
							rs.MoveFirst();
							Point2D[] pts = new Point2D[]{new Point2D.Double(rc.getMinX(), rc.getMinY()),
									new Point2D.Double(rc.getMinX()+rc.getWidth(), rc.getMinY()),
									new Point2D.Double(rc.getMinX()+rc.getWidth(), rc.getMinY()+rc.getHeight()),
									new Point2D.Double(rc.getMinX(), rc.getMinY()+rc.getHeight()),
									new Point2D.Double(rc.getMinX(), rc.getMinY())};
							GeoRegion geo = new GeoRegion(pts);
							rs.AddNew(geo);
							rs.Update();
							rs.Destroy();
					}
					pLayer = Layer.CreateInstance("Region", m_workspace);
					pLayer.SetDataset(dtMAPBOUNDS);
					pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":4}"); //如果线宽为0，不绘制线
	                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
					pMap.InsertLayer(pLayer, -1);
					
					//叠加填值		
					if(bShowValue){
						pLayer = Layer.CreateInstance("Plot", m_workspace);
			            pLayer.SetDataset(dtvPoint);
			            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(classPath + "../data/style_rain_plot.xml"), "gbk"));
			            StringBuffer sb = new StringBuffer();
				        while ((str = reader.readLine()) != null) 
				        {
				            sb.append(str);
				        }
						pLayer.FromXML(sb.toString());
						reader.close();
			            pMap.InsertLayer(pLayer, -1);	
					}					
				}
			}
			
			//创建布局
			Layout pLayout = new Layout();
			m_workspace.InsertLayout(pLayout, -1);
			//pLayout.SetBackgroundStyle("{\"BackColor\":\"RGBA(0,0,0,0)\",\"ForeColor\":\"RGBA(255,255,255,0)\",\"SymbolID\":0}");
			pLayout.SetName("test");
			Graphics.DotToMM(ptViewport);
			Rectangle2D rc = new Rectangle2D.Double(0.0, 0.0, ptViewport.getX(), -ptViewport.getY()); //高度为负表示y向下
			pLayout.SetBounds(rc);
			
			//添加地图到布局
			DatasetVector dtvLayout = (DatasetVector)pLayout.GetDatasource().GetDataset(0);
			Recordset rs = dtvLayout.Query(null, null);
			Geometry geo = Geometry.CreateInstance("GeoMap", m_workspace);
			geo.SetBounds(rc);
			geo.SetPropertyValue("MapName", "test");
			rs.AddNew(geo);
			rs.Update();
			//添加图例
			geo = Geometry.CreateInstance("GeoLegend", m_workspace);
			//pg.SetOrigin(rc.getMaxX() - 2, Math.abs(rc.getMaxY()) - 2);
			geo.SetOrigin(2, Math.abs(rc.getMaxY()) - 2);
			//Alignment可取值:TopLeft,TopCenter,TopRight,MiddleLeft,MiddleCenter,MiddleRight,BottomLeft,BottomCenter,BottomRight
			geo.SetPropertyValue("Alignment", "BottomLeft");
			geo.SetPropertyValue("BackgroundStyle", "{\"ForeColor\":\"RGBA(255,255,255,255)\"}");
	        geo.SetPropertyValue("BorderStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":1}");            
	        geo.SetPropertyValue("Margin", "{\"left\":4,\"right\":4,\"top\":6,\"bottom\":2}"); //图例边距，单位毫米
	        geo.SetPropertyValue("ItemInterval", "2 0"); //图例项列行间距，单位毫米
	        geo.SetPropertyValue("ItemTextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"MiddleLeft\",\"ForeColor\":\"RGB(0,0,0)\",\"FontSize\":3.8}".getBytes("UTF-8"))); //尺寸单位为毫米
			rs.AddNew(geo);
			rs.Update();
			//--------------------------------------------------------------------
	        //添加图例项
	        for (int i = 0; i < pMap.GetLayerCount(); i++)
	        {
	        	pLayer = pMap.GetLayer(i);
	            if (pLayer.GetType().equals("RasterRange"))
	            {
	                int nCount = pLayer.GetPropertyValueCount("RasterRangeItem");
	                for (int j = 0; j < nCount; j++)
	                {
	                	str = pLayer.GetPropertyValue("RasterRangeItem", j);
	                	if(j == (nCount - 1)){ 
		                    JSONObject jsonObj = new JSONObject(str);	        			
		        			str = String.format("{\"Type\":\"Region\",\"Caption\":\">%d毫米\",\"FillStyle\":{\"ForeColor\":\"%s\"}}",Math.round(jsonObj.getDouble("Value")), jsonObj.getString("Color"));	
	                	}	                    	                        
	                	else {
	                		String strNext = pLayer.GetPropertyValue("RasterRangeItem", j+1);	
		                    JSONObject jsonObj = new JSONObject(str);
		                    JSONObject jsonObjNext = new JSONObject(strNext);
		        			str = String.format("{\"Type\":\"Region\",\"Caption\":\"%d-%d毫米\",\"FillStyle\":{\"ForeColor\":\"%s\"}}",
		        					Math.round(jsonObj.getDouble("Value")), Math.round(jsonObjNext.getDouble("Value")), jsonObj.getString("Color"));
						}
	                	str = new String(str.getBytes("UTF-8"));
	                    geo.AddPropertyValue("LegendItem", str);
	                }
	                break;
	            }
	            else if (pLayer.GetType().equals("VectorRange"))
	            {
	                int nCount = pLayer.GetPropertyValueCount("VectorRangeItem");
	                for (int j = 0; j < nCount; j++)
	                {
	                	if(j == (nCount - 1)){ 
	                		str = pLayer.GetPropertyValue("VectorRangeItem", j);
		                    JSONObject jsonObj = new JSONObject(str);        			
		        			str = String.format("{\"Type\":\"Region\",\"Caption\":\">%d\",\"FillStyle\":%s}",Math.round(jsonObj.getDouble("Value")), jsonObj.getString("FillStyle"));
	                	}
	                	else{
	                		str = pLayer.GetPropertyValue("VectorRangeItem", j);
		                    JSONObject jsonObj = new JSONObject(str);
		                    String strNext = pLayer.GetPropertyValue("VectorRangeItem", j+1);
		                    JSONObject jsonObjNext = new JSONObject(strNext);
		                    
		        			str = String.format("{\"Type\":\"Region\",\"Caption\":\"%d-%d\",\"FillStyle\":%s}",
		        					Math.round(jsonObj.getDouble("Value")), Math.round(jsonObjNext.getDouble("Value")), jsonObj.getString("FillStyle"));	
	                	}	                    
	                        
	        			str = new String(str.getBytes("UTF-8"));
	                    geo.AddPropertyValue("LegendItem", str);
	                }
	                break;
	            }
	        }
	        
	        
	        //注意编码问题部署在tomcat中的文件要修改file.encoding的值，可以在tomcat的catalina.bat文件中set JAVA_OPTS=%JAVA_OPTS% %LOGGING_CONFIG%的后面加上 -Dfile.encoding="UTF-8"
	        //如下：set JAVA_OPTS=%JAVA_OPTS% %LOGGING_CONFIG% -Dfile.encoding="utf-8"
	        
			//增加标题
	        String strTitle = m_areaName+strElement+"分布图";
	        System.out.println("strTitle");
			if (!strTitle.isEmpty())
			{
				//主标题
				GeoText pGeoText = new GeoText(new String(strTitle.getBytes("UTF-8")));
				pGeoText.SetOrigin(rc.getMaxX()-10, 5);
				pGeoText.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"TopRight\",\"FontSize\":8,\"Weight\":0.6}".getBytes("UTF-8"))); //尺寸单位为毫米
				rs.AddNew(pGeoText);
				rs.Update();
				
				//副标题
			    str = String.format("%02d月%02d日%02d时 - %02d日%02d时\0", dtStart.getMonth()+1,dtStart.getDate(),dtStart.getHours(), dtEnd.getDate(), dtEnd.getHours());
			    pGeoText = new GeoText(new String(str.getBytes("UTF-8")));
			    pGeoText.SetOrigin(rc.getMaxX()-10, 15);
				pGeoText.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"TopRight\",\"FontSize\":6}".getBytes("UTF-8"))); //尺寸单位为毫米
				rs.AddNew(pGeoText);
				rs.Update();
				
				//制作单位和发布时间
				Date makeTime = new Date();
				//str = String.format("兰州中心气象台%s发布", new SimpleDateFormat("yyyy年MM月dd日HH点mm分").format(makeTime));
				//str = "兰州中心气象台";
				System.out.println("m_departName");
				pGeoText = new GeoText(new String(m_departName.getBytes("UTF-8")));
				pGeoText.SetOrigin(rc.getMaxX()-10, Math.abs(rc.getMaxY())-5);
				pGeoText.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"BottomRight\",\"FontSize\":6}".getBytes("UTF-8"))); //尺寸单位为毫米
				rs.AddNew(pGeoText);
				rs.Update();
				
				//图例单位
				str = "(单位:("+strUnit+")";
				pGeoText = new GeoText(str);
				//int offTop = lsLegend.size()*10;
				int offTop = 4+(int)(lsLegend.size()*7.6);
				pGeoText.SetOrigin(27, Math.abs(rc.getMaxY())-offTop);
				pGeoText.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"BottomRight\",\"FontSize\":3.8}".getBytes("UTF-8"))); //尺寸单位为毫米
				rs.AddNew(pGeoText);
				rs.Update();
			}	
			
			rs.Destroy();
			//输出
			//String filename = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
			
			//一个地区/部门一个目录
			String outputPath = m_outputPath + "/" + m_areaCode.toString();
			File dir = new File(outputPath);
			if(!dir.exists())
			{
				if(dir.mkdir())
					System.out.println(outputPath+" mkdir success");
				else
					System.out.println(outputPath+" mkdir faild");
			}
			
			String strFileName = outputPath + "/output.png";
			pLayout.Draw();
			Image image = pLayout.GetGraphics().GetImage();
			if(image.Save(strFileName))
			{
				result = strFileName;
//				//转换为JPG
//				result = m_outputPath+String.format("ZGYB_CTCM_STID_%s_168_%s_QPF_R", new SimpleDateFormat("yyyyMMddHH").format(forecastTime), new DecimalFormat("000").format(hourSpan))+".jpg";
//				ImgConverter.convert(strFileName, "jpg", result);
			}
			
			m_workspace.RemoveMap(pMap.GetName());
			m_workspace.RemoveLayout(pLayout.GetName());
			m_workspace.CloseDatasource(datasource.GetAlias());
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	private void destroy(){
		m_workspace.Destroy();
	}
}