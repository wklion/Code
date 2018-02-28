package com.spd.flashflood.config;

import java.io.BufferedReader;
import java.io.FileReader;

import org.slf4j.Logger;

import com.google.gson.Gson;
import com.spd.flashflood.model.Config;
import com.spd.weathermap.util.LogTool;

/**
 * @作者:wangkun
 * @日期:2017年7月23日
 * @公司:spd
 * @说明:
*/
public class ConfigHelper {
	public static Config config = null;
	private  Logger log = LogTool.getLogger(this.getClass());
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1); 
	/**
	 * @作者:wangkun
	 * @日期:2017年7月22日
	 * @修改日期:2017年7月22日
	 * @参数:
	 * @返回:
	 * @说明:配置文件解析
	 */
	public void excute(){
		if(config!=null){
			return;
		}
		Gson gson = new Gson();
		try {
			BufferedReader br = new BufferedReader(new FileReader(root+"/config.json"));
			StringBuilder json = new StringBuilder();
			String lineTxt = null;
			while((lineTxt = br.readLine()) != null){
				json.append(lineTxt);
            }
			config = gson.fromJson(json.toString(), Config.class);
		} catch (Exception e) {
			log.error("解析cimiss.json出错!"+e.getMessage());
		}
	}
}
