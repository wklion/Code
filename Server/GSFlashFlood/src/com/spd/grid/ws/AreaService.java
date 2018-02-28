package com.spd.grid.ws;


import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.spd.grid.dao.AreaDao;
import com.spd.grid.dao.impl.AreaDaoImpl;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.Area;
import com.spd.grid.domain.DataBaseConnectionConfigInfo;
import com.spd.grid.domain.Depart;
import com.spd.grid.tool.Common;
import com.spd.grid.tool.ExcelUtil;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;

@Stateless
@Path("AreaService")
public class AreaService {
	private  Logger log = LogTool.getLogger(this.getClass());
	private AreaDao areaDao = new AreaDaoImpl();
	/*
	 * 添加区域
	 * 参数：表字段
	 * 返回：是否成功
	 * @return 
	 * */
	@POST
	@Path("addArea")
	@Produces("application/json")
	public Object addArea(@FormParam("para") String para)
	{
		Boolean result = false;
		try {
			JSONObject jsonObject = new JSONObject(para);
			Area area = new Area();
			Integer id = 0;
			String name = CommonTool.getJSONStr(jsonObject, "name");
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String typeName = CommonTool.getJSONStr(jsonObject, "typeName");
			Double centerX = CommonTool.getJSONDouble(jsonObject, "centerX");
			Double centerY = CommonTool.getJSONDouble(jsonObject, "centerY");
			String coordinates = CommonTool.getJSONStr(jsonObject, "coordinates");
			Date dateNow = new Date();
			String createDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dateNow);
			String createUser = CommonTool.getJSONStr(jsonObject, "createUser");
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			Integer status = 0;
			area.setName(name);
			Integer nType = Integer.parseInt(type);
			if(nType < 0)
				nType = getValidTypeID();
			area.setType(nType);
			area.setTypeName(typeName);
			area.setCenterX(centerX);
			area.setCenterY(centerY);
			area.setStationX(centerX); //采用中心点作为默认值
			area.setStationY(centerY); //采用中心点作为默认值
			area.setStationCode("默认");
			area.setCoordinates(coordinates);
			area.setCreateDate(createDate);
			area.setCreateUser(createUser);
			area.setDepartCode(departCode);
			area.setStatus(status);
			areaDao.addArea(area);
			
			result = true;
		} catch (Exception e) {
			log.error("添加区域：" + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	
	private Integer getValidTypeID() {
		Integer result = -9999;
		try {
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = "select max(type) as maxtype from t_areacustom";
			ResultSet resultSet = stmt.executeQuery(sql);
			resultSet.next();
			result = resultSet.getInt("maxtype") + 1;
			stmt.close();
			conn.close();
		} catch (Exception e) {
			log.error("getValidTypeID：" + e.getMessage());
			e.printStackTrace();
		}		
		return result;
	}
	
	/*
	 * 获取区域类型
	 * 参数：无
	 * 返回：键值对
	 * @return 
	 * */
	@POST
	@Path("getAreaType")
	@Produces("application/json")
	public Object getAreaType(@FormParam("para") String para){
		Map<Integer, String> result = null;
		try {
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			result = getAreaTypeByDepart(departCode);
			
		} catch (Exception e) {
			log.error("getValidTypeID：" + e.getMessage());
			e.printStackTrace();
		}		
		return result;
	}
	
	public Map<Integer, String> getAreaTypeByDepart(String departCode) {
		Map<Integer, String> result = new HashMap<Integer, String>();
		try {
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = "select type,typeName from t_areacustom where departCode = '" + departCode + "' group by type order by type";
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				result.put(resultSet.getInt("type"), resultSet.getString("typeName"));
			}
			stmt.close();
			conn.close();
		} catch (Exception e) {
			log.error("getValidTypeID：" + e.getMessage());
			e.printStackTrace();
		}		
		return result;
	}
	
	/*
	 * 修改区域
	 * 参数：表字段
	 * 返回：是否成功
	 * @return 
	 * */
	@POST
	@Path("updateArea")
	@Produces("application/json")
	public Object updateArea(@FormParam("para") String para)
	{
		Boolean result = false;
		try {
			JSONObject jsonObject = new JSONObject(para);
			Integer id = CommonTool.getJSONInt(jsonObject, "id");
			String name = CommonTool.getJSONStr(jsonObject, "name");
			Double centerX = CommonTool.getJSONDouble(jsonObject, "centerX");
			Double centerY = CommonTool.getJSONDouble(jsonObject, "centerY");
			String coordinates = CommonTool.getJSONStr(jsonObject, "coordinates");
			String createDate = CommonTool.getJSONStr(jsonObject, "createDate");
			String createUser = CommonTool.getJSONStr(jsonObject, "createUser");
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			Integer status = CommonTool.getJSONInt(jsonObject, "status");
			
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = String.format("UPDATE t_areacustom SET name='%s', centerX='%s', centerY='%s', coordinates='%s', createDate='%s', createUser='%s', departCode='%s', status='%s' WHERE id=%d;",
					name, centerX, centerY, coordinates, createDate, createUser, departCode, status, id);
			stmt.executeUpdate(sql);
			stmt.close();
			conn.close();
			result = true;
		} catch (Exception e) {
			log.error("添加区域：" + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	
	/*
	 * 删除区域
	 * 参数：id
	 * 返回：是否成功
	 * @return 
	 * */
	@POST
	@Path("deleteArea")
	@Produces("application/json")
	public Object deleteArea(@FormParam("para") String para)
	{
		Boolean result = false;
		try {
			JSONObject jsonObject = new JSONObject(para);
			Integer id = CommonTool.getJSONInt(jsonObject, "id");
			
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = String.format("DELETE FROM t_areacustom WHERE id=%d;", id);
			stmt.executeUpdate(sql);
			stmt.close();
			conn.close();
			result = true;
		} catch (Exception e) {
			log.error("添加区域：" + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	
	/*
	 * （根据部门）获取区域
	 * 参数：部门编码
	 * 返回：区域数组
	 * @return 
	 * */
	@POST
	@Path("getAreas")
	@Produces("application/json")
	public Object getAreas(@FormParam("para") String para)
	{
		ArrayList<Area> result = new ArrayList<Area>();
		try {
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = String.format("select * from t_areacustom where departCode='%s'", departCode);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				result.add(new Area(resultSet.getInt("id"), resultSet.getString("name"),resultSet.getDouble("centerX"),
						resultSet.getDouble("centerY"), resultSet.getString("coordinates"),resultSet.getString("createDate"),
						resultSet.getString("createUser"), resultSet.getString("departCode"),resultSet.getInt("status")));
			}
			stmt.close();
			conn.close();
		} catch (Exception e) {
			log.error("添加区域：" + e.getMessage());
			e.printStackTrace();
		}
		return result;
	}
	@POST
	@Path("getAreasForGrid")
	@Produces("application/json")
	public Object getAreasForGrid(@FormParam("para") String para) throws Exception{   
		JSONObject jsonObject = new JSONObject(para);
		String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
		List<Area> areaList = areaDao.getAreaByDepartCode(Integer.parseInt(departCode));
		int count = areaDao.countAreaByDepartCode(Integer.parseInt(departCode));
		Gson json = new Gson();
		JsonObject result = new JsonObject();
		return json.toJson(areaList).toString();
		
	}
	
	@POST
	@Path("getAreasByType")
	@Produces("application/json")
	public Object getAreasByType(@FormParam("para") String para) throws Exception{
		JSONObject jsonObject = new JSONObject(para);
		String type = CommonTool.getJSONStr(jsonObject, "type");
		List<Area> areaList = areaDao.getAreaByType(Integer.parseInt(type));
		Gson json = new Gson();
		return json.toJson(areaList).toString();
	}

	@POST
	@Path("getAreasByDepartAndType")
	@Produces("application/json")
	public Object getAreasByDepartAndType(@FormParam("para") String para) throws Exception{
		JSONObject jsonObject = new JSONObject(para);
		String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
		String type = CommonTool.getJSONStr(jsonObject, "type");
		List<Area> areaList = areaDao.getAreasByDepartAndType(Integer.parseInt(departCode), Integer.parseInt(type));
		Gson json = new Gson();
		return json.toJson(areaList).toString();
	}
	
	@POST
	@Path("getDepartByUser")
	@Produces("application/json")
	public Object getDepartByUser(@FormParam("para") String para,
			@Context HttpServletRequest request,
			@Context HttpServletResponse response){
		Depart result = null;
		try {
			JSONObject jsonObject;
			jsonObject = new JSONObject(para);
			String userName = jsonObject.getString("userName");
			
			//DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = GridService.dataBaseConnectionConfigInfo;
			DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = (DataBaseConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("dataBaseConnectionConfigInfo");			
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = String.format("select * from t_depart where departCode in (select departCode from t_user_depart where userName='%s')", userName);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				result = new Depart(resultSet.getInt("DepartID"), resultSet.getInt("AreaID"), resultSet.getString("DepartName"),
						resultSet.getInt("Parent_ID"), resultSet.getString("DepartCode"), resultSet.getString("CodeOfTownForecast"), resultSet.getString("CodeOfGuidanceForecast"));
				break;
			}
			stmt.close();
			conn.close();			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	
	/**
	 * 批量导入区域
	 * @throws Exception
	 */
	
	    @SuppressWarnings("unchecked")
		@POST  
	    @Path("exportAreas")  
	    @Consumes(MediaType.MULTIPART_FORM_DATA)
	    public Object exportAreas(@Context HttpServletRequest request){  
				String filePath =null;
				boolean isUpload = ServletFileUpload.isMultipartContent(request);
				if (isUpload) {
					DiskFileItemFactory factory = new DiskFileItemFactory();
					ServletFileUpload upload = new ServletFileUpload(factory);
							List<FileItem> items = null;
							try {
								
								items = upload.parseRequest(request);
							} catch (FileUploadException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							System.out.println(items.size());
							Iterator iter = items.iterator();
							while (iter.hasNext()) {
								FileItem item = (FileItem) iter.next();
								if (!item.isFormField()) {
									filePath = item.getName();
									// System.out.println(filePath);
									File txtFile = new File(Common.FILE_PATH + filePath);
									if (txtFile.exists()) {
										txtFile.delete();
									}
									try {
										item.write(txtFile);
									} catch (Exception e) {
										e.printStackTrace();
										
									}
			
								}
							}
					}
	    	 
	    	         List<Map> list = null;
					try {
						list = ExcelUtil.readExcel(Common.FILE_PATH+filePath);
					} catch (Exception e) {
						e.printStackTrace();
						log.error("文件导入失败,请检查文件是否被占用");
					}
					int intTypeValue = getValidTypeID();
					String strCreateDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	    	         for(Map map:list){
	    	        	 Area area = new Area();
	    	        	 area.setName(map.get("name").toString());
	    	        	 area.setCenterX(Double.parseDouble(map.get("centerX").toString()));
	    	        	 area.setCenterY(Double.parseDouble(map.get("centerY").toString()));
	    	        	 area.setCreateDate(strCreateDate);
	    	        	 area.setCreateUser(map.get("createUser").toString());
	    	        	 double departCode = Double.parseDouble(map.get("departCode").toString());
	    	        	 Integer intDepartCodeValue = (int)departCode;
	    	        	 area.setDepartCode(intDepartCodeValue.toString());	    	        	 
	    	        	 area.setType(intTypeValue);
	    	        	 area.setTypeName(map.get("typeName").toString());	    	        	 
	    	        	 double stationCode = Double.parseDouble(map.get("stationCode").toString());
	    	        	 Integer intStationCodeValue = (int)stationCode;
	    	        	 area.setStationCode(intStationCodeValue.toString());
	    	        	 area.setStationName(map.get("stationName").toString());
	    	        	 area.setStationX(Double.parseDouble(map.get("stationX").toString()));
	    	        	 area.setStationY(Double.parseDouble(map.get("stationY").toString()));
	    	        	 
	    	        	 area.setStatus(0);
	    	        	 area.setCoordinates(map.get("coordinates").toString());
	    	        	 try {
							areaDao.addArea(area);
						} catch (Exception e) {
							e.printStackTrace();
						}
	    	         }
	    	         
			         System.out.println(list.size());
	    	         return "导入成功 "; 

		 
	 }
	    /**
	     * 修改区域2
	     * @throws Exception 
	     */
	    
	    @POST
		@Path("updateArea2")
		@Produces("application/json")
		public Object updateArea2(@FormParam("para") String para) throws Exception{
	    	JSONObject jsonObject = null;
	    	Area area = new Area();
			try {
				jsonObject = new JSONObject(para);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String name = CommonTool.getJSONStr(jsonObject, "name");
			String stationCode = CommonTool.getJSONStr(jsonObject, "stationCode");
			String stationName = CommonTool.getJSONStr(jsonObject, "stationName");
			Double stationX = CommonTool.getJSONDouble(jsonObject, "stationX");
			Double stationY = CommonTool.getJSONDouble(jsonObject, "stationY");
	    	String id = CommonTool.getJSONStr(jsonObject, "id");
	    	area = areaDao.getAreaById(Integer.parseInt(id));
	    	if(area!=null){
	    		area.setName(name);
	    		area.setStationCode(stationCode);
	    		area.setStationName(stationName);
	    		area.setStationX(stationX);
	    		area.setStationY(stationY);
	    		areaDao.updateAreaName(area);
	    	}else{
	    		
	    		return false;
	    	}
	    	return true;
	    }
	    
	
	
	
	
}
