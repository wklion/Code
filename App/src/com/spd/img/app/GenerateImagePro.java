package com.spd.img.app;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.io.FileReader;
import java.nio.file.Files;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.spd.model.ImgTask;
import com.spd.util.DateUtil;
import com.spd.util.FileNameSelector;
import com.weathermap.objects.Analyst;
import com.weathermap.objects.Dataset;
import com.weathermap.objects.DatasetRaster;
import com.weathermap.objects.Datasource;
import com.weathermap.objects.Layer;
import com.weathermap.objects.Map;
import com.weathermap.objects.Workspace;

/**
 * @作者:wangkun
 * @日期:2017年12月18日
 * @公司:spd
 * @说明:
*/
public class GenerateImagePro {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	public void run(Workspace ws,ImgTask imgTask){
		File file = findFile(imgTask);
		String strP = imgTask.getDatePattern();
		Pattern p = Pattern.compile(strP);
		String fileName = file.getName();
		Matcher matcher=p.matcher(fileName);
		if(!matcher.find()){
			System.out.println("没找到");
			return;
		}
		String strDateTime = matcher.group();
		System.out.println(strDateTime);
		DateUtil dateUtil = new DateUtil();
		Calendar cal = dateUtil.parse(imgTask.getTimeFormat(), strDateTime);
		
		String strFile = file.getPath();
		strFile = strFile.replaceAll("\\\\", "/");
		String strJson = "{\"Type\":\"" + imgTask.getType()+ "\",\"Alias\":\"" + fileName + "\",\"Server\":\"" + strFile + "\"}";
		Datasource ds = ws.OpenDatasource(strJson);
		if(ds == null)
			return;
		String targetProj = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
		Dataset dt = ds.GetDataset(0);
		Boolean bProjTransform = false;
		if(!dt.GetProjection().GetParams().equals(targetProj)){
			dt = (DatasetRaster)this.projTransform(ws, dt, targetProj);
			bProjTransform = true;
		}
		if(dt == null)
			return;
		DatasetRaster dr = (DatasetRaster)dt;
		int w = dr.GetWidth();
		int h = dr.GetHeight();
		Layer pLayer = Layer.CreateInstance("RasterRange", ws);
		pLayer.SetDataset(dt);
		Map pMap = new Map();
		ws.InsertMap(pMap, -1);
		pMap.SetName("test");
		Point2D ptViewport = new Point2D.Double(w, h); 
		pMap.SetSize((int)ptViewport.getX(), (int)ptViewport.getY()); //设备尺寸
		pMap.SetProjection(targetProj); // 投影
		pMap.SetBackgroundStyle("{\"BackColor\":\"RGBA(0,0,0,0)\",\"ForeColor\":\"RGBA(255,255,255,0)\",\"SymbolID\":0}"); // 透明
		pMap.InsertLayer(pLayer, -1);
		//叠加行政区域
		//String adminDivision = "E:/GS/Code/Server/GSFlashFlood/WebRoot/WEB-INF/data/T_ADMINDIV_CITY.shp";
		String adminDivision = root+"../data/T_ADMINDIV_CITY.shp";
		String alias = "area";
		strJson = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\""+alias+"\",\"Server\":\"" + adminDivision + "\"}";
		Datasource dsAdminDivision = ws.OpenDatasource(strJson);
		Dataset adminDivisionDataset = dsAdminDivision.GetDataset(0);
		Layer layerAdminDivision = Layer.CreateInstance("Region", ws);
		layerAdminDivision.SetDataset(adminDivisionDataset);
		layerAdminDivision.SetPropertyValue("LineStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":2}"); //如果线宽为0，不绘制线
		layerAdminDivision.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
        pMap.InsertLayer(layerAdminDivision, -1);
		
		Rectangle2D cacheBounds = new Rectangle2D.Double();
		cacheBounds.setRect(88.0, 30.0, 24.0, 15.0);
		pMap.SetBounds(cacheBounds);
		pMap.Draw();
		String opFile = imgTask.getOutputFile();
		File filePng = new File(opFile);
		if(filePng.exists()){
			filePng.delete();
		}
		boolean flag = pMap.GetGraphics().GetImage().Save(opFile);
		if(flag){
			System.out.println("生成成功!");
		}
	}
	private  static File findFile(ImgTask imgTask){
		String sourceDir = imgTask.getSourceDir();
		File dir = new File(sourceDir);
		File[] files = dir.listFiles(new FileNameSelector("tif"));
		return files[files.length-1];
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年12月18日
	 * @修改日期:2017年12月18日
	 * @参数:
	 * @返回:
	 * @说明:投影转换
	 */
	private Dataset projTransform(Workspace ws, Dataset dt, String targetProj) {
		Dataset result = null;
		try {
			if(dt.GetType().equals("Raster")){
				DatasetRaster dr = (DatasetRaster)dt;
				dr.Open();
			}
		Analyst pAnalyst = Analyst.CreateInstance("ProjTransformer", ws);
	        String str = "{\"Datasource\":\"" + dt.GetDatasource().GetAlias() + "\",\"Dataset\":\"" + dt.GetName() + "\"}";
	        pAnalyst.SetPropertyValue("Input", str);
	        pAnalyst.SetPropertyValue("OutputProj", targetProj);
	        str = String.format("{\"Type\":\"Memory\",\"Alias\":\"%s\",\"Server\":\"\"}", "dsProjTransformerResult");
	        Datasource dsResult = ws.CreateDatasource(str);
	        str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsResult.GetAlias(), dt.GetName());
	        pAnalyst.SetPropertyValue("Output", str);
	        pAnalyst.Execute();
	        pAnalyst.Destroy();
	        result = dsResult.GetDataset(dt.GetName());	
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
        return result;
	}
}
