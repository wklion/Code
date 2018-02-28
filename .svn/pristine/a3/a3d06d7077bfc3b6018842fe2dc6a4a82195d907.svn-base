package com.spd.grid.tool;

import java.io.File;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;

import com.mg.objects.DatasetRaster;
import com.mg.objects.Scanline;
import com.spd.weathermap.util.LogTool;

public class ExportMicaps extends Export{
	private Logger log = LogTool.getLogger(this.getClass());
	@Override
	public Map<String, String> generateMetaData(DatasetRaster dr, String elementCaption, String elementOut, Date dateForecast, Integer hour, Double isolineInterval, Double isolineStart, Double isolineEnd)
	{
		Calendar c = Calendar.getInstance();
		c.setTime(dateForecast);
		
		double tag = -1;  //倒过来
		Map<String, String> metadata = new HashMap<String, String>();
		metadata.put("数据说明", elementCaption);
		metadata.put("年", String.valueOf(c.get(Calendar.YEAR)));
		metadata.put("月", String.valueOf(c.get(Calendar.MONTH)+1));
		metadata.put("日", String.valueOf(c.get(Calendar.DATE))); 
		metadata.put("时次", String.valueOf(c.get(Calendar.HOUR_OF_DAY)));
		metadata.put("时效", String.valueOf(hour));
		metadata.put("层次", "0");
		Double deltaX = dr.GetBounds().getWidth()/dr.GetWidth();
		Double deltaY = tag*dr.GetBounds().getHeight()/dr.GetHeight();
		metadata.put("经度格距", String.format("%.6f", deltaX));
		metadata.put("纬度格距", String.format("%.6f", deltaY));
		metadata.put("起始经度", String.format("%.6f", dr.GetBounds().getX() + Math.abs(deltaX/2.0)));
		metadata.put("终止经度", String.format("%.6f", dr.GetBounds().getX() + dr.GetBounds().getWidth() - Math.abs(deltaX/2.0)));
		metadata.put("起始纬度", String.format("%.6f", tag>0?dr.GetBounds().getY() + Math.abs(deltaY/2.0) : dr.GetBounds().getY() + dr.GetBounds().getHeight() -  Math.abs(deltaY/2.0)));
		metadata.put("终止纬度", String.format("%.6f", tag>0?dr.GetBounds().getY() + dr.GetBounds().getHeight() - Math.abs(deltaY/2.0) : dr.GetBounds().getY() + Math.abs(deltaY/2.0)));
		metadata.put("纬向格点数", String.valueOf(dr.GetWidth()));
		metadata.put("经向格点数", String.valueOf(dr.GetHeight()));
		metadata.put("等值线间隔", String.format("%.6f",isolineInterval));
		metadata.put("等值线起始值", String.format("%.6f",isolineStart));
		metadata.put("终止值", String.format("%.6f",isolineEnd));
		metadata.put("平滑系数", "1.000000");
 		metadata.put("加粗线值", "0.000000");
		return metadata;
	}
	
