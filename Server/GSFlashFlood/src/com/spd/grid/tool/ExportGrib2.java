package com.spd.grid.tool;

import java.awt.geom.Rectangle2D;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;

import com.mg.objects.DatasetRaster;
import com.mg.objects.Datasource;
import com.mg.objects.Scanline;
import com.spd.grid.domain.Application;
import com.spd.weathermap.util.LogTool;

public class ExportGrib2 extends Export
{
	private Datasource m_ds = null;
	
	private Logger log = LogTool.getLogger(this.getClass());
	
	@Override
	public Map<String, String> generateMetaData(DatasetRaster dr, String elementCaption, String elementOut, Date dateForecast, Integer hour, Double isolineInterval, Double isolineStart, Double isolineEnd)
	{
		Calendar c = Calendar.getInstance();
		c.setTime(dateForecast);
		
		double tag = -1;  //倒过来
		Map<String, String> metadata = new HashMap<String, String>();
		metadata.put("name", elementOut);
		metadata.put("shortName", elementOut);
		metadata.put("year", String.valueOf(c.get(Calendar.YEAR)));
		metadata.put("month", String.valueOf(c.get(Calendar.MONTH)+1));
		metadata.put("day", String.valueOf(c.get(Calendar.DATE))); 
		metadata.put("hour", String.valueOf(c.get(Calendar.HOUR_OF_DAY)));
		metadata.put("minute", String.valueOf(c.get(Calendar.DATE)));
		metadata.put("second", String.valueOf(c.get(Calendar.DATE)));
		metadata.put("hourSpan", String.valueOf(hour));
		metadata.put("level", "0");
//		metadata.put("经度格距", String.format("%.6f", dr.GetBounds().getWidth()/dr.GetWidth()));
//		metadata.put("纬度格距", String.format("%.6f", tag*dr.GetBounds().getHeight()/dr.GetHeight()));
//		metadata.put("起始经度", String.format("%.6f", dr.GetBounds().getX()));
//		metadata.put("终止经度", String.format("%.6f", dr.GetBounds().getX() + dr.GetBounds().getWidth()));
//		metadata.put("起始纬度", String.format("%.6f", tag>0?dr.GetBounds().getY() : dr.GetBounds().getY() + dr.GetBounds().getHeight()));
//		metadata.put("终止纬度", String.format("%.6f", tag>0?dr.GetBounds().getY() + dr.GetBounds().getHeight() : dr.GetBounds().getY()));
//		metadata.put("纬向格点数", String.valueOf(dr.GetWidth()));
//		metadata.put("经向格点数", String.valueOf(dr.GetHeight()));
		return metadata;
	}
	
	@Override
	public Boolean write(String filePath, DatasetRaster dr, Map<String, String> metadata, Double left, Double bottom, Double right, Double top)
	{
		Boolean result = false;
		try
		{
			filePath += ".GRB2";
			filePath = filePath.replace("\\", "/");
			
			String str = "";
			if(m_ds == null){
				str = "{\"Type\":\"grib_api\",\"Alias\":\"dsGRIB\",\"Server\":\""+filePath+"\"}";
				m_ds = Application.m_workspace.CreateDatasource(str);
			}
			
			Rectangle2D boundsSrc = dr.GetBounds();
			Rectangle2D boundsTarget = new Rectangle2D.Double(left, bottom, Math.round((right-left)*1000.0)/1000.0, Math.round((top-bottom)*1000.0)/1000.0); //保留三位小数，以防误差导致的错误
			if(left < boundsSrc.getMinX() || right > boundsSrc.getMaxX() || bottom < boundsSrc.getMinY() || top > boundsSrc.getMaxY()){
				log.error("输出范围超出格点范围");
				return result;
			}
			double delta = boundsSrc.getWidth()/dr.GetWidth();
			delta = Math.round((delta)*1000.0)/1000.0; //精确到公里，以防误差导致的错误
			int offsetX = (int)((left-boundsSrc.getMinX())/delta);
			int offsetY = (int)((bottom-boundsSrc.getMinY())/delta);
	
			    
			int w = (int)(boundsTarget.getWidth()/delta), h = (int)(boundsTarget.getHeight()/delta);
	        str = String.format("\"Name\":\"dt%s\",\"ValueType\":\"Single\",\"Width\":%d,\"Height\":%d",  metadata.get("hourSpan"), w, h);
	        DatasetRaster drTarget = m_ds.CreateDatasetRaster("{" + str + "}");
	        //pdr.SetProjection("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
	        drTarget.SetProjection(dr.GetProjection().GetParams());
	        drTarget.SetBounds(boundsTarget);
	
	        str = String.format("{\"name\":\"%s\",\"shortName\":\"%s\",\"year\":\"%s\",\"month\":\"%s\",\"day\":\"%s\"" + 
	            ",\"hour\":\"%s\",\"minute\":\"%s\",\"second\":\"%s\",\"level\":\"%s\"}",
	            metadata.get("name"), metadata.get("shortName"), metadata.get("year"), metadata.get("month"), metadata.get("day"), 
	            metadata.get("hour"), metadata.get("minute"), metadata.get("second"), metadata.get("hourSpan"), metadata.get("level"));
	        drTarget.SetMetadata(new String(str.getBytes("UTF-8")));
	 
	        Scanline slSrc = new Scanline("Single", dr.GetWidth());
	        Scanline slTarget = new Scanline("Single", w);
	        for (int i = 0; i < h; i++)
	        {
	        	dr.GetScanline(0, i+offsetY, slSrc);
	        	for(int j=0; j<w; j++)
	        		slTarget.SetValue(j, slSrc.GetValue(j+offsetX));
	        	drTarget.SetScanline(0, i, slTarget);
	        }
	        drTarget.CalcExtreme();
	        drTarget.FlushCache();
	        slSrc.Destroy();
	        slTarget.Destroy();
	        result = true;
		}
		catch(Exception e)
		{
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public Boolean writeUV(String filePath, DatasetRaster drU, DatasetRaster drV, Map<String, String> metadata, Double left, Double bottom, Double right, Double top){
		Boolean result = false;
		try
		{
			metadata.put("name", "u-component");
			metadata.put("shortName", "u");
			this.write(filePath, drU, metadata, left, bottom, right, top);
			
			metadata.put("name", "v-component");
			metadata.put("shortName", "v");
			this.write(filePath, drV, metadata, left, bottom, right, top);
		}
		catch(Exception e)
		{
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public void destroy()
	{
		if(m_ds != null)
			Application.m_workspace.CloseDatasource(m_ds.GetAlias()); //grib数据源需要关闭才能写入文件
	}
}
