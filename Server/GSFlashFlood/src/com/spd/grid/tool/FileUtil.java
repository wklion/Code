package com.spd.grid.tool;

import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.spd.grid.domain.Application;

/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-18
 * @最后修改: 2017-10-18
 * @功能: 文件服务
 **/
public class FileUtil {
	private static String root=Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
	public DatasetVector openShp(String fileName){
		String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", fileName,root + "../data/"+fileName);
		//Application.m_workspace.CloseDatasource(fileName);
		Datasource ds = Application.m_workspace.OpenDatasource(strJson);
		DatasetVector dv = (DatasetVector) ds.GetDataset(0);
		return dv;
	}
}