	@Override
	public Boolean write(String filePath, DatasetRaster dr, Map<String, String> metadata, Double left, Double bottom, Double right, Double top)
	{
		Boolean result = false;
		try
		{
			filePath = String.format("%s.%03d", filePath, Integer.parseInt(metadata.get("时效")));
			
			File file = new File(filePath);
			if(file.exists())
				file.delete();
			RandomAccessFile raf = new RandomAccessFile(file, "rw"); 
			FileChannel channel = raf.getChannel();
	        byte[] data = null;
	        ByteBuffer buf = ByteBuffer.allocate(1024*1024);
	        // 拼接抬头和说明数据
	        StringBuilder sb = new StringBuilder();
            sb.append("diamond 4 " + metadata.get("数据说明") + "\r\n");
            sb.append(metadata.get("年")+" ");
            sb.append(metadata.get("月")+" ");
            sb.append(metadata.get("日")+" ");
            sb.append(metadata.get("时次")+" ");
            sb.append(metadata.get("时效")+" ");
            sb.append(metadata.get("层次"));
            sb.append("\r\n");
            sb.append(metadata.get("经度格距")+" ");
            sb.append(metadata.get("纬度格距")+" ");
            sb.append(metadata.get("起始经度")+" ");
            sb.append(metadata.get("终止经度")+" ");
            sb.append(metadata.get("起始纬度")+" ");
            sb.append(metadata.get("终止纬度")+" ");
            sb.append(metadata.get("纬向格点数")+" ");
            sb.append(metadata.get("经向格点数"));
            sb.append("\r\n");
            sb.append(metadata.get("等值线间隔")+" ");
            sb.append(metadata.get("等值线起始值")+" ");
            sb.append(metadata.get("终止值")+" ");
            sb.append(metadata.get("平滑系数")+" ");
            sb.append(metadata.get("加粗线值"));
            sb.append("\r\n");
            
	        // 将抬头和说明数据写进磁盘
	            buf.clear(); // clear for re-write
	            //data = sb.toString().getBytes("utf-8");
	            data = sb.toString().getBytes("GBK");
	            for (int i = 0; i < data.length; i++) {
	                buf.put(data[i]);
	            }
	            data = null;
	            buf.flip(); // switches a Buffer from writing mode to reading mode
	            channel.write(buf);
	            channel.force(true);
	 
	        StringBuffer sbData= new StringBuffer();
            int cols = dr.GetWidth();
            Scanline sl = new Scanline(dr.GetValueType(), cols);
            for (int i = dr.GetHeight() - 1; i >= 0; i--){
                dr.GetScanline(0, i, sl);
                for (int j = 0; j < cols; j++){
                   // str += String.format("%.1f", sl.GetValue(j)) + " ";
                	sbData.append(Math.round(sl.GetValue(j)*10.0)/10.0+" ");
                }
                //buffer.put((str + "\r\n").getBytes("utf-8"));
                sbData.append("\r\n");
            }
            
            //将数据写进磁盘
	            buf.clear(); // clear for re-write
	            //data = sbData.toString().getBytes("utf-8");
	            data = sbData.toString().getBytes("GBK");
	            for (int i = 0; i < data.length; i++) {
	                buf.put(data[i]);
	            }
	            data = null;
	            buf.flip(); // switches a Buffer from writing mode to reading mode
	            channel.write(buf);
	            channel.force(true);
	            
	            channel.close();
	            raf.close();
                log.info("生成成功："+filePath);
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
			filePath = String.format("%s.%03d", filePath, Integer.parseInt(metadata.get("时效")));
			
			File file = new File(filePath);
			if(file.exists())
				file.delete();
			RandomAccessFile raf = new RandomAccessFile(file, "rw"); 
			FileChannel channel = raf.getChannel();
	        byte[] data = null;
	        ByteBuffer buf = ByteBuffer.allocate(1024*1024);
	        
	        // 拼接抬头和说明数据
	        StringBuilder sb = new StringBuilder();
            sb.append("diamond 11 " + metadata.get("数据说明") + "\r\n");
            sb.append(metadata.get("年")+" ");
            sb.append(metadata.get("月")+" ");
            sb.append(metadata.get("日")+" ");
            sb.append(metadata.get("时次")+" ");
            sb.append(metadata.get("时效")+" ");
            sb.append(metadata.get("层次"));
            sb.append("\r\n");
            sb.append(metadata.get("经度格距")+" ");
            sb.append(metadata.get("纬度格距")+" ");
            sb.append(metadata.get("起始经度")+" ");
            sb.append(metadata.get("终止经度")+" ");
            sb.append(metadata.get("起始纬度")+" ");
            sb.append(metadata.get("终止纬度")+" ");
            sb.append(metadata.get("纬向格点数")+" ");
            sb.append(metadata.get("经向格点数"));
            sb.append("\r\n");           
	        
	        // 将抬头和说明数据写进磁盘
	        buf.clear(); // clear for re-write
	        //data = sb.toString().getBytes("utf-8");
	        data = sb.toString().getBytes("GBK");
	        for (int i = 0; i < data.length; i++) {
	             buf.put(data[i]);
	            }
	        data = null;
	        buf.flip(); // switches a Buffer from writing mode to reading mode
	        channel.write(buf);
	        channel.force(true);

	        
	        StringBuilder druData= new StringBuilder();
            int cols = drU.GetWidth();
            Scanline slU = new Scanline(drU.GetValueType(), cols);
            for (int i = drU.GetHeight() - 1; i >= 0; i--){
            	
            	drU.GetScanline(0, i, slU);
                for (int j = 0; j < cols; j++){
                   // str += String.format("%.1f", slU.GetValue(j)) + " ";
                	druData.append(Math.round(slU.GetValue(j)*10)/10 + " ");
                }
                //buffer.put((str + "\r\n").getBytes("utf-8"));
                druData.append("\r\n");
            }
            
            //将dru数据写进磁盘
            buf.clear(); // clear for re-write
	        //data = druData.toString().getBytes("utf-8");
            data = druData.toString().getBytes("GBK");
	        for (int i = 0; i < data.length; i++) {
	             buf.put(data[i]);
	            }
	        data = null;
	        buf.flip(); // switches a Buffer from writing mode to reading mode
	        channel.write(buf);
	        channel.force(true);
            // dru Write end 
            
	        StringBuilder drvData = new StringBuilder();
            cols = drV.GetWidth();
            Scanline slV = new Scanline(drV.GetValueType(), cols);
            for (int i = drV.GetHeight() - 1; i >= 0; i--){
            	drV.GetScanline(0, i, slV);
                for (int j = 0; j < cols; j++)
                {
                    //str += String.format("%.1f", slV.GetValue(j)) + " ";
                	drvData.append(Math.round(slV.GetValue(j)*10.0)/10.0+" ");
                }
                //buffer.put((str + "\r\n").getBytes("utf-8"));
                drvData.append("\r\n");
            }
            
            //将drv数据写进磁盘
            buf.clear(); // clear for re-write
	        //data = drvData.toString().getBytes("utf-8");
            data = drvData.toString().getBytes("GBK");
	        for (int i = 0; i < data.length; i++) {
	             buf.put(data[i]);
	            }
	        data = null;
	        buf.flip(); // switches a Buffer from writing mode to reading mode
	        channel.write(buf);
	        channel.force(true);
            
            // 关闭通道
	        channel.close();
	        raf.close();
            result = true;
            log.info("生成成功："+filePath);
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
		
	}
}
