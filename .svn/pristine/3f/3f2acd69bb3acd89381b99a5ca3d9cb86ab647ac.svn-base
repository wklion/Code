/**     
	 * @公司	spd
     * @作者 wangkun       
     * @创建 2016-07-08
     * @最后修改 2016-09-26
     * @功能 解析本地文件
     **/
package com.spd.grid.ws;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;

import com.mg.objects.DatasetRaster;
import com.mg.objects.Datasource;
import com.mg.objects.Scanline;
import com.mg.objects.Workspace;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.pojo.CommonConfig;
import com.spd.grid.tool.CompratorByLastModified;
import com.spd.grid.tool.DateUtil;
import com.spd.weathermap.domain.GridData;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;

@Stateless
@Path("FileGridService")
public class FileGridService {
	CommonConfig commonfig=null;
	SimpleDateFormat formatYYYYMMddHHmmss = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	SimpleDateFormat formatyyMMddHHmm = new SimpleDateFormat("yyMMddHHmm");
	SimpleDateFormat formatyyMMddHH = new SimpleDateFormat("yyMMddHH");
	private  Logger log=null;
	public FileGridService(){
		commonfig=(CommonConfig)ApplicationContextFactory.getInstance().getBean("commonConifg");
		log = LogTool.getLogger(this.getClass());
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年8月1日
	 * @修改日期:2017年8月1日
	 * @参数:
	 * @返回:
	 * @说明:获取格点
	 */
	@POST
	@Path("getGrid")
	@Produces("application/json")
	public Object getGrid(@FormParam("para") String para) throws Exception {
		long begintime = System.currentTimeMillis();
		//1、解析参数
		JSONObject jo = new JSONObject(para);
		String elementID = jo.opt("elementid").toString();//要素ID
		String elementName = jo.opt("elementname").toString();//要素名称
		int hourspan = jo.optInt("hourspan");//时效
		String dic = jo.opt("dic").toString();//目录
		String fileFormat = jo.opt("fileformat").toString();//文件格式
		String strDateTime = jo.opt("datetime").toString();//文件格式
		Date dateTime = formatYYYYMMddHHmmss.parse(strDateTime);
		String dateFormat = fileFormat.split("\\.")[0];
		String strHourspan = String.format("%03d", hourspan); 
		//2、获取文件
		String curStrDateTime = new SimpleDateFormat(dateFormat).format(dateTime);
		String newStrFileName = curStrDateTime+"."+strHourspan;
		String newStrFile = dic+newStrFileName;
		//3、打开文件
		String strJson = "{\"Type\":\"Micaps\",\"Alias\":\""+newStrFileName+"\",\"Server\":\""+newStrFile+"\"}";
		Datasource ds=Application.m_workspace.OpenDatasource(strJson);
		if(ds==null){
			log.info("打开"+newStrFile+"文件出错!");
			return null;
		}
		DatasetRaster dr=(DatasetRaster) ds.GetDataset(0);
		dr.CalcExtreme();
		int cols = dr.GetWidth();
		int rows = dr.GetHeight();
		GridData grid = new GridData();
		ArrayList<Double> dValues = new ArrayList<Double>();
		Scanline sl = new Scanline(dr.GetValueType(), cols);
		String meta = dr.GetMetadata();
		meta = meta.toLowerCase();
		if(meta.indexOf("diamond11")!=-1){
			dr=(DatasetRaster) ds.GetDataset(0);
			dr.CalcExtreme();
			cols = dr.GetWidth();
			rows = dr.GetHeight();
			DatasetRaster drV = (DatasetRaster) ds.GetDataset(1);
			sl = new Scanline(dr.GetValueType(), cols);
			Scanline slV = new Scanline(drV.GetValueType(), cols);
			for(int r = rows-1; r >=0; r--){
				dr.GetScanline(0, r, sl);
				drV.GetScanline(0, r, slV);
				for(int c = 0; c<cols; c++){
					double uVal = sl.GetValue(c);
					double vVal = slV.GetValue(c);
					if(uVal == 0.0 && vVal == 0.0){
						dValues.add(0.0);
						dValues.add(0.0);
					}
					else{
						Double dSpeed = Math.sqrt(uVal*uVal + vVal*vVal);
						Double dDirection = 270.0-Math.atan2(vVal, uVal)*180.0/Math.PI;
						dSpeed = Math.round(dSpeed*10.0)/10.0;
						dDirection = Math.round(dDirection*10.0)/10.0;
						dValues.add(dDirection);
						dValues.add(dSpeed);	
					}
				}
			}
			slV.Destroy();
		}
		else{
			dr=(DatasetRaster) ds.GetDataset(0);
			dr.CalcExtreme();
			cols = dr.GetWidth();
			rows = dr.GetHeight();
			sl = new Scanline(dr.GetValueType(), cols);
			for(int r = rows-1; r >=0; r--){	
				dr.GetScanline(0, r, sl);
				for(int c = 0; c<cols; c++){
					double val = sl.GetValue(c);
					val = ((int)(val*100))/100.0;
					dValues.add(val);
				}
			}
		}
		sl.Destroy();
		grid.setLeft(dr.GetBounds().getX());
		grid.setBottom(dr.GetBounds().getY());
		grid.setRight(dr.GetBounds().getX() + dr.GetBounds().getWidth());
		grid.setTop(dr.GetBounds().getY() + dr.GetBounds().getHeight());
		grid.setRows(dr.GetHeight());
		grid.setCols(dr.GetWidth());
		grid.setDValues(dValues);
		grid.setNoDataValue(dr.GetNoDataValue());
		String resStrDateTime = formatYYYYMMddHHmmss.format(dateTime);
		grid.setNWPModelTime(resStrDateTime);
		Application.m_workspace.CloseDatasource(newStrFileName);
		long endtime = System.currentTimeMillis();
		log.info("获取数据源耗时：" + String.valueOf(endtime - begintime));
		return grid;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年8月1日
	 * @修改日期:2017年8月1日
	 * @参数:
	 * @返回:
	 * @说明:获取指定时间的格点
	 */
	@POST
	@Path("getGridByDateTime")
	@Produces("application/json")
	public Object getGridByDateTime(@FormParam("para") String para) throws Exception {
		long begintime = System.currentTimeMillis();
		//1、解析参数
		JSONObject jo = new JSONObject(para);
		String dic = jo.opt("dic").toString();//目录
		String strDT = jo.optString("datetime");
		Calendar curCal = DateUtil.parse("yyyy-MM-dd HH:mm:ss",strDT);
		String strDateTime = DateUtil.format("yyyyMMddHHmmss", curCal);
		String elementID = jo.optString("elementid");
		String fileName = strDateTime+".txt";
		String strFile = dic+elementID+"/"+fileName;
		File file = new File(strFile);
		if(!file.exists()){
			return null;
		}
		strFile = strFile.replace("\\", "/");
		//2、打开数据源
		String strJson = "{\"Type\":\"Micaps\",\"Alias\":\""+strDateTime+"\",\"Server\":\""+strFile+"\"}";
		Datasource ds=Application.m_workspace.OpenDatasource(strJson);
		if(ds==null){
			log.info("打开"+strDateTime+"文件出错!");
			return null;
		}
		DatasetRaster dr=(DatasetRaster) ds.GetDataset(0);
		dr.CalcExtreme();
		int cols = dr.GetWidth();
		int rows = dr.GetHeight();
		GridData grid = new GridData();
		ArrayList<Double> dValues = new ArrayList<Double>();
		Scanline sl = new Scanline(dr.GetValueType(), cols);
		for(int r = rows-1; r >=0; r--){	
			dr.GetScanline(0, r, sl);
			for(int c = 0; c<cols; c++){
				double val = sl.GetValue(c);
				val = ((int)(val*100))/100.0;
				dValues.add(val);
			}
		}
		sl.Destroy();
		grid.setLeft(dr.GetBounds().getX());
		grid.setBottom(dr.GetBounds().getY());
		grid.setRight(dr.GetBounds().getX() + dr.GetBounds().getWidth());
		grid.setTop(dr.GetBounds().getY() + dr.GetBounds().getHeight());
		grid.setRows(dr.GetHeight());
		grid.setCols(dr.GetWidth());
		grid.setDValues(dValues);
		grid.setNoDataValue(dr.GetNoDataValue());
		Application.m_workspace.CloseDatasource(strDateTime);
		long endtime = System.currentTimeMillis();
		log.info("获取数据源耗时：" + String.valueOf(endtime - begintime));
		return grid;
	}
	/**
	 * @作者:wangkun
	 * @日期:2017年8月1日
	 * @修改日期:2017年8月1日
	 * @参数:dic-文件所有目录;fileFormat-文件格式;datetime-日期(yyyyMM)
	 * @返回:
	 * @说明:获取格点
	 */
	@POST
	@Path("getRHGrid")
	@Produces("application/json")
	public Object getRHGrid(@FormParam("para") String para){
		JSONObject jo = null;
		String dic = "";
		String fileFormat = "";
		Calendar cal = null;
		int[] hs = null;
		try {
			jo = new JSONObject(para);
			dic = jo.opt("dic").toString();//目录
			fileFormat = jo.opt("fileformat").toString();//文件格式
			String strDateTime = jo.opt("datetime").toString();//文件格式
			cal = DateUtil.parse("yyyy-MM-dd HH:mm:00", strDateTime);
			JSONArray jaHourspan = jo.getJSONArray("hourspans");
			int size = jaHourspan.length();
			hs = new int[size];
			for(int i=0;i<size;i++){
				int h = Integer.parseInt(jaHourspan.get(i).toString());
				hs[i] = h;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		GridData grid = new GridData();
		ArrayList<Double> dValues = new ArrayList();
		for(int i=0,size=hs.length;i<size;i++){
			String tempFileFormat = fileFormat;
			String strHour = String.format("%03d", hs[i]);
			String tempFileName = tempFileFormat.replace("hourspan", strHour);
			tempFileName = DateUtil.format(tempFileName, cal);
			String strTempFile = dic+tempFileName;
			File tempFile = new File(strTempFile);
			if(!tempFile.exists()){
				return null;
			}
			String alias = tempFileName;
			strTempFile = strTempFile.replace("\\", "/");
			String strJson = "{\"Type\":\"Micaps\",\"Alias\":\""+alias+"\",\"Server\":\""+strTempFile+"\"}";
			Datasource ds = Application.m_workspace.OpenDatasource(strJson);
			DatasetRaster dr=(DatasetRaster) ds.GetDataset(0);
			dr.CalcExtreme();
			int cols = dr.GetWidth();
			int rows = dr.GetHeight();
			double noVal = dr.GetNoDataValue();
			Scanline sl = new Scanline(dr.GetValueType(), cols);
			if(i==0){
				for(int r = rows - 1; r >= 0; r--){	
					dr.GetScanline(0, r, sl);
					for(int c = 0; c<cols; c++){
						double val = sl.GetValue(c);
						dValues.add(val);
					}
				}
				grid.setLeft(dr.GetBounds().getX());
				grid.setBottom(dr.GetBounds().getY());
				grid.setRight(dr.GetBounds().getX() + dr.GetBounds().getWidth());
				grid.setTop(dr.GetBounds().getY() + dr.GetBounds().getHeight());
				grid.setRows(rows);
				grid.setCols(cols);
				grid.setNoDataValue(noVal);
			}
			else{
				int cur = 0;
				for(int r = rows - 1; r >= 0; r--){	
					dr.GetScanline(0, r, sl);
					for(int c = 0; c<cols; c++){
						double val = sl.GetValue(c);
						double oldVal = dValues.get(cur);
						if(val == noVal){
							cur++;
							continue;
						}
						else if(oldVal == noVal){
							dValues.set(cur, val);
						}
						else{
							double newVal = val>oldVal?val:oldVal;
							dValues.set(cur, newVal);
						}
						cur++;
					}
				}
			}
			Application.m_workspace.CloseDatasource(alias);
		}
		grid.setDValues(dValues);
		return grid;
	}
}
