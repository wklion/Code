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

public class Micaps4Runnable implements Runnable{

	private  Logger log = LogTool.getLogger(this.getClass());
	private String filePath;
	private DatasetRaster dr;
	private Map<String, String> metadata;
	private Workspace workspace;
	private Datasource dataSouece;
	
	
	
	
	private static final int DATA_CHUNK = 128 * 1024 * 1024; 
	 // total data size is 2G
	private static final long LEN = 2L * 1024 * 1024 * 1024L; 

	public Micaps4Runnable(String filePath, String  strDatasetName, String elementCaption, Date dateForecast, int h, Double isolineInterval, Double isolineStart, Double isolineEnd){
		this.filePath = filePath;
		workspace = new Workspace();
		// 初始化 环境
		Dataset dt = this.getDataSet(strDatasetName);	
		if(dt == null){
			log.error("格点产品不存在：" + strDatasetName);
		}	
		 dr = (DatasetRaster)dt;
		 if(dr!=null){
			 metadata = MicapsUtil.generateMicapsMetaData(dr, elementCaption, dateForecast, h, 
						isolineInterval, isolineStart, isolineEnd);
		 }else{
			 metadata=null;
			 workspace.Destroy();
		 }
		
		
	}
	
	public Micaps4Runnable(){
		
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
			 
			        //channel.close();
			        //raf.close();
		            //buffer.put((str + "\r\n").getBytes("utf-8"));
		            //str = String.format("%s %s %s %s %s %s %s %s ", metadata.get("经度格距"), metadata.get("纬度格距"), metadata.get("起始经度"), metadata.get("终止经度"),
		            		//metadata.get("起始纬度"), metadata.get("终止纬度"), metadata.get("纬向格点数"), metadata.get("经向格点数"));
		            //buffer.put((str + "\r\n").getBytes("utf-8"));
			        StringBuffer sbData= new StringBuffer();
		            int cols = dr.GetWidth();
		            Scanline sl = new Scanline(dr.GetValueType(), cols);
		            for (int i = dr.GetHeight() - 1; i >= 0; i--){
		                dr.GetScanline(0, i, sl);
		                for (int j = 0; j < cols; j++){
		                   // str += String.format("%.1f", sl.GetValue(j)) + " ";
		                	sbData.append(sl.GetValue(j)+" ");
		                }
		                //buffer.put((str + "\r\n").getBytes("utf-8"));
		                sbData.append("\r\n");
		            }
		            
		            //将数据写进磁盘
			            buf.clear(); // clear for re-write
			            data = sbData.toString().getBytes("utf-8");
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
		try{
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


