//com:spd
//author:wangkun
//createtime:2016.07.13
package com.spd.grid.tool;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Callable;
import org.slf4j.Logger;

import com.mg.objects.DatasetRaster;
import com.mg.objects.Datasource;
import com.mg.objects.Scanline;
import com.spd.grid.domain.Application;
import com.spd.weathermap.domain.GridData;
import com.spd.weathermap.util.LogTool;

public class ReadMicaps4 implements Callable{
	private String element;
	private String action;
	private Date forcastTime;
	private String filePath;
	private  Logger log=null;
	private SimpleDateFormat formatyyMMddHHmm=null;
	public ReadMicaps4(String element,String action,Date forcasttime,String filepath) {  
        this.element = element; 
        this.action=action;
        this.forcastTime=forcasttime;
        this.filePath=filepath;
        log = LogTool.getLogger(this.getClass());
        formatyyMMddHHmm = new SimpleDateFormat("yyMMddHHmm00");
    } 
	@Override
	public Object call() throws Exception{
		// TODO Auto-generated method stub
		long zStime = System.currentTimeMillis();
		GridData grid = new GridData();
		Calendar cal=Calendar.getInstance();
		cal.setTime(forcastTime);
		Boolean bFirst=true;//第一个
		for(int h=0;h<20;h++){//循环计算未来2小时
			String strDate=formatyyMMddHHmm.format(cal.getTime());
			String fileName=strDate;//格式yyMMddHHmm
			String file=filePath+"/"+fileName+"."+element+".txt";
			File f=new File(file);
			if(!f.exists()){
				log.info("不存在"+file+"文件");
				cal.add(Calendar.MINUTE,6);
				continue;
			}
			//打开格点
			String strJson = "{\"Type\":\"Micaps\",\"Alias\":\""+element+fileName+"\",\"Server\":\""+file+"\"}";
			Datasource ds=Application.m_workspace.OpenDatasource(strJson);
			DatasetRaster dr=(DatasetRaster) ds.GetDataset(0);
			if(dr==null){
				log.info("打开"+file+"文件出错!");
				continue;
			}
			dr.CalcExtreme();
			int cols = dr.GetWidth();
			int rows = dr.GetHeight();
			Scanline sl = new Scanline(dr.GetValueType(), cols);
			ArrayList<Double> dValues = new ArrayList<Double>();
			for(int i = rows - 1; i >= 0; i--)
			{	
				dr.GetScanline(0, i, sl);
				for(int j = 0; j<cols; j++)
				{
					double val=0;
					if(bFirst){
						val = sl.GetValue(j);
						dValues.add(val);
					}
					else{
						ArrayList<Double> aOld=grid.getDValues();//结果数据数组
						Double rOld=aOld.get((rows-i-1)*cols+j);//结果值
						if(action.equals("sum")){//求和
							val=sl.GetValue(j)+rOld;
						}
						else if(action.equals("max")){//求最大值
							val=rOld>sl.GetValue(j)?rOld:sl.GetValue(j);
						}
						else{
							val = sl.GetValue(j);
						}
					}
					dValues.add(val);
				}
			}
			if(bFirst){//加一个标识，只在第一个时赋值
				grid.setLeft(dr.GetBounds().getX());
				grid.setBottom(dr.GetBounds().getY());
				grid.setRight(dr.GetBounds().getX() + dr.GetBounds().getWidth());
				grid.setTop(dr.GetBounds().getY() + dr.GetBounds().getHeight());
				grid.setRows(dr.GetHeight());
				grid.setCols(dr.GetWidth());
				grid.setNoDataValue(dr.GetNoDataValue());
				bFirst=false;
			}
			grid.setDValues(dValues);
			Application.m_workspace.CloseDatasource(element+fileName);//关闭数据源
			cal.add(Calendar.MINUTE,6);
		}
		long zEtime = System.currentTimeMillis();
		log.info(element+":" + String.valueOf(zEtime - zStime));
		return grid;
	}

}
