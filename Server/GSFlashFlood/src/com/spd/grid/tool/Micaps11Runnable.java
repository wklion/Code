package com.spd.grid.tool;

import java.io.File;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;

import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.Datasource;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.DatasourceConnectionConfigInfo;
import com.spd.weathermap.util.LogTool;

public class Micaps11Runnable implements Runnable{
	
	
	private  Logger log = LogTool.getLogger(this.getClass());
	private String filePath;
	private DatasetRaster dru;
	private DatasetRaster drv;
	private Map<String, String> metadata;
	private Workspace workspace;
	private Datasource dataSouece;
	
	
	private static final int DATA_CHUNK = 128 * 1024 * 1024; 
	 // total data size is 2G
	private static final long LEN = 2L * 1024 * 1024 * 1024L; 

	public Micaps11Runnable(String filePath,String strDatasetName, String elementCaption, Date dateForecast, int h, Double isolineInterval, Double isolineStart, Double isolineEnd){
		
		this.filePath = filePath;
		//this.metadata = metadata;
		workspace = new Workspace();
		
		// 初始化 环境
		Dataset dt = this.getDataSet(strDatasetName+"_u");	
		if(dt == null)
		{
			log.error("格点产品不存在：" + strDatasetName+"_u");
			//Thread.currentThread().destroy();
		}	
		 dru = (DatasetRaster)dt;
		dt = this.getDataSet(strDatasetName+"_v");	
		if(dt == null)
		{
			log.error("格点产品不存在：" + strDatasetName+"_v");
			//Thread.currentThread().destroy();
		}	
		 drv = (DatasetRaster)dt;
		 if(dru!=null){
			 metadata = MicapsUtil.generateMicapsMetaData(dru, elementCaption, dateForecast, h, 
						isolineInterval, isolineStart, isolineEnd);
		 }else{
			 metadata=null;
			 workspace.Destroy();
		 }
		
		
	}
	
