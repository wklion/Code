package com.spd.grid.ws;

import java.io.File;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.google.gson.Gson;
import com.spd.data.param.GetWeatherSummarizeParam;
import com.spd.grid.model.CommonResult;
import com.spd.grid.tool.Common;
/**
 * @author 文件服务
 */
@Stateless
@Path("FileService")
public class FileService {
	/**
		 * @autor:wangkun
		 * @date:2018年2月7日
		 * @modifydate:2018年2月7日
		 * @param:
		 * @return:
		 * @description:获取天气综述
	 */
	@POST
	@Path("getWeatherSummarize")
	@Produces("application/json")
	public Object getWeatherSummarize(@FormParam("para") String para) {
		CommonResult cr = new CommonResult();
		Gson gson = new Gson();
		GetWeatherSummarizeParam getWeatherSummarizeParam = gson.fromJson(para, GetWeatherSummarizeParam.class);
		String dir = getWeatherSummarizeParam.getDir();
		File file = new File(dir);
		File[] files = file.listFiles();
		int fileSize = files.length;
		if(fileSize < 1){
			cr.setErr("目录为空!");
			return cr;
		}
		String strFile = files[fileSize-1].getAbsolutePath();
		Common com = new Common();
		String txt = com.readTxt(strFile);
		cr.setSuc(txt);
		return cr;
	}
}
