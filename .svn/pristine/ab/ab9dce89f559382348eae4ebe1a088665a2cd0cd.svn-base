package com.spd.grid.ws;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;

import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;

@Stateless
@Path("AppService")
public class AppService {
	private  Logger log = LogTool.getLogger(this.getClass());
	/*
	 * 调用EXE，导出Grib2数据
	 * 参数：无
	 * 返回：是否成功
	 * @return 
	 * */
	@POST
	@Path("exportGrib2")
	@Produces("application/json")
	public Object exportGrib2(@FormParam("para") String para)
	{
		Boolean result = false;
		try {
			try {
				JSONObject jsonObject = new JSONObject(para);
				String forecastTime = CommonTool.getJSONStr(jsonObject, "forecastTime");
				String cmd = "\"D:\\apache-tomcat-6.0_sync\\apps\\ExportGrib\\bin\\ExportGrib.exe\" \"" + forecastTime + "\"";				 
				Process p = Runtime.getRuntime().exec(cmd);
				
//				//1.要在调用waitFor()方法之前读取数据流
//				//2.要先从标准错误流中读取，然后再读取标准输出流，因为runtime默认先读取错误流，一旦错误流没被读取，这个进程就回被挂起
//				InputStream errorProcStream = p.getErrorStream();  
//	            InputStream outputProcStream = p.getInputStream();  
//	            InputStreamReader errorRead = new InputStreamReader(errorProcStream);  
//	            InputStreamReader outputRead = new InputStreamReader(outputProcStream);  
//	            BufferedReader errorbr = new BufferedReader(errorRead);
//	            String errorline = null;  
//	               while ((errorline = errorbr.readLine()) != null) {  
//	            	   log.error(errorline); 
//	               }  
//	            BufferedReader outputbr = new BufferedReader(outputRead);  
//	            String outputline = null;  
//	               while ((outputline = outputbr.readLine()) != null) {  
//	            	   log.error(outputline);
//	               }  
	               
				p.waitFor();
				
//				//临时  //这个不用了
//				cmd = "\"D:\\apache-tomcat-6.0_sync\\apps\\ExportGrib_City\\bin\\ExportGrib.exe\" \"" + forecastTime + "\"";
//				p = Runtime.getRuntime().exec(cmd);
//				p.waitFor();
				
				result = true;
			} catch (Exception e) {
				log.error("调用EXE，导出Grib2数据异常：" + e.getMessage());
			}			
		} catch (Exception e) {
			log.error("调用EXE，导出Grib2数据异常：" + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
}