	public Micaps11Runnable(){
		
	}
	@Override
	public void run() {
//		// 写入Micaps11 数据
		  if(metadata!=null){
			    
				Boolean result = false;
				try
				{
					File file = new File(filePath);
					if(file.exists())
						file.delete();
					RandomAccessFile raf = new RandomAccessFile(file, "rw"); 
					FileChannel channel = raf.getChannel();
					int pos = 0;
			        MappedByteBuffer mbb = null;
			        byte[] data = null;
			        long len = LEN;
			        int dataChunk = DATA_CHUNK / (1024 * 1024);
			        ByteBuffer buf = ByteBuffer.allocate(1024*1024);
					
					//FileWriter fw = new FileWriter(filePath);
					//fw.write("diamond 11 " + metadata.get("数据说明") + "\r\n");
//					buffer.put(("diamond 11 " + metadata.get("数据说明") + "\r\n").getBytes("utf-8"));
//		            String str = String.format("%s %s %s %s %s %s ", metadata.get("年"), metadata.get("月"), metadata.get("日"), metadata.get("时次"),
//		            		metadata.get("时效"), metadata.get("层次"));
//		           // fw.write(str + "\r\n");
//		            buffer.put((str + "\r\n").getBytes("utf-8"));
//		            str = String.format("%s %s %s %s %s %s %s %s ", metadata.get("经度格距"), metadata.get("纬度格距"), metadata.get("起始经度"), metadata.get("终止经度"),
//		            		metadata.get("起始纬度"), metadata.get("终止纬度"), metadata.get("纬向格点数"), metadata.get("经向格点数"));
//		            //fw.write(str + "\r\n");
//		            buffer.put((str + "\r\n").getBytes("utf-8"));
			        
			        // 拼接抬头和说明数据
			        StringBuilder sb = new StringBuilder();
		            sb.append("diamond 11 " + metadata.get("数据说明") + "\r\n");
		            sb.append(metadata.get("年"));
		            sb.append(metadata.get("月"));
		            sb.append(metadata.get("日"));
		            sb.append(metadata.get("时次"));
		            sb.append(metadata.get("时效"));
		            sb.append(metadata.get("层次"));
		            sb.append("\r\n");
		            sb.append(metadata.get("经度格距"));
		            sb.append(metadata.get("纬度格距"));
		            sb.append(metadata.get("起始经度"));
		            sb.append(metadata.get("终止经度"));
		            sb.append(metadata.get("起始纬度"));
		            sb.append(metadata.get("终止纬度"));
		            sb.append(metadata.get("纬向格点数"));
		            sb.append(metadata.get("经向格点数"));
			        
			        // 将抬头和说明数据写进磁盘
			        buf.clear(); // clear for re-write
			        data = sb.toString().getBytes("utf-8");
			        for (int i = 0; i < data.length; i++) {
			             buf.put(data[i]);
			            }
			        data = null;
			        buf.flip(); // switches a Buffer from writing mode to reading mode
			        channel.write(buf);
			        channel.force(true);

			        
			        
			        StringBuilder druData= new StringBuilder();
		            int cols = dru.GetWidth();
		            Scanline slU = new Scanline(dru.GetValueType(), cols);
		            for (int i = dru.GetHeight() - 1; i >= 0; i--){
		            	
		                dru.GetScanline(0, i, slU);
		                for (int j = 0; j < cols; j++){
		                   // str += String.format("%.1f", slU.GetValue(j)) + " ";
		                	druData.append(slU.GetValue(j) + " ");
		                }
		                //buffer.put((str + "\r\n").getBytes("utf-8"));
		                druData.append("\r\n");
		            }
		            
		            //将dru数据写进磁盘
		            buf.clear(); // clear for re-write
			        data = druData.toString().getBytes("utf-8");
			        for (int i = 0; i < data.length; i++) {
			             buf.put(data[i]);
			            }
			        data = null;
			        buf.flip(); // switches a Buffer from writing mode to reading mode
			        channel.write(buf);
			        channel.force(true);
		            // dru Write end 
		            
			        StringBuilder drvData = new StringBuilder();
		            cols = drv.GetWidth();
		            Scanline slV = new Scanline(drv.GetValueType(), cols);
		            for (int i = drv.GetHeight() - 1; i >= 0; i--){
		                drv.GetScanline(0, i, slV);
		                for (int j = 0; j < cols; j++)
		                {
		                    //str += String.format("%.1f", slV.GetValue(j)) + " ";
		                	drvData.append(slV.GetValue(j)+" ");
		                }
		                //buffer.put((str + "\r\n").getBytes("utf-8"));
		                drvData.append("\r\n");
		            }
		            
		            //将drv数据写进磁盘
		            buf.clear(); // clear for re-write
			        data = drvData.toString().getBytes("utf-8");
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
		            workspace.Destroy();
				}
				catch(Exception e)
				{
					log.error(e.getMessage());
					e.printStackTrace();
				}
		      }
		    
				
			}
	

	
	private Datasource getGridDBDatasource(){
		try
		{
			if(dataSouece == null){
				DatasourceConnectionConfigInfo datasourceConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("datasourceConnectionConfigInfo");
				String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
						datasourceConnectionConfigInfo.getType(), datasourceConnectionConfigInfo.getAlias(), datasourceConnectionConfigInfo.getServer(), 
						datasourceConnectionConfigInfo.getUser(),datasourceConnectionConfigInfo.getPassword(), datasourceConnectionConfigInfo.getDatabase(), 
						datasourceConnectionConfigInfo.getPort());
				dataSouece = workspace.OpenDatasource(strJson);
			}			
		}
		catch(Exception e)
		{
			log.error("打开格点数据源，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return dataSouece; 
	}
	
	
	
	public Dataset getDataSet(String strDatasetName){
		return this.getGridDBDatasource().GetDataset(strDatasetName);
		
	}
	
	
			



}
		

		
	  

