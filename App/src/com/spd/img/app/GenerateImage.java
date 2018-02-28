package com.spd.img.app;

import java.util.List;

import com.spd.config.imgTaskConfig;
import com.spd.model.ImgTask;
import com.weathermap.objects.Workspace;

/**
 * @作者:wangkun
 * @日期:2017年12月18日
 * @公司:spd
 * @说明:
*/
public class GenerateImage {

	public static void main(String[] args) {
		imgTaskConfig taskConfig = new imgTaskConfig();
		List<ImgTask> lsImgTask = taskConfig.get();
		GenerateImagePro generateImagePro = null;
		Workspace ws = new Workspace();
		for(ImgTask imgTask:lsImgTask){
			if(!imgTask.getIsEnable()){
				continue;
			}
			generateImagePro = new GenerateImagePro();
			generateImagePro.run(ws,imgTask);
		}
	}

}
