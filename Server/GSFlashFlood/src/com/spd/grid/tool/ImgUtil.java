package com.spd.grid.tool;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;











import org.codehaus.jettison.json.JSONObject;

import sun.misc.BASE64Encoder;

import com.mg.objects.Dataset;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoRegion;
import com.mg.objects.GeoText;
import com.mg.objects.Geometry;
import com.mg.objects.Graphics;
import com.mg.objects.Image;
import com.mg.objects.Layer;
import com.mg.objects.Layout;
import com.mg.objects.Map;
import com.mg.objects.Projection;
import com.mg.objects.Recordset;
import com.mg.objects.Workspace;
import com.spd.grid.domain.Application;

public class ImgUtil {
	String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	public void outputImg(String strFile,String title,String strMakeTime,String strHourspan,Layer layer) throws Exception{
		Workspace ws = Application.m_workspace;
		ws.LoadSymbol(classPath + "../data/symbol/test_symbol.svg");
		ws.LoadSymbol(classPath + "../data/symbol/test_picture_symbol.svg");
		ws.LoadSymbol(classPath + "../data/symbol/test_symbol_for_line.svg");
		ws.LoadLineSymbol(classPath + "../data/symbol/test_line_symbol.xml");
		ws.LoadSymbol(classPath + "../data/symbol/test_symbol_for_fill.svg");
		ws.LoadFillSymbol(classPath + "../data/symbol/test_fill_symbol.xml");
		
		Point2D ptViewport = new Point2D.Double(1024, 768); 
		Map pMap = new Map();
		ws.InsertMap(pMap, -1);
		pMap.SetName("test");
		pMap.SetSize((int)ptViewport.getX(), (int)ptViewport.getY()); //设备尺寸
		pMap.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
		
		pMap.InsertLayer(layer, -1);
		//TestRadarBase(ws,pMap);
		
		Calendar cal = Calendar.getInstance();
		String littleTime = DateUtil.format("HHmmss", cal);
		//叠加行政区域
		String adminDivision = classPath+"../data/T_ADMINDIV_CITY.shp";
		String alias = "adminDivision"+littleTime;
		String strJson = "{\"Type\":\"ESRI Shapefile\",\"Alias\":\""+alias+"\",\"Server\":\"" + adminDivision + "\"}";
		Datasource dsAdminDivision = ws.OpenDatasource(strJson);
		Dataset adminDivisionDataset = dsAdminDivision.GetDataset(0);
		Layer layerAdminDivision = Layer.CreateInstance("Region", ws);
		layerAdminDivision.SetDataset(adminDivisionDataset);
		layerAdminDivision.SetPropertyValue("LineStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":2}"); //如果线宽为0，不绘制线
		layerAdminDivision.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
                pMap.InsertLayer(layerAdminDivision, -1);
                //pMap.SetBounds(adminDivisionDataset.GetBounds());
                
                //叠加边框
                Rectangle2D rc = adminDivisionDataset.GetBounds();
                double dscale = 1.1;
                rc.setRect(rc.getMinX()-rc.getWidth()*((dscale-1.0)/2.0), rc.getMinY()-rc.getHeight()*((dscale-1.0)/2.0), rc.getWidth()*dscale, rc.getHeight()*dscale);
                pMap.SetBounds(rc);
                rc = pMap.GetBounds();
                strJson = "{\"Name\":\"dtMAPBOUNDS\",\"Type\":\"Region\"}";
                DatasetVector dtMAPBOUNDS = (DatasetVector)layer.GetDataset().GetDatasource().CreateDatasetVector(strJson);
                dtMAPBOUNDS.SetProjection(adminDivisionDataset.GetProjection().GetParams());
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
                Layer pLayer = Layer.CreateInstance("Region", ws);
                pLayer.SetDataset(dtMAPBOUNDS);
                pLayer.SetPropertyValue("LineStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":4}"); //如果线宽为0，不绘制线
                pLayer.SetPropertyValue("FillStyle", "{\"ForeColor\":\"RGBA(128,255,0,0)\"}");
		pMap.InsertLayer(pLayer, -1);
                
                //叠加标注
                pLayer = Layer.CreateInstance("Label", ws);
                pLayer.SetDataset(adminDivisionDataset);
                pLayer.SetPropertyValue("LabelExpression", "Name");
                pLayer.SetPropertyValue("TextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"MiddleCenter\",\"ForeColor\":\"RGB(60,60,60)\",\"FontSize\":3.8,\"Weight\":0.6}".getBytes("UTF-8")));
                pMap.InsertLayer(pLayer, -1);
		
