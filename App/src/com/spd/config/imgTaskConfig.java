package com.spd.config;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.spd.flashflood.file.FileHelper;
import com.spd.model.ImgTask;

/**
 * @作者:wangkun
 * @日期:2017年11月2日
 * @公司:spd
 * @说明:
*/
public class imgTaskConfig {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	/**
	 * @作者:wangkun
	 * @日期:2017年11月2日
	 * @修改日期:2017年11月2日
	 * @参数:
	 * @返回:配置类
	 * @说明:获取格点配置
	 */
	public List<ImgTask> get(){
		String strFile = root+"/imgTask.json";
		File file = new File(strFile);
		FileHelper fileHelper = new FileHelper();
		Gson gson = new Gson();
		List<ImgTask> lsImgTask = new ArrayList();
		JsonParser parser = new JsonParser();
		try {
			String str = fileHelper.readFile(strFile);
			JsonArray jsonArray = parser.parse(str).getAsJsonArray();
			for (JsonElement je : jsonArray) {
				ImgTask imgTask = gson.fromJson(je, ImgTask.class);
				lsImgTask.add(imgTask);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return lsImgTask;
	}
}
