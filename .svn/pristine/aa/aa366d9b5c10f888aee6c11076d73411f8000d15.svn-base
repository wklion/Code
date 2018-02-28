package com.spd.config;

import java.io.File;

import com.google.gson.Gson;
import com.spd.flashflood.file.FileHelper;
import com.spd.flashflood.model.GridDataBaseConfig;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class GridConfig {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	/**
	 * @作者:wangkun
	 * @日期:2017年11月2日
	 * @修改日期:2017年11月2日
	 * @参数:
	 * @返回:配置类
	 * @说明:获取格点配置
	 */
	public GridDataBaseConfig get(){
		String strFile = root+"/gridDataBase.json";
		File file = new File(strFile);
		FileHelper fileHelper = new FileHelper();
		Gson gson = new Gson();
		GridDataBaseConfig gridDataBaseConfig = null;
		try {
			String str = fileHelper.readFile(strFile);
			gridDataBaseConfig = gson.fromJson(str, GridDataBaseConfig.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return gridDataBaseConfig;
	}
}