		//创建布局
		Layout pLayout = new Layout();
		ws.InsertLayout(pLayout, -1);
		pLayout.SetName("test");
		Graphics.DotToMM(ptViewport);
		rc = new Rectangle2D.Double(0.0, 0.0, ptViewport.getX(), -ptViewport.getY()); //高度为负表示y向下
		pLayout.SetBounds(rc); 
		
		//添加地图到布局
		DatasetVector pdv = (DatasetVector)pLayout.GetDatasource().GetDataset(0);
		rs = pdv.Query(null, null);
		Geometry pg = Geometry.CreateInstance("GeoMap", ws);
		pg.SetBounds(rc);
		pg.SetPropertyValue("MapName", "test");
		rs.AddNew(pg);
		rs.Update();
				
		//添加图例
		Geometry geo = Geometry.CreateInstance("GeoLegend", ws);
		geo.SetOrigin(2, Math.abs(rc.getMaxY()) - 2);
		geo.SetPropertyValue("Alignment", "BottomLeft");
		geo.SetPropertyValue("BackgroundStyle", "{\"ForeColor\":\"RGBA(255,255,255,255)\"}");
		geo.SetPropertyValue("BorderStyle", "{\"color\":\"RGB(0,0,0)\",\"Width\":1}");
		geo.SetPropertyValue("Margin", "{\"left\":4,\"right\":4,\"top\":6,\"bottom\":2}"); //图例边距，单位毫米
		geo.SetPropertyValue("ItemInterval", "2 0"); //图例项列行间距，单位毫米
		geo.SetPropertyValue("ItemTextStyle", new String("{\"FontName\":\"宋体\",\"Alignment\":\"MiddleLeft\",\"ForeColor\":\"RGB(0,0,0)\",\"FontSize\":3.8}".getBytes("UTF-8"))); //尺寸单位为毫米
		
		//添加图例项
		String[] levelName = {"风险等级很高","风险高","风险较高","有一定风险"};
		String[] levelColor = {"RGBA(255,0,0,255)","RGBA(255,127,39,255)","RGBA(255,255,0,255)","RGBA(0,0,255,255)"};
		for(int i=0;i<4;i++){
			String curLevelName = levelName[i];
			String curLevelColor = levelColor[i];
			String str = String.format("{\"Type\":\"Region\",\"Caption\":\"%s\",\"FillStyle\":{\"ForeColor\":\"%s\"}}",curLevelName, curLevelColor);
			str = new String(str.getBytes("UTF-8"));
			geo.AddPropertyValue("LegendItem", str);
		}
		rs.AddNew(geo);
		rs.Update();
		
		//增加标题
		GeoText pGeoText = new GeoText(title);
		pGeoText.SetOrigin(rc.getX() + rc.getWidth() / 2, 5);
		pGeoText.SetPropertyValue("TextStyle", "{\"FontName\":\"宋体\",\"Alignment\":\"TopCenter\",\"FontSize\":8}"); //尺寸单位为毫米
		rs.AddNew(pGeoText);
		rs.Update();
			//副标题(制作时间)
		String subTitle = strMakeTime+"(时效:"+strHourspan+")";
		pGeoText = new GeoText(subTitle);
		pGeoText.SetOrigin(rc.getX() + rc.getWidth() / 2, 15);
		pGeoText.SetPropertyValue("TextStyle", "{\"FontName\":\"宋体\",\"Alignment\":\"TopCenter\",\"FontSize\":6}"); //尺寸单位为毫米
		rs.AddNew(pGeoText);
		rs.Update();
                pGeoText.Destroy();
                
                rs.Destroy();
		
		pLayout.Draw();
		Image image = pLayout.GetGraphics().GetImage();
		image.Save(strFile);
		ws.RemoveLayout("test");
		ws.RemoveMap("test");
		System.out.println("Over");
	}
	public String convertImgToBase64(String strFile){
		InputStream inputStream = null;
		byte[] data = null;
		try{
			inputStream = new FileInputStream(strFile);
		        data = new byte[inputStream.available()];
		        inputStream.read(data);
		        inputStream.close();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		BASE64Encoder encoder = new BASE64Encoder();
		return encoder.encode(data);
	}
}
