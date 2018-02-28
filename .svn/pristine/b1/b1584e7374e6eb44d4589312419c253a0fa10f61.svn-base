package com.spd.grid.tool;

import java.util.Calendar;

import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.spd.grid.domain.Application;

/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-18
 * @最后修改: 2017-10-18
 * @功能: 数据集相关
 **/
public class DatasetUtil {
	/**
	 * @作者:wangkun
	 * @日期:2017年10月18日
	 * @修改日期:2017年10月18日
	 * @参数:
	 * @返回:
	 * @说明:创建临时数据集
	 */
	public DatasetVector createTempDV(String type){
		Calendar cal = Calendar.getInstance();
		String alias = DateUtil.format("yyyyMMddHHmmss", cal);
		String strJson = "{\"Type\":\"Memory\",\"Alias\":\""+alias+"\",\"Server\":\"\"}";
		Datasource ds = Application.m_workspace.CreateDatasource(strJson);
		strJson = "{\"Name\":\"temp\",\"Type\":\""+type+"\"}";
		DatasetVector dv = ds.CreateDatasetVector(strJson);
		return dv;
	}
}
