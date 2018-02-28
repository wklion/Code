package com.spd.data.test;

import com.google.gson.Gson;
import com.spd.data.param.GetWeatherSummarizeParam;
import com.spd.grid.ws.FileService;

public class FileServiceTest {

	public static void main(String[] args) {
		GetWeatherSummarizeParam param = new GetWeatherSummarizeParam();
		param.setDir("C:/Users/lenovo/Desktop/temp/tq/");
		FileService fs = new FileService();
		Gson gson = new Gson();
		String strParam = gson.toJson(param);
		Object obj = fs.getWeatherSummarize(strParam);
		System.out.println(obj);
	}

}
