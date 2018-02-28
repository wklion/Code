package com.spd.grid.ws;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;

import com.mg.objects.Dataset;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.Recordset;
import com.spd.grid.dao.AreaDao;
import com.spd.grid.dao.impl.AreaDaoImpl;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.Area;
import com.spd.grid.domain.ClimaticRegionItem;
import com.spd.grid.domain.ClimaticRegionType;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;
import com.spd.weathermap.util.Toolkit;

/*
 * 气候区划服务
 * */
@Stateless
@Path("ClimaticRegionService")
public class ClimaticRegionService {
	
	private  Logger log = LogTool.getLogger(this.getClass());
	private String m_strAlias = "dsClimaticRegion";
	
	public Datasource getClimaticRegionDatasource()
	{
		Datasource ds = Application.m_workspace.GetDatasource(m_strAlias);
		if(ds == null)
		{
			String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
			classPath=classPath.substring(1);
			String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"dsClimaticRegion\",\"Server\":\"%s\"}", classPath + "../data/T_CLIMATICREGION_CITY.shp");
			ds = Application.m_workspace.OpenDatasource(strJson);
		}
		return ds;
	}
	
	/*
	 * 获取区划类型
	 * 参数：无
	 * 返回：表名、区划名称数组
	 * @return 
	 * */
	@POST
	@Path("getClimaticRegionTypes")
	@Produces("application/json")
	public Object getClimaticRegionTypes(@FormParam("para") String para)
	{
		ArrayList<ClimaticRegionType> types = new ArrayList<ClimaticRegionType>();
		try {
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");			
			
			types.add(new ClimaticRegionType("T_CLIMATICREGION_CITY", "行政区划"));	
			
			AreaService areaService = new AreaService();
			Map<Integer, String> areaTypes = areaService.getAreaTypeByDepart(departCode);
			for(Map.Entry<Integer, String> entry:areaTypes.entrySet()){    
				types.add(new ClimaticRegionType(entry.getKey().toString(), entry.getValue()));    
			}   
		} catch (Exception e) {
			log.error("获取区划子项名称，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return types;
	}
	
	/*
	 *  获取区划子项名称
	 * 参数：数据集名
	 * 返回：区域名称regionName，regionId
	 * @return 
	 * */
	@POST
	@Path("getClimaticRegionItemNames")
	@Produces("application/json")
	public Object getClimaticRegionItemNames(@FormParam("para") String para)
	{
		ArrayList<ClimaticRegionItem> items = new ArrayList<ClimaticRegionItem>(); 
		try {
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			String datasetname = CommonTool.getJSONStr(jsonObject, "datasetname");
			if(datasetname.equals("T_CLIMATICREGION_CITY")){
				Datasource ds = this.getClimaticRegionDatasource();
				Dataset dt = ds.GetDataset(datasetname);
				if(dt != null)
				{
					DatasetVector dtv = (DatasetVector)dt;
					Recordset rs = dtv.Query("", null);
					if(rs != null)
					{
						try
						{
							rs.MoveFirst();
							while(!rs.IsEOF())
							{
								Object obj = rs.GetFieldValue("NAME");
								if(obj != null)
									items.add(new ClimaticRegionItem(obj.toString(), rs.GetID()));				
								rs.MoveNext();
							}
						}catch (Exception e) {
							log.error("气候区划数据集获取子项名称，详情【" + e.getMessage() + "】");
							e.printStackTrace();
						}
						finally
						{
							rs.Destroy();
						}	
					}							
				}
			}
			else{
				String type = datasetname;
				AreaDao areaDao = new AreaDaoImpl();
				List<Area> areaList = areaDao.getAreasByDepartAndType(Integer.parseInt(departCode), Integer.parseInt(type));
				for(int i=0; i<areaList.size(); i++){
					Area area = areaList.get(i);
					items.add(new ClimaticRegionItem(area.getName(), area.getId()));
				}
			}
		} catch (Exception e) {
			log.error("获取区划子项名称，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return items;
	}
	
	/*
	 *  获取区划子项边界
	 * 参数：数据集名、对象ID
	 * 返回：几何对象及其属性（id,name,code,stationName,stationCode,stationX,stationY,geometry）
	 * @return 
	 * */
	@POST
	@Path("getClimaticRegionItem")
	@Produces("application/json")
	public Object getClimaticRegionItem(@FormParam("para") String para)
	{
		long begintime = System.currentTimeMillis();
		String result = null;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String datasetName = CommonTool.getJSONStr(jsonObject, "datasetName");
			Integer regionId = CommonTool.getJSONInt(jsonObject, "regionId");
			if(datasetName.equals("T_CLIMATICREGION_CITY")){
				DatasetVector dtv = (DatasetVector)this.getClimaticRegionDatasource().GetDataset(datasetName);
				result = Toolkit.convertFeatureToJson(dtv, regionId, "REGION");
			}
			else{
				AreaDao areaDao = new AreaDaoImpl();
				Area area = areaDao.getAreaById(regionId);
				
				List<Point2D> coordinates = new ArrayList<Point2D>();
				String strCoordinates = area.getCoordinates();
				String[] strs = strCoordinates.split(";");
				for (int i = 0; i < strs.length; i++) {
					String[] xy = strs[i].split(",");
					coordinates.add(new Point2D.Double(java.lang.Double.valueOf(xy[0]), java.lang.Double.valueOf(xy[1])));
				}
				
				if(coordinates.size() > 0){
					Map<String, Object> keyValue = new HashMap<String, Object>();
					keyValue.put("FEATUREID", area.getId());
					keyValue.put("NAME", area.getName());
					keyValue.put("STATIONX", area.getStationX());
					keyValue.put("STATIONY", area.getStationY());
					keyValue.put("STATIONNAM", area.getStationName());
					keyValue.put("STATIONCOD", area.getStationCode());
					result = Toolkit.convertCoordinatesToJson(area.getId(), area.getCenterX(), area.getCenterY(), coordinates, keyValue, "REGION");
				}
			}
			
		} catch (Exception e) {
			log.error("获取区划子项（边界），详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("获取区划子项（边界）：" + String.valueOf(endtime - begintime));
		return result;
	}
}
