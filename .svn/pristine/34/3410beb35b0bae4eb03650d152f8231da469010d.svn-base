package com.spd.grid.ws;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.springframework.web.context.ContextLoader;

import com.mg.objects.Analyst;
import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.mg.objects.DatasetVector;
import com.mg.objects.Datasource;
import com.mg.objects.GeoPoint;
import com.mg.objects.GeoRegion;
import com.mg.objects.Recordset;
import com.mg.objects.Scanline;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.DataBaseConnectionConfigInfo;
import com.spd.grid.domain.FileInfo;
import com.spd.grid.domain.ForecastData;
import com.spd.grid.domain.ElementDefine;
import com.spd.grid.domain.OutputSetting;
import com.spd.grid.domain.Scheme;
import com.spd.grid.domain.Application;
import com.spd.grid.domain.DatasourceConnectionConfigInfo;
import com.spd.grid.domain.GridInfo;
import com.spd.grid.domain.KeyStation;
import com.spd.grid.domain.SendInfo;
import com.spd.grid.domain.Station;
import com.spd.grid.pojo.CommonConfig;
import com.spd.grid.service.IForecastfineService;
import com.spd.grid.service.impl.FTPService;
import com.spd.grid.tool.BaoWenFileFilter;
import com.spd.grid.tool.Export;
import com.spd.grid.tool.ExportGrib2;
import com.spd.grid.tool.ExportMicaps;
import com.spd.grid.tool.GridUtil;
import com.spd.weathermap.domain.GridValueInfo;
import com.spd.weathermap.domain.LastGridInfo;
import com.spd.weathermap.domain.GridData;
import com.spd.weathermap.util.CommonTool;
import com.spd.weathermap.util.LogTool;
import com.spd.weathermap.util.Toolkit;

/*
 * 
 * 格点服务
 * by zouwei, 2015-05-10
 * 
 * */
@Stateless
@Path("GridService")
public class GridService {
	
	private  Logger log = LogTool.getLogger(this.getClass());
	private static ArrayList<String> m_datasetRefreshList = new ArrayList<String>();
	private static Map<String,Integer> m_datasetUpdateTime = new HashMap<String,Integer>();
	private static Map<String,Rectangle2D> m_areaBounds = new HashMap<String,Rectangle2D>();
	
	private static Datasource m_datasource = null;					//格点数据源
	private static Datasource m_datasourceNWP = null;				//模式数据源
	private static Map<Integer, Datasource> m_datasourceHis = null; //历史格点数据源
	
	public static DatasourceConnectionConfigInfo datasourceConnectionConfigInfo; 	//格点（空间）实时数据库连接信息
	public static DatasourceConnectionConfigInfo hisDatasourceConnectionConfigInfo; //格点（空间）历史数据库连接信息
	public static DatasourceConnectionConfigInfo nwpConnectionConfigInfo; 		 	//模式（空间）数据库连接信息
	public static DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo;	 	//业务（属性）数据库连接信息
	private static CommonConfig commonfig;
	
	private static Statement statmentForGDYBDB = null;  //GDYB数据库连接
	
	static {
		commonfig = (CommonConfig)ApplicationContextFactory.getInstance().getBean("commonConifg");
		//打开格点预报产品-实时库
		datasourceConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("datasourceConnectionConfigInfo");
		String strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				datasourceConnectionConfigInfo.getType(), datasourceConnectionConfigInfo.getAlias(), datasourceConnectionConfigInfo.getServer(), 
				datasourceConnectionConfigInfo.getUser(),datasourceConnectionConfigInfo.getPassword(), datasourceConnectionConfigInfo.getDatabase(), 
				datasourceConnectionConfigInfo.getPort());
		m_datasource = Application.m_workspace.OpenDatasource(strJson);	
		
		//打开格点预报产品-历史库
		if(ApplicationContextFactory.getInstance().containsBean("hisDatasourceConnectionConfigInfo"))
		{
			hisDatasourceConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("hisDatasourceConnectionConfigInfo");
			m_datasourceHis = new HashMap<Integer, Datasource>();
			Calendar calendar = Calendar.getInstance();
			int nowYear = calendar.get(Calendar.YEAR);
			for(Integer i=2015; i <= nowYear; i++){
				strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
						hisDatasourceConnectionConfigInfo.getType(), hisDatasourceConnectionConfigInfo.getAlias() + "_" + i.toString(), hisDatasourceConnectionConfigInfo.getServer(), 
						hisDatasourceConnectionConfigInfo.getUser(),hisDatasourceConnectionConfigInfo.getPassword(), hisDatasourceConnectionConfigInfo.getDatabase() + "_" + i.toString(),
						//hisDatasourceConnectionConfigInfo.getUser(),hisDatasourceConnectionConfigInfo.getPassword(), hisDatasourceConnectionConfigInfo.getDatabase(),
						hisDatasourceConnectionConfigInfo.getPort());
				Datasource datasource = Application.m_workspace.OpenDatasource(strJson);	
				if(datasource != null)
					m_datasourceHis.put(i, datasource);	
			}	
		}
		
		//打开数值模式库
		nwpConnectionConfigInfo = (DatasourceConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("nwpConnectionConfigInfo");
		strJson = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"%s\",\"User\":\"%s\",\"Password\":\"%s\",\"DB\":\"%s\",\"Port\":\"%s\"}",
				nwpConnectionConfigInfo.getType(), nwpConnectionConfigInfo.getAlias(), nwpConnectionConfigInfo.getServer(), 
				nwpConnectionConfigInfo.getUser(),nwpConnectionConfigInfo.getPassword(), nwpConnectionConfigInfo.getDatabase(), 
				nwpConnectionConfigInfo.getPort());
		m_datasourceNWP = Application.m_workspace.OpenDatasource(strJson);	
		
		//打开业务数据库
		dataBaseConnectionConfigInfo = (DataBaseConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("dataBaseConnectionConfigInfo");
		
		try {
			Class.forName("com.mysql.jdbc.Driver"); //加载MySql的驱动类
			
			//预先创建数据库连接，避免重复连接，提高效率	
			try {
				Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
						dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
				statmentForGDYBDB = conn.createStatement();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}			
		} catch (ClassNotFoundException e) {
			System.out.println("找不到驱动程序类 ，加载驱动失败！");
			e.printStackTrace();
		}
	}
	
	/*
	 * 获取格点数据集名
	 * */
	public String getGridDatasetName(String type,String level,String element,Date maketime,String version,Date date,Integer hour)
	{
		String result = "";
		if(level==null || level.equals("") || level.equals("null") || level.equals("undefined")) //不含层次的是格点产品
			level = "1000";
		result = String.format("t_%s_%s_%s_%s_%s_%s_%s", type, element, new SimpleDateFormat("yyMMddHHmm").format(maketime), version, new SimpleDateFormat("yyMMddHH").format(date), new DecimalFormat("000").format(hour), level);
		return result;
	}
	
	//通过数据集名获取所处数据源
	public Datasource getDatasource(String datasetName) {
		Datasource ds = null;
		Integer year = this.getDataYear(datasetName);
		if(year < 0)
			ds = m_datasource;
		else if(m_datasourceHis != null) {
			if(m_datasourceHis.containsKey(year))
				ds = m_datasourceHis.get(year);
		}
		return ds;
	}
	
	// 通过数据集名获取所处年份，判断是否实时数据（7天内）
	// 返回：所处年份，如果是实时数据则返回-1
	public Integer getDataYear(String datasetName) {
		Integer result = -1;
		try {
			String[] strs = datasetName.split("_");
			if(strs.length < 4)
				return result;
			Date makeTime = new SimpleDateFormat("yyMMddHH").parse(strs[5]);
			Date nowTime = new Date();
			long days = (nowTime.getTime()-makeTime.getTime())/(24*60*60*1000);
			if(days > 7){
				Calendar calendar =  Calendar.getInstance();
				calendar.setTime(makeTime);
				result = calendar.get(Calendar.YEAR);
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("getDataYear：" + e.getMessage());
		}		
		return result;
	}
	
	
	/**
	 * 获取数据集
	 * @return
	 */
	public Dataset getDataset(String datasetName, Boolean findFromMetaData)
	{
		Dataset dataset = null;		
		Datasource  datasource = null;
		if(datasetName.startsWith("t_prvn") || datasetName.startsWith("t_cty") || datasetName.startsWith("t_cnty")){
			datasource = this.getDatasource(datasetName);
		}
		else {
			datasource = m_datasourceNWP;
		}
		
		if(datasource == null)
			return dataset;
		else
			dataset = datasource.GetDataset(datasetName);
		
		if(dataset == null && findFromMetaData){ 
			if(this.existDataset(datasetName)){				
				log.info("刷新数据源前："+datasource.GetDatasetCount());
				datasource.Refresh();
				log.info("刷新数据源后："+datasource.GetDatasetCount());
				dataset = datasource.GetDataset(datasetName);
			}
		}
		return dataset;
	}
	
	/*
	 * （根据MySQL的数据源元数据表）判断数据集是否存在
	 * */
	private Boolean existDataset(String datasetName){
		Boolean result = false;
		try {
			Connection conn = null;
			if(datasetName.startsWith("t_prvn") || datasetName.startsWith("t_cty") || datasetName.startsWith("t_cnty")){
				Integer year = this.getDataYear(datasetName);				
				if(year < 0){
					conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", datasourceConnectionConfigInfo.getServer(), 
							datasourceConnectionConfigInfo.getPort(), datasourceConnectionConfigInfo.getDatabase()),
							datasourceConnectionConfigInfo.getUser(),datasourceConnectionConfigInfo.getPassword());	
				}
				else{
					conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", hisDatasourceConnectionConfigInfo.getServer(), 
							hisDatasourceConnectionConfigInfo.getPort(), hisDatasourceConnectionConfigInfo.getDatabase() + "_" + year.toString()),
							//hisDatasourceConnectionConfigInfo.getPort(), hisDatasourceConnectionConfigInfo.getDatabase()),
							hisDatasourceConnectionConfigInfo.getUser(),hisDatasourceConnectionConfigInfo.getPassword());	
				}
			}
			else{
				conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", nwpConnectionConfigInfo.getServer(), 
						nwpConnectionConfigInfo.getPort(), nwpConnectionConfigInfo.getDatabase()),
						nwpConnectionConfigInfo.getUser(),nwpConnectionConfigInfo.getPassword());	
			}
			if(conn != null){
				Statement  stmt = conn.createStatement();
				String sql = String.format("select count(*) as rowCount from mgdatasetrasterinfo where MGName='%s'", datasetName);
				ResultSet resultSet = stmt.executeQuery(sql);
				resultSet.next();
				int rowCount = resultSet.getInt("rowCount");
				result = rowCount>0;
				stmt.close();
				conn.close();	
			}			
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 获取有效的数据源别名
	 * */
	private String getValidDatasourceAlias(String strAlias)
	{
		String result = strAlias;
		if(Application.m_workspace.GetDatasource(strAlias) != null)
		{
			int i = 0;
			while(true)
			{
				result = strAlias + String.valueOf(i);
				if(Application.m_workspace.GetDatasource(result) == null)
					break;
				i++;
			}	
		}		
		return result;
	}
	
//	private Boolean isGridProductType(String type)
//	{
//		return type.equals("BJ") || type.equals("OBJ") || type.equals("PRVN") || type.equals("CTY");
//	}
	
	/*
	 * 获取最新格点数据信息
	 * 参数：格点类型（数值模式类型或格点产品类型）
	 * 返回：时次、时效列表、要素列表、层次列表
	 * @return 
	 * */
	@POST
	@Path("getLastGridInfo")
	@Produces("application/json")
	public Object getLastGridInfo(@FormParam("para") String para)
	{
		LastGridInfo info  = new LastGridInfo();
		try {
		JSONObject jsonObject = new JSONObject(para);
		String type = CommonTool.getJSONStr(jsonObject, "type");
		
		String strStartWith = "t_" + type;
		ArrayList<String> datasetNamesArrayList = this.getDatasetNames(strStartWith);
		
		String strLastDateTime = null;
		int nIndexDateTime = 5; //时次索引
		ArrayList<String> strDatasetNames = new ArrayList<String>();
		ArrayList<String> datetimeSerial = new ArrayList<String>();       //时序，便于客户端上下翻
		for(Integer i=0; i<datasetNamesArrayList.size(); i++)
		{
			String strDatasetName = datasetNamesArrayList.get(i).toLowerCase();
			strDatasetNames.add(strDatasetName);
			String[] strs = strDatasetName.split("_");
			if(strs != null && strs.length >= 8)
			{			
				String strDateTime = strs[nIndexDateTime];
				if(strLastDateTime == null || strLastDateTime.compareTo(strDateTime) < 0)
					strLastDateTime = strDateTime;
				
				//记录历史时次
				String strDateTimeEntire = String.format("20%s-%s-%s %s:00:00", strDateTime.substring(0,2), strDateTime.substring(2,4), strDateTime.substring(4,6), strDateTime.substring(6,8));
				if(!datetimeSerial.contains(strDateTimeEntire))
					datetimeSerial.add(strDateTimeEntire);
			}
		}
		if(datetimeSerial.size() == 0)
		{
			System.out.println("getLastGridInfo 时序为空");
			return info;
		}
		Collections.sort(datetimeSerial); //时次排序
		ArrayList<String> strElements = new ArrayList<String>();
		ArrayList<String> strLevels = new ArrayList<String>();
		ArrayList<String> strHourSpans = new ArrayList<String>();
		for(Integer i=0; i<strDatasetNames.size(); i++)
		{
			String strDatasetName = strDatasetNames.get(i);
			String[] strs = strDatasetName.split("_");
			if(strs.length >= 8)
			{
				if(!strElements.contains(strs[2])) //要素要返回所有时次的预报要素
					strElements.add(strs[2]);	
				if(strDatasetName.contains(strLastDateTime))
				{	
						if(!strHourSpans.contains(strs[6]))
							strHourSpans.add(strs[6]);
						if(strs.length >= 8)
						{
							if(!strLevels.contains(strs[7]))
								strLevels.add(strs[7]);
						}
				}	
			}						
		}
		String elements = "";
		for(Integer i=0; i<strElements.size(); i++)
			elements+=strElements.get(i)+",";
		elements = elements.substring(0, elements.length() - 1);
		String levels = "";
		if(strLevels.size() > 0)
		{
			for(Integer i=0; i<strLevels.size(); i++)
				levels+=strLevels.get(i)+",";
			levels = levels.substring(0, levels.length() - 1);
		}		
		String hourspans = "";
		for(Integer i=0; i<strHourSpans.size(); i++)
		{
			Integer nHourSpan = Integer.valueOf(strHourSpans.get(i)); //去掉前面的0
			hourspans+=nHourSpan.toString()+",";
		}
		hourspans = hourspans.substring(0, hourspans.length() - 1);
		strLastDateTime = String.format("20%s-%s-%s %s:00:00", strLastDateTime.substring(0,2), strLastDateTime.substring(2,4), strLastDateTime.substring(4,6), strLastDateTime.substring(6,8)); 
		info.setDateTime(strLastDateTime);
		info.setElements(elements);
		info.setHourSpans(hourspans);
		info.setLevels(levels);
		info.setDatetimeSerial(datetimeSerial);
		} catch (Exception e) {
			log.error("获取最新格点数据信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return info;
	}
	
	/*
	 * （根据MySQL的数据源元数据表）获取数据集名
	 * */
	private ArrayList<String> getDatasetNames(String datasetNamePrefix){
		ArrayList<String> result = new ArrayList<String>();
		try {
			DatasourceConnectionConfigInfo dci = (datasetNamePrefix.startsWith("t_prvn") || datasetNamePrefix.startsWith("t_cty") || datasetNamePrefix.startsWith("t_cnty")) ? datasourceConnectionConfigInfo : nwpConnectionConfigInfo;
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dci.getServer(), dci.getPort(), dci.getDatabase()), dci.getUser(),dci.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select MGName from mgdatasetrasterinfo where MGName like '%s%%'", datasetNamePrefix);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				result.add(resultSet.getString("MGName"));
			}
			stmt.close();
			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 根据要素，获取所有时效。不同要素，时效不同，比如24小时降水，时效为：24、48、72等
	 * 参数：类型
	 * 返回：时次
	 * @return 
	 * */
	@POST
	@Path("getHourSpanWithElement")
	@Produces("application/json")
	public Object getHourSpanWithElement(@FormParam("para") String para)
	{
		ArrayList<Integer> arrayHourSpan = new ArrayList<Integer>(); 
		try {
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			Date dateMake = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			String prefix = String.format("t_%s_%s_%s_%s_%s", type, element, new SimpleDateFormat("yyMMddHHmm").format(dateMake), version, new SimpleDateFormat("yyMMddHH").format(date));
			Integer nIndexHourSpan = 6;
			
			ArrayList<String> datasetNames = getDatasetNames(prefix);
			for(Integer i=0; i<datasetNames.size(); i++){
				String[] strs = datasetNames.get(i).split("_");
				if(strs != null && strs.length >= nIndexHourSpan)
				{			
					if(!arrayHourSpan.contains(strs[nIndexHourSpan]))
						arrayHourSpan.add(Integer.valueOf(strs[nIndexHourSpan]));
				}
			}
		} catch (Exception e) {
			log.error("根据要素，获取所有时效，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return arrayHourSpan;
	}
	
	/*
	 * 获取默认方案
	 * @return 
	 * */
	@POST
	@Path("getGridDefaultScheme")
	@Produces("application/json")
	public Object getGridDefaultScheme(@FormParam("para") String para)
	{
		ArrayList<Scheme> arrayScheme = new ArrayList<Scheme>(); 
		try {
			arrayScheme = this.getDefaultScheme();
		} catch (Exception e) {
			log.error("获取默认方案错误：" + e.getMessage());
			e.printStackTrace();
		}
		return arrayScheme;
	}
		
	/**
	 * 获取格点数据
	 * @return
	 */
	@POST
	@Path("getGrid")
	@Produces("application/json")
	public Object getGrid(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		GridData grid = new GridData();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");
			
			if(element.equals("10uv") || element.equals("wmax"))
			{
				String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
				String strDatasetNameU = strDatasetName+"_u";
				String strDatasetNameV = strDatasetName+"_v";
				Dataset dtU = this.getDataset(strDatasetNameU, true);
				Dataset dtV = this.getDataset(strDatasetNameV, true);
				if(dtU == null || dtV == null)
				{
					log.error("数据集不存在，详情【" + strDatasetName + "】");
				}	
				else
				{
					DatasetRaster dgU  = (DatasetRaster)dtU;
					dgU.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算
					DatasetRaster dgV  = (DatasetRaster)dtV;
					dgV.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算
					dgU.Open(); //考虑分布式服务，需要清除缓存
					dgV.Open(); //考虑分布式服务，需要清除缓存
					dgU.Close(); //考虑分布式服务，需要清除缓存
					dgV.Close(); //考虑分布式服务，需要清除缓存
					ArrayList<Double> dValues = new ArrayList<Double>();
					int cols = dgU.GetWidth();
					int rows = dgU.GetHeight();
					double noDataValue = dgU.GetNoDataValue();
					Scanline slU = new Scanline(dgU.GetValueType(), cols);
					Scanline slV = new Scanline(dgV.GetValueType(), cols);
					for(int i = rows - 1; i >= 0; i--)
					{	
						dgU.GetScanline(0, i, slU);
						dgV.GetScanline(0, i, slV);
						for(int j = 0; j<cols; j++)
						{							
//							double u = dgU.GetValue(j, i);
//							double v = dgV.GetValue(j, i);
							double u = slU.GetValue(j);
							double v = slV.GetValue(j);
							if(u == noDataValue || v == noDataValue)
							{
								dValues.add(noDataValue);
								dValues.add(noDataValue);	
							}
							else
							{
								if(u == 0.0 && v == 0.0){
									dValues.add(0.0);
									dValues.add(0.0);
								}
								else{
									Double dSpeed = Math.sqrt(u*u + v*v);
									Double dDirection = 270.0-Math.atan2(v, u)*180.0/Math.PI;
									dSpeed = Math.round(dSpeed*10.0)/10.0;
									dDirection = Math.round(dDirection*10.0)/10.0;
									dValues.add(dDirection);
									dValues.add(dSpeed);	
								}													
							}
						}
					}
					slU.Destroy();
					slV.Destroy();
					dgU.Close(); //避免内存溢出，需要清除缓存
					dgV.Close(); //避免内存溢出，需要清除缓存
					grid.setLeft(dgU.GetBounds().getX());
					grid.setBottom(dgU.GetBounds().getY());
					grid.setRight(dgU.GetBounds().getX() + dgU.GetBounds().getWidth());
					grid.setTop(dgU.GetBounds().getY() + dgU.GetBounds().getHeight());
					grid.setRows(dgU.GetHeight());
					grid.setCols(dgU.GetWidth());
					grid.setDValues(dValues);
					grid.setNoDataValue(dgU.GetNoDataValue());
				}	
			}
			else
			{
				String strDatasetName = getGridDatasetName(type, level, element ,maketime, version, date, hour);
				Dataset dt = this.getDataset(strDatasetName, true);
				if(dt == null)
				{
					log.error("数据集不存在，详情【" + strDatasetName + "】");
				}	
				else
				{
//					DatasetRaster dg  = (DatasetRaster)dt;
//					grid = Toolkit.convertDatasetRasterToGridData(dg);
					String strDatasetNameTag = strDatasetName+"_t";
					Dataset dtTag = this.getDataset(strDatasetNameTag, false);
					if(dtTag != null){ //有Tag属性
						DatasetRaster dg  = (DatasetRaster)dt;
						dg.CalcExtreme();
						DatasetRaster dgTag  = (DatasetRaster)dtTag;
						dgTag.CalcExtreme();
						dg.Open(); //考虑分布式服务，需要清除缓存
						dgTag.Open(); //考虑分布式服务，需要清除缓存
						dg.Close(); //考虑分布式服务，需要清除缓存
						dgTag.Close(); //考虑分布式服务，需要清除缓存
						ArrayList<Double> dValues = new ArrayList<Double>();
						int cols = dg.GetWidth();
						int rows = dg.GetHeight();
						Scanline sl = new Scanline(dg.GetValueType(), cols);
						Scanline slTag = new Scanline(dgTag.GetValueType(), cols);
						for(int i = rows - 1; i >= 0; i--)
						{	
							dg.GetScanline(0, i, sl);
							dgTag.GetScanline(0, i, slTag);
							for(int j = 0; j<cols; j++)
							{
								double val = sl.GetValue(j);
								double tag = slTag.GetValue(j);
								dValues.add(val);
								dValues.add(tag);	
							}
						}			
						dg.Close(); //避免内存溢出，需要清除缓存
						dgTag.Close(); //避免内存溢出，需要清除缓存				
						grid.setLeft(dg.GetBounds().getX());
						grid.setBottom(dg.GetBounds().getY());
						grid.setRight(dg.GetBounds().getX() + dg.GetBounds().getWidth());
						grid.setTop(dg.GetBounds().getY() + dg.GetBounds().getHeight());
						grid.setRows(dg.GetHeight());
						grid.setCols(dg.GetWidth());
						grid.setDValues(dValues);
						grid.setNoDataValue(dg.GetNoDataValue());
					}
					else{ //无Tag属性
						DatasetRaster dg  = (DatasetRaster)dt;
						dg.Open(); //考虑分布式服务，需要清除缓存
						dg.Close(); //考虑分布式服务，需要清除缓存
						grid = Toolkit.convertDatasetRasterToGridData(dg);
						dg.Close(); //避免内存溢出，需要清除缓存
					}	
				}	
			}			
		} catch (Exception e) {
			log.error("获取格点数据失败，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
//		System.out.println("获取填图数据耗时：" + String.valueOf(endtime - begintime));
		log.info("获取格点数据耗时：" + String.valueOf(endtime - begintime));
		return grid;
		//return result;
	}
	
	/**
	 * 获取UV格点场
	 * @return
	 */
	@POST
	@Path("getUV")
	@Produces("application/json")
	public Object getUV(@FormParam("para") String para) {
		GridData grid = new GridData();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");
			
			if(element.equals("10uv") || element.equals("wmax"))
			{
				String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
				String strDatasetNameU = strDatasetName+"_u";
				String strDatasetNameV = strDatasetName+"_v";
				Dataset dtU = this.getDataset(strDatasetNameU, true);
				Dataset dtV = this.getDataset(strDatasetNameV, true);
				if(dtU == null || dtV == null)
				{
					log.error("数据集不存在，详情【" + strDatasetName + "】");
				}	
				else
				{
					DatasetRaster dgU  = (DatasetRaster)dtU;
					dgU.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算
					DatasetRaster dgV  = (DatasetRaster)dtV;
					dgV.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算
					dgU.Open(); //考虑分布式服务，需要清除缓存
					dgV.Open(); //考虑分布式服务，需要清除缓存
					dgU.Close(); //考虑分布式服务，需要清除缓存
					dgV.Close(); //考虑分布式服务，需要清除缓存
					ArrayList<Double> dValues = new ArrayList<Double>();
					int cols = dgU.GetWidth();
					int rows = dgU.GetHeight();
					double noDataValue = dgU.GetNoDataValue();
					Scanline slU = new Scanline(dgU.GetValueType(), cols);
					Scanline slV = new Scanline(dgV.GetValueType(), cols);
					for(int i = rows - 1; i >= 0; i--)
					{	
						dgU.GetScanline(0, i, slU);
						dgV.GetScanline(0, i, slV);
						for(int j = 0; j<cols; j++)
						{
							double u = slU.GetValue(j);
							double v = slV.GetValue(j);
							if(u == noDataValue || v == noDataValue)
							{
								dValues.add(noDataValue);
								dValues.add(noDataValue);	
							}
							else
							{
								dValues.add(u);
								dValues.add(v);									
							}
						}
					}
					slU.Destroy();
					slV.Destroy();
					dgU.Close(); //避免内存溢出，需要清除缓存
					dgV.Close(); //避免内存溢出，需要清除缓存
					grid.setLeft(dgU.GetBounds().getX());
					grid.setBottom(dgU.GetBounds().getY());
					grid.setRight(dgU.GetBounds().getX() + dgU.GetBounds().getWidth());
					grid.setTop(dgU.GetBounds().getY() + dgU.GetBounds().getHeight());
					grid.setRows(dgU.GetHeight());
					grid.setCols(dgU.GetWidth());
					grid.setDValues(dValues);
					grid.setNoDataValue(dgU.GetNoDataValue());
				}	
			}			
		} catch (Exception e) {
			log.error("获取格点数据失败，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return grid;
	}
	
	/**
	 * 批量获取格点数据集合，按要素获取全部时效的格点预报产品
	 * @return
	 */
	@POST
	@Path("getGrids")
	@Produces("application/json")
	public Object getGrids(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		ArrayList<GridData> grids = new ArrayList<GridData>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			String strHourSpans = CommonTool.getJSONStr(jsonObject, "hourspans");
			String[] hourSpans = strHourSpans.split(","); 
			
			int nindex = 0;
			for(String hourSpan : hourSpans){
				GridData grid = new GridData();
				try
				{					
					Integer hour = Integer.valueOf(hourSpan);
					if(element.equals("10uv") || element.equals("wmax"))
					{
						String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
						String strDatasetNameU = strDatasetName+"_u";
						String strDatasetNameV = strDatasetName+"_v";
						Dataset dtU = this.getDataset(strDatasetNameU, nindex==0);
						Dataset dtV = this.getDataset(strDatasetNameV, nindex==0);
						if(dtU == null || dtV == null)
						{
							//log.error("数据集不存在，详情【" + strDatasetName + "】");
						}	
						else
						{
							dtU.Open(); //考虑分布式服务，需要清除缓存
							dtV.Open(); //考虑分布式服务，需要清除缓存
							dtU.Close(); //考虑分布式服务，需要清除缓存
							dtV.Close(); //考虑分布式服务，需要清除缓存
							
							DatasetRaster dgU  = (DatasetRaster)dtU;
							dgU.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算。会引发崩溃，注释后结果是正确的。
							DatasetRaster dgV  = (DatasetRaster)dtV;
							dgV.CalcExtreme(); //极值未保存，放在内存，打开要算，数据修改后也要算。会引发崩溃，注释后结果是正确的。
							ArrayList<Double> dValues = new ArrayList<Double>();
							int cols = dgU.GetWidth();
							int rows = dgU.GetHeight();
							double noDataValue = dgU.GetNoDataValue();
							Scanline slU = new Scanline(dgU.GetValueType(), cols);
							Scanline slV = new Scanline(dgV.GetValueType(), cols);
							double u = noDataValue;
							double v = noDataValue;
							Double dSpeed = noDataValue;
							Double dDirection = noDataValue;
							for(int i = rows - 1; i >= 0; i--)
							{	
								dgU.GetScanline(0, i, slU);
								dgV.GetScanline(0, i, slV);
								for(int j = 0; j<cols; j++)
								{
									u = slU.GetValue(j);
									v = slV.GetValue(j);
									if(u == noDataValue || v == noDataValue)
									{
										dValues.add(noDataValue);
										dValues.add(noDataValue);	
									}
									else
									{
										if(u == 0.0 && v == 0.0){
											dValues.add(0.0);
											dValues.add(0.0);
										}
										else{
											dSpeed = Math.sqrt(u*u + v*v);
											dDirection = 270.0-Math.atan2(v, u)*180.0/Math.PI;
											dSpeed = Math.round(dSpeed*10.0)/10.0;
											dDirection = Math.round(dDirection*10.0)/10.0;
											dValues.add(dDirection);
											dValues.add(dSpeed);	
										}															
									}
								}
							}		
							slU.Destroy();
							slV.Destroy();
							dtU.Close(); //内存溢出，需要清除缓存
							dtV.Close(); //内存溢出，需要清除缓存
							grid.setLeft(dgU.GetBounds().getX());
							grid.setBottom(dgU.GetBounds().getY());
							grid.setRight(dgU.GetBounds().getX() + dgU.GetBounds().getWidth());
							grid.setTop(dgU.GetBounds().getY() + dgU.GetBounds().getHeight());
							grid.setRows(dgU.GetHeight());
							grid.setCols(dgU.GetWidth());
							grid.setDValues(dValues);
							grid.setNoDataValue(dgU.GetNoDataValue());
						}	
					}
					else
					{
						String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
						Dataset dt = this.getDataset(strDatasetName, nindex == 0);
						if(dt == null)
						{
							log.error("数据集不存在，详情【" + strDatasetName + "】");
						}	
						else
						{														
							String strDatasetNameTag = strDatasetName+"_t";
							Dataset dtTag = this.getDataset(strDatasetNameTag, false);
							if(dtTag != null){ //有Tag属性
								DatasetRaster dg  = (DatasetRaster)dt;
								dg.CalcExtreme();
								DatasetRaster dgTag  = (DatasetRaster)dtTag;
								dgTag.CalcExtreme();								
								dg.Open(); //考虑分布式服务，需要清除缓存
								dgTag.Open(); //考虑分布式服务，需要清除缓存
								dg.Close(); //考虑分布式服务，需要清除缓存
								dgTag.Close(); //考虑分布式服务，需要清除缓存
								ArrayList<Double> dValues = new ArrayList<Double>();
								int cols = dg.GetWidth();
								int rows = dg.GetHeight();
								Scanline sl = new Scanline(dg.GetValueType(), cols);
								Scanline slTag = new Scanline(dgTag.GetValueType(), cols);
								for(int i = rows - 1; i >= 0; i--)
								{	
									dg.GetScanline(0, i, sl);
									dgTag.GetScanline(0, i, slTag);
									for(int j = 0; j<cols; j++)
									{
										double val = sl.GetValue(j);
										double tag = slTag.GetValue(j);
										dValues.add(val);
										dValues.add(tag);	
									}
								}							
								sl.Destroy();
								slTag.Destroy();
								dg.Close(); //避免内存溢出，需要清除缓存
								dgTag.Close(); //避免内存溢出，需要清除缓存
								grid.setLeft(dg.GetBounds().getX());
								grid.setBottom(dg.GetBounds().getY());
								grid.setRight(dg.GetBounds().getX() + dg.GetBounds().getWidth());
								grid.setTop(dg.GetBounds().getY() + dg.GetBounds().getHeight());
								grid.setRows(dg.GetHeight());
								grid.setCols(dg.GetWidth());
								grid.setDValues(dValues);
								grid.setNoDataValue(dg.GetNoDataValue());
							}
							else
							{ //无Tag属性								
								DatasetRaster dg  = (DatasetRaster)dt;
								dg.Open();   //考虑分布式服务，需要清除缓存
								dg.Close();  //考虑分布式服务，需要清除缓存
								dg.CalcExtreme();
								grid = Toolkit.convertDatasetRasterToGridData(dg);
								dg.Close();  //避免内存溢出，需要清除缓存
							}							
						}	
					}					
				}
				catch(Exception ex){
					log.error("时效："+ hourSpan +"小时，获取格点数据失败，详情【" + ex.getMessage() + "】");
				}
				grids.add(grid);
				nindex++;
			}
			long endtime = System.currentTimeMillis();
			log.info("批量获取"+element+"数据耗时：" + String.valueOf(endtime - begintime));
		} catch (Exception e) {
			log.error("批量获取格点数据失败，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}				
		System.gc();
		return grids;
	}
	
	/**
	 * 获取格点产品信息
	 * @return
	 */
	@POST
	@Path("getGridInfo")
	@Produces("application/json")
	public Object getGridInfo(@FormParam("para") String para) {
		ArrayList<GridInfo> gis = new ArrayList<GridInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String maketime = CommonTool.getJSONStr(jsonObject, "maketime");
			String version = CommonTool.getJSONStr(jsonObject, "version");
			String forecastTime = CommonTool.getJSONStr(jsonObject, "datetime");
			gis = this.queryGridInfo(departCode, type, element, maketime, version, forecastTime);
		} catch (Exception e) {
			log.error("获取格点产品信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return gis;
	}
	
	/**
	 * 获取格点产品信息
	 * @return
	 */
	@POST
	@Path("getCalamityGridInfos")
	@Produces("application/json")
	public Object getCalamityGridInfos(@FormParam("para") String para) {
		ArrayList<GridInfo> gis = new ArrayList<GridInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String maketimeStart = CommonTool.getJSONStr(jsonObject, "maketimeStart");
			String maketimeEnd = CommonTool.getJSONStr(jsonObject, "maketimeEnd");
			gis = this.queryCalamityGridInfo(element, maketimeStart, maketimeEnd);
		} catch (Exception e) {
			log.error("获取灾害落区格点产品信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return gis;
	}
	
	/**
	 * 获取新格点产品信息
	 * @return
	 */
	@POST
	@Path("getNewCalamityGridInfos")
	@Produces("application/json")
	public Object getNewCalamityGridInfos(@FormParam("para") String para) {
		ArrayList<GridInfo> gis = new ArrayList<GridInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String[] elementList = element.split(",");
			for(int i=0;i<elementList.length;i++){
				if(i==0){
					element = "'"+elementList[i]+"'";	
				}
				else {
					element += ",'"+elementList[i]+"'";
				}
			}
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			String maketimeStart = CommonTool.getJSONStr(jsonObject, "maketimeStart");
			String maketimeEnd = CommonTool.getJSONStr(jsonObject, "maketimeEnd");
			gis = this.queryNewCalamityGridInfo(element, departCode, maketimeStart, maketimeEnd);
		} catch (Exception e) {
			log.error("获取灾害落区格点产品信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return gis;
	}
	
	/**
	 * 获取格点产品发送信息
	 * @return
	 */
	@POST
	@Path("getProductSendInfo")
	@Produces("application/json")
	public Object getProductSendInfo(@FormParam("para") String para) {
		ArrayList<SendInfo> infos = new ArrayList<SendInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			int productId = CommonTool.getJSONInt(jsonObject, "productId");
			infos = this.queryProductSendInfo(productId);
		} catch (Exception e) {
			log.error("获取灾害落区格点产品信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return infos;
	}
	
	/**
	 * 保存格点产品发送信息
	 * @return
	 */
	@POST
	@Path("saveProductSendInfo")
	@Produces("application/json")
	public Object saveProductSendInfo(@FormParam("para") String para) {
		Boolean result = false;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			int productId = CommonTool.getJSONInt(jsonObject, "productId");
			String sendFrom = CommonTool.getJSONStr(jsonObject, "sendFrom");
			String receiveDepartCode = CommonTool.getJSONStr(jsonObject, "receiveDepartCode");
			String receiveDepartName = CommonTool.getJSONStr(jsonObject, "receiveDepartName");
			String receiveTime = CommonTool.getJSONStr(jsonObject, "receiveTime");
			int status = CommonTool.getJSONInt(jsonObject, "status");
			String remark = CommonTool.getJSONStr(jsonObject, "remark");
			addProductSendInfo(productId,sendFrom,receiveDepartCode,receiveDepartName,receiveTime,status,remark);
			result = true;
		} catch (Exception e) {
			log.error("保存格点产品发送信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	/*
	 * 添加格点产品信息
	 * */
	private Integer addProductSendInfo(int productId,String sendFrom,String receiveDepartCode,String receiveDepartName,String receiveTime,int status,String remark){
		Integer key = -1;
		 try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("INSERT INTO `t_gridproductsendinfo` (`productId`, `sendFrom`, `receiveDepartCode`, `receiveDepartName`, `receiveTime`, `status`, `remark`) VALUES (%d, '%s', '%s', '%s', '%s', %d, '%s');",
					productId,sendFrom,receiveDepartCode,receiveDepartName,receiveTime,status,remark);
			Integer row = stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
			ResultSet rs = stmt.getGeneratedKeys ();
			if (rs.next()) {
				key = rs.getInt(row);
				}
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return key;
	}
	
	/**
	 * 获取（全部要素）格点产品信息
	 * @return
	 */
	@POST
	@Path("getGridInfos")
	@Produces("application/json")
	public Object getGridInfos(@FormParam("para") String para) {
		ArrayList<GridInfo> gis = new ArrayList<GridInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String maketime = CommonTool.getJSONStr(jsonObject, "maketime");
			String version = CommonTool.getJSONStr(jsonObject, "version");
			String forecastTime = CommonTool.getJSONStr(jsonObject, "datetime");
			gis = this.queryGridInfo(departCode, type, maketime, version, forecastTime);
		} catch (Exception e) {
			log.error("获取格点产品信息，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return gis;
	}
	
	/**
	 * 调用（时效对应的）数值模式
	 * @return
	 */
	@POST
	@Path("callModel")
	@Produces("application/json")
	public Object callModel(@FormParam("para") String para) {
		GridData plot = new GridData();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String model = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String strMakeTime = CommonTool.getJSONStr(jsonObject, "maketime");
			Date dateModelMake = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime); //（原始参考场）制作时次
			String strDateTime = CommonTool.getJSONStr(jsonObject, "datetime");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strDateTime); //（目标场）预报时次
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");
			
			Date dateModel = null;
			if(model.equals("prvn") || model.equals("cty")|| model.equals("cnty")) //省市县：根据制作时间获取预报时间
			{
//				List<Date> dts = this.getGridProductLastDateTime(model, element, strDateTime);
//				if(dts.size() == 2){
//					dateModel = dts.get(0);
//					dateModelMake = dts.get(1);
//				}

				String strMakeTimeHHmm = new SimpleDateFormat("HH:mm").format(dateModelMake);
				Class.forName("com.mysql.jdbc.Driver");
				Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
						dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
				Statement  stmt = conn.createStatement();
				String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", model, strMakeTimeHHmm);
				ResultSet resultSet = stmt.executeQuery(sql);
				int forecastHour = -1;
				while(resultSet.next()) {
					forecastHour = resultSet.getInt("forecastHour");
					break;
				}
				stmt.close();
				conn.close();
				dateModel = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime);
				dateModel.setHours(forecastHour);
			}
			else //模式：预报时间等于制作时间
			{
//				dateModel = this.getLastDateTime(model, element);
//				dateModelMake = dateModel;
				dateModel = dateModelMake;
			}
			
			if(dateModel != null)
			{
				long diff = date.getTime() - dateModel.getTime();
				int offsetHours = (int)(diff / (1000 * 60 * 60));
				
				int nHourSpan = hour;
				int nHourSpanModel = nHourSpan + offsetHours;
				String strDateModelMake = new SimpleDateFormat("yyMMddHHmm").format(dateModelMake);
				String strDateModel = new SimpleDateFormat("yyMMddHH").format(dateModel);
				String strDatasetName = String.format("t_%s_%s_%s_%s_%s_%s_%s", model, element, strDateModelMake, "p", strDateModel, new DecimalFormat("000").format(nHourSpanModel), level);				
				if(element.toLowerCase().equals("10uv") || element.toLowerCase().equals("wmax"))
				{
					String strDatasetNameU = strDatasetName+"_u";
					String strDatasetNameV = strDatasetName+"_v";
					Dataset dtU = this.getDataset(strDatasetNameU, true);
					Dataset dtV = this.getDataset(strDatasetNameV, true);
					if(dtU == null || dtV == null)
					{
						log.error("调用模式预报：未找到" + strDatasetName);
					}	
					else
					{
						DatasetRaster dgU  = (DatasetRaster)dtU;
						dgU.CalcExtreme();
						DatasetRaster dgV  = (DatasetRaster)dtV;
						dgV.CalcExtreme();
						ArrayList<Double> dValues = new ArrayList<Double>();
						int cols = dgU.GetWidth();
						int rows = dgU.GetHeight();
						double noDataValue = dgU.GetNoDataValue();
						for(int i = rows - 1; i >= 0; i--)
						{	
							for(int j = 0; j<cols; j++)
							{							
								double u = dgU.GetValue(j, i);
								double v = dgV.GetValue(j, i);
								if(u == noDataValue || v == noDataValue)
								{
									dValues.add(noDataValue);
									dValues.add(noDataValue);	
								}
								else
								{
									if(u == 0.0 && v == 0.0){
										dValues.add(0.0);
										dValues.add(0.0);
									}
									else{
										Double dSpeed = Math.sqrt(u*u + v*v);
										Double dDirection = 270.0-Math.atan2(v, u)*180.0/Math.PI;
										dValues.add(dDirection);
										dValues.add(dSpeed);	
									}														
								}
							}
						}
						plot.setLeft(dgU.GetBounds().getX());
						plot.setBottom(dgU.GetBounds().getY());
						plot.setRight(dgU.GetBounds().getX() + dgU.GetBounds().getWidth());
						plot.setTop(dgU.GetBounds().getY() + dgU.GetBounds().getHeight());
						plot.setRows(dgU.GetHeight());
						plot.setCols(dgU.GetWidth());
						plot.setDValues(dValues);
						plot.setNoDataValue(dgU.GetNoDataValue());						
					}	
				}
				else
				{
					Dataset dt = this.getDataset(strDatasetName, true);
					if(dt == null)
					{
						log.error("调用模式预报：未找到" + strDatasetName);
					}	
					else
					{
						DatasetRaster dg  = (DatasetRaster)dt;
						plot = Toolkit.convertDatasetRasterToGridData(dg);
					}	
				}
				plot.setNWPModelTime(new SimpleDateFormat("yyMMddHH").format(dateModel));
			}
		} catch (Exception e) {
			log.error("调用模式预报，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return  plot;
	}
	
	/**
	 * 调用（时效对应的）数值模式集合，要素所有时效
	 * @return
	 */
	@POST
	@Path("callModels")
	@Produces("application/json")
	public Object callModels(@FormParam("para") String para) {
		ArrayList<GridData> grids = new ArrayList<GridData>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String model = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String strMakeTime = CommonTool.getJSONStr(jsonObject, "maketime");
			Date dateModelMake = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime); //（原始参考场）制作时次
			String strDateTime = CommonTool.getJSONStr(jsonObject, "datetime");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strDateTime); //（目标场）预报时次
			String strHourSpans = CommonTool.getJSONStr(jsonObject, "hourspans");
			String[] hourSpans = strHourSpans.split(",");
			
			//Date dateModel = this.getLastDateTime(model, element);
			Date dateModel = null;
			if(model.equals("prvn") || model.equals("cty")|| model.equals("cnty")) //省市县：根据制作时间获取预报时间
			{
//				List<Date> dts = this.getGridProductLastDateTime(model, element, strDateTime);
//				if(dts.size() == 2){
//					dateModel = dts.get(0);
//					dateModelMake = dts.get(1);
//				}

				String strMakeTimeHHmm = new SimpleDateFormat("HH:mm").format(dateModelMake);
				Class.forName("com.mysql.jdbc.Driver");
				Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
						dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
				Statement  stmt = conn.createStatement();
				String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", model, strMakeTimeHHmm);
				ResultSet resultSet = stmt.executeQuery(sql);
				int forecastHour = -1;
				while(resultSet.next()) {
					forecastHour = resultSet.getInt("forecastHour");
					break;
				}
				stmt.close();
				conn.close();
				dateModel = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime);
				dateModel.setHours(forecastHour);
			}
			else //模式：预报时间等于制作时间
			{
//				dateModel = this.getLastDateTime(model, element);
//				dateModelMake = dateModel;
				dateModel = dateModelMake;
			}
			
			if(dateModel != null)
			{				
				int nindex = 0;
				long diff = date.getTime() - dateModel.getTime();
				int offsetHours = (int)(diff / (1000 * 60 * 60));
				Boolean hasRefresh=false;
				for(String hourSpan : hourSpans){
					Integer hour = Integer.valueOf(hourSpan);
					GridData grid = new GridData();
					try
					{
						int nHourSpan = hour;
						int nHourSpanModel = nHourSpan + offsetHours;
						
						//String strDatasetName = String.format("t_%s_%s_%s_%s_%s", model, element, new SimpleDateFormat("yyMMddHH").format(dateModel), new DecimalFormat("000").format(nHourSpanModel), level);
						String strDateModelMake = new SimpleDateFormat("yyMMddHHmm").format(dateModelMake);
						String strDateModel = new SimpleDateFormat("yyMMddHH").format(dateModel);
						String strDatasetName = String.format("t_%s_%s_%s_%s_%s_%s_%s", model, element, strDateModelMake, "p", strDateModel, new DecimalFormat("000").format(nHourSpanModel), level);
						if(element.toLowerCase().equals("10uv") || element.toLowerCase().equals("wmax"))
						{
							String strDatasetNameU = strDatasetName+"_u";
							String strDatasetNameV = strDatasetName+"_v";
							Dataset dtU = this.getDataset(strDatasetNameU, false);
							Dataset dtV = this.getDataset(strDatasetNameV, false);
							//保证只刷新一次
							if(dtU == null && !hasRefresh){
								dtU = this.getDataset(strDatasetNameU, true);
								dtV = this.getDataset(strDatasetNameV, false);
								hasRefresh = true;
							}
							
							if(dtU == null || dtV == null)
							{
								log.error("调用模式预报：未找到" + strDatasetName);
							}	
							else
							{
								DatasetRaster dgU  = (DatasetRaster)dtU;
								dgU.CalcExtreme();
								DatasetRaster dgV  = (DatasetRaster)dtV;
								dgV.CalcExtreme();
								ArrayList<Double> dValues = new ArrayList<Double>();
								int cols = dgU.GetWidth();
								int rows = dgU.GetHeight();
								double noDataValue = dgU.GetNoDataValue();
								for(int i = rows - 1; i >= 0; i--)
								{	
									for(int j = 0; j<cols; j++)
									{							
										double u = dgU.GetValue(j, i);
										double v = dgV.GetValue(j, i);
										if(u == noDataValue || v == noDataValue)
										{
											dValues.add(noDataValue);
											dValues.add(noDataValue);	
										}
										else
										{
											if(u == 0.0 && v == 0.0){
												dValues.add(0.0);
												dValues.add(0.0);
											}
											else{
												Double dSpeed = Math.sqrt(u*u + v*v);
												Double dDirection = 270.0-Math.atan2(v, u)*180.0/Math.PI;
												dValues.add(dDirection);
												dValues.add(dSpeed);	
											}																
										}
									}
								}
								grid.setLeft(dgU.GetBounds().getX());
								grid.setBottom(dgU.GetBounds().getY());
								grid.setRight(dgU.GetBounds().getX() + dgU.GetBounds().getWidth());
								grid.setTop(dgU.GetBounds().getY() + dgU.GetBounds().getHeight());
								grid.setRows(dgU.GetHeight());
								grid.setCols(dgU.GetWidth());
								grid.setDValues(dValues);
								grid.setNoDataValue(dgU.GetNoDataValue());						
							}	
						}
						else
						{
							Dataset dt = this.getDataset(strDatasetName, false);
							//保证只刷新一次
							if(dt == null && !hasRefresh){
								dt = this.getDataset(strDatasetName, true);
								hasRefresh = true;
							}
							
							if(dt == null)
							{
								if((element.equals("tmax") || element.equals("tmin")) && offsetHours%24==12){
									Integer offsetHoursTemp = 0;
									Integer nHourForecast = date.getHours();
									Integer nHourModel = dateModel.getHours();
									if(element.equals("tmax")){
										offsetHoursTemp = offsetHours/24*24 + nHourForecast==20&&nHourModel==8?24:0;
									}
									else if(element.equals("tmin")){
										offsetHoursTemp = offsetHours/24*24 + nHourForecast==20&&nHourModel==8?0:24;
									}
									nHourSpanModel = nHourSpan + offsetHoursTemp;
									strDatasetName = String.format("t_%s_%s_%s_%s_%s_%s_%s", model, element, strDateModelMake, "p", strDateModel, new DecimalFormat("000").format(nHourSpanModel), level);
									dt = this.getDataset(strDatasetName, nindex==0);
								}
								
								log.error("调用模式预报：未找到" + strDatasetName);
							}	
							
							if(dt != null)
							{
								DatasetRaster dg  = (DatasetRaster)dt;
								grid = Toolkit.convertDatasetRasterToGridData(dg);
							}	
						}
						grid.setNWPModelTime(new SimpleDateFormat("yyMMddHH").format(dateModel));
					}
					catch(Exception ex){
						log.error("时效："+ hourSpan +"小时，获取格点数据失败，详情【" + ex.getMessage() + "】");
					}
					grids.add(grid);
					nindex++;
				}	
			}
		} catch (Exception e) {
			log.error("调用数值模式集合，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return  grids;
	}
	
	/**
	 * 获取数值模式预报最新时次
	 * @return
	 */
	@POST
	@Path("getNWPModelLastDate")
	@Produces("application/json")
	public Object getNWPModelLastDate(@FormParam("para") String para) {
		String result = "";
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String model = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			
			Date dateModel = this.getLastDateTime(model, element);
			if(dateModel != null)
				result = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dateModel);
		} catch (Exception e) {
			log.error("获取数值模式预报最新时次，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}

	/*
	 * 获取指定模式最新预报时间 
	 * 
	 * */
	private Date getLastDateTime(String type, String element)
	{
		String strStartWith = String.format("t_%s_%s", type, element);
		ArrayList<String> datasetNames = getDatasetNames(strStartWith);
		
		String strLastDateTime = null;
		int nIndexDateTime = 5; //时次索引
		for(Integer i=0; i<datasetNames.size(); i++)
		{
			String strDatasetName = datasetNames.get(i).toLowerCase();
			String[] strs = strDatasetName.split("_");
			if(strs != null && strs.length >= 8)
			{			
				String strDateTime = strs[nIndexDateTime];
				if(strLastDateTime == null || strLastDateTime.compareTo(strDateTime) < 0)
					strLastDateTime = strDateTime;
			}
		}
		
		Date date = null;
		SimpleDateFormat sdf =  new SimpleDateFormat("yyyyMMddHH:mm:ss");
		if(strLastDateTime != null){
			try {
				strLastDateTime = "20"+strLastDateTime+":00:00";
				date = sdf.parse(strLastDateTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}	
		}		
		return date;
	}
	
	/**
	 * 获取（格点预报产品）上一期时间
	 * @return
	 */
	@POST
	@Path("getGridProductLastDate")
	@Produces("application/json")
	public Object getGridProductLastDate(@FormParam("para") String para) {
		//ArrayList<String> result = new ArrayList<String>();
		String result = "";
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String forecastTime = CommonTool.getJSONStr(jsonObject, "forecastTime");
			List<Date> dts = this.getGridProductLastDateTime(type, element, forecastTime);
			if(dts.size() == 2){
				Date dtForecastTime = dts.get(0);
				Date dtMakeTime = dts.get(1);
				if(dtForecastTime != null && dtMakeTime != null){
//					result.add(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dtMakeTime));
//					result.add(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dtForecastTime));	
					result = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dtMakeTime);
				}	
			}
		} catch (Exception e) {
			log.error("获取上一期预报时间，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	private List<Date> getGridProductLastDateTime(String type, String element, String forecastTime)
	{
		List<Date> result = new ArrayList<Date>();
		try {
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement(); 
			String sql = String.format("select max(forecastTime) as forecastTime from t_gridproduct where type='%s' and element='%s' and forecastTime<='%s' and version='p' ", type, element, forecastTime);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				String strForecastTime = resultSet.getString("forecastTime");
				SimpleDateFormat sdf =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				if(strForecastTime != null){
					try {
						result.add(sdf.parse(strForecastTime));
						
						sql = String.format("select max(makeTime) as makeTime from t_gridproduct where type='%s' and element='%s' and forecastTime='%s' and version='p' ", type, element, strForecastTime);
						ResultSet resultSet1 = stmt.executeQuery(sql);
						while(resultSet1.next()) {
							String strMakeTime = resultSet1.getString("makeTime");
							if(strMakeTime != null){
								try {
									result.add(sdf.parse(strMakeTime));
								} catch (ParseException e) {
									e.printStackTrace();
								}	
							}
						}						
						resultSet1.close();
					} catch (ParseException e) {
						e.printStackTrace();
					}	
				}
				break;
			}
			resultSet.close();
			conn.close();
		} catch (Exception e) {
			log.error("获取上一期预报时间，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 获取等值线，已弃用，在客户端已实现
	 * @return
	 */	
	@POST
	@Path("getContour")
	@Produces("application/json")
	public Object getContour(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		String result =  new String();
		try
		{
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");	
			
			String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
			Dataset dt  = this.getDataset(strDatasetName, true);
			if(dt != null)
			{
				DatasetRaster dr = (DatasetRaster)dt;
				dr.SetNoDataValue(9999.0);
				dr.CalcExtreme(); //计算极值，底层没有自动计算
				Analyst pAnalyst = Analyst.CreateInstance("Contour", Application.m_workspace);
				String str = "{\"Datasource\":\"" + m_datasource.GetAlias() + "\",\"Dataset\":\"" + dr.GetName() + "\"}";
				pAnalyst.SetPropertyValue("Raster", str);
				
				String strValues = "";
				Double dStep = 2.0;					
				if(element.equals("2t"))
					dStep = (type.equals("EC") || type.equals("t639") || type.equals("JAPAN")) ? 2.0 : 1.0;
				if(element.equals("rh"))
					dStep = 5.0;					
				if(element.equals("div"))
					dStep = 10.0;
				if(element.equals("r1") || element.equals("r3") || element.equals("r6") || element.equals("r12") || element.equals("r24"))
					strValues = "0.1, 10.0, 25.0, 50.0, 100.0, 250.0";
					//strValues = "0.09, 9.9, 24.9, 49.9, 99.9, 249.9";
				
				if(strValues.length() == 0)
				{
					dr.SetNoDataValue(9999.0);
					dr.CalcExtreme();		
					double d = (int)dr.GetMinValue();
					double dMax = dr.GetMaxValue();					
					while (d <= dMax)
					{
						strValues += String.format("%f", d);
						strValues += " ";
						d += dStep;
					}	
				}
				
				pAnalyst.SetPropertyValue("Values", strValues);				
				pAnalyst.SetPropertyValue("Smoothness", "3");
				
				String strAlias = getValidDatasourceAlias("dsGridContour");				
				str = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"\"}", "Memory",strAlias);
				Datasource dsOutput = Application.m_workspace.CreateDatasource(str);
				str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"dtContour\"}", dsOutput.GetAlias());
				pAnalyst.SetPropertyValue("Contour", str);
				
				pAnalyst.Execute();
				pAnalyst.Destroy();
				
				DatasetVector dtv = (DatasetVector)dsOutput.GetDataset("dtContour");
				log.info("提取等值线耗时：" + String.valueOf(System.currentTimeMillis() - begintime));
				result = Toolkit.convertDatasetVectorToJson(dtv, "LINE");
				Application.m_workspace.CloseDatasource(dsOutput.GetAlias());
			}
		} catch (Exception e) {
			log.error("获取等值线，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("获取等值线耗时：" + String.valueOf(endtime - begintime));
		return result;
	}	
	
	/**
	 * 获取等值面
	 * @return
	 */	
	@POST
	@Path("getIsoRegion")
	@Produces("application/json")
	public Object getIsoRegion(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		String result =  new String();
		try
		{
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");	
			
			String strDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
			Dataset dt  = this.getDataset(strDatasetName, true);
			if(dt != null)
			{
				DatasetRaster dr = (DatasetRaster)dt;
				dr.SetNoDataValue(9999.0);
				dr.CalcExtreme(); //计算极值，底层没有自动计算
				Analyst pAnalyst = Analyst.CreateInstance("Contour", Application.m_workspace);
				String str = "{\"Datasource\":\"" + m_datasource.GetAlias() + "\",\"Dataset\":\"" + dr.GetName() + "\"}";
				pAnalyst.SetPropertyValue("Raster", str);
				
				String strValues = "";
				Double dStep = 2.0;					
				if(element.equals("2t"))
					dStep = (type.equals("EC") || type.equals("t639") || type.equals("JAPAN")) ? 2.0 : 1.0;
				if(element.equals("rh"))
					dStep = 5.0;					
				if(element.equals("r1") || element.equals("r3") || element.equals("r6") || element.equals("r12") || element.equals("r24"))
					strValues = "0.1, 10.0, 25.0, 50.0, 100.0, 250.0";
					//strValues = "0.09, 9.9, 24.9, 49.9, 99.9, 249.9";
				
				if(strValues.length() == 0)
				{
					dr.SetNoDataValue(9999.0);
					dr.CalcExtreme();		
					double d = (int)dr.GetMinValue();
					double dMax = dr.GetMaxValue();					
					while (d <= dMax)
					{
						strValues += String.format("%f", d);
						strValues += " ";
						d += dStep;
					}	
				}
				
				pAnalyst.SetPropertyValue("Values", strValues);				
				pAnalyst.SetPropertyValue("Smoothness", "3");
				
				String strAlias = getValidDatasourceAlias("dsGridContour");
				str = String.format("{\"Type\":\"%s\",\"Alias\":\"%s\",\"Server\":\"\"}", "Memory",strAlias);
				Datasource dsOutput = Application.m_workspace.CreateDatasource(str);
				str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"dtContour\"}", dsOutput.GetAlias());
				pAnalyst.SetPropertyValue("Contour", str);
				
				pAnalyst.Execute();
				pAnalyst.Destroy();
				
				//填色
				pAnalyst = Analyst.CreateInstance("FilledContour", Application.m_workspace);
				str =String.format( "{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsOutput.GetAlias(), "dtContour");
				pAnalyst.SetPropertyValue("Contour", str);
				str = "{\"Datasource\":\"" + m_datasource.GetAlias() + "\",\"Dataset\":\"" + dr.GetName() + "\"}";
                pAnalyst.SetPropertyValue("Ref", str);
                str = String.format("{\"Name\":\"ZValue\",\"MinValue\":%f,\"MaxValue\":%f}", dr.GetMinValue() - 1.0, dr.GetMaxValue() + 1.0);
                pAnalyst.SetPropertyValue("Field", str);
				str = String.format("{\"Datasource\":\"%s\",\"Dataset\":\"%s\"}", dsOutput.GetAlias(), "dtIsoSurface");
				pAnalyst.SetPropertyValue("FilledContour", str);				
				pAnalyst.Execute();
				pAnalyst.Destroy();  
				
				DatasetVector dtv = (DatasetVector)dsOutput.GetDataset("dtIsoSurface");
				result = Toolkit.convertDatasetVectorToJson(dtv, "REGION");
				Application.m_workspace.CloseDatasource(dsOutput.GetAlias());
			}
		} catch (Exception e) {
			log.error("获取等值面，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("获取等值面耗时：" + String.valueOf(endtime - begintime));
		return result.toString();
	}	
	
	/**
	 * 根据区域范围（落区）更新格点，已废弃
	 * @return
	 */
	@POST
	@Path("updateGridByRegion")
	@Produces("application/json")
	public Object updateGridByRegion(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		Boolean result = false;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");	
			
			String strGridDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
			DatasetRaster dg  = (DatasetRaster)this.getDataset(strGridDatasetName, true);
			if(dg == null)
				return result;
			
			//多边形（落区）边界点
			String coordinates = CommonTool.getJSONStr(jsonObject, "coordinates");
			//目标值
			double dvalue = CommonTool.getJSONDouble(jsonObject, "value");
			//构造多边形（落区）
			ArrayList<Point2D> points = new ArrayList<Point2D>();
			String[] xys = coordinates.split(" ");
			for(int i=0; i<xys.length; i++)
			{
				String[] xy = xys[i].split(",");				
				points.add(new Point2D.Double(java.lang.Double.valueOf(xy[0]), java.lang.Double.valueOf(xy[1])));
			}			
			GeoRegion geoRegion = new GeoRegion((Point2D[]) points.toArray());
			//更新格点值
			result = FillRegion(dg, geoRegion, dvalue, 0, element); //0：统一赋值
			if(result)
			{
				m_datasetRefreshList.add(dg.GetName());
				
				SimpleDateFormat df = new SimpleDateFormat("MMddHHmmss");
				String strTime = df.format(new Date());
				Integer nTime = Integer.parseInt(strTime);
				m_datasetUpdateTime.put(dg.GetName(),nTime);
			}
		} catch (Exception e) {
			log.error("根据区域范围（落区）更新格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("更新格点耗时：" + String.valueOf(endtime - begintime));
		return result;
	}
	
	/*
	 * 
	 * 通过多边形订正格点
	 * method：0：统一赋值，value=x；1：统一加减值，value+=x；2：统一增量（百分比），value*=(1+x))
	 * element：要素名称，主要是解决降水量不能为负
	 * *
	 */
	private Boolean FillRegion(DatasetRaster dg, GeoRegion gr, double dvalue, Integer method, String element)
	{
		if(method == 0 && dvalue<0 && (element.equals("R1") || element.equals("R3") || element.equals("R6") || element.equals("R12") || element.equals("R24"))) //降水不能为负
    		return false;
		
		Boolean result = false;
		try {
			if (dg == null || gr == null)
                return result;
			Point2D ptMin = dg.PointToCell(new Point2D.Double(gr.GetBounds().getX(), gr.GetBounds().getY()));
            Point2D ptMax = dg.PointToCell(new Point2D.Double(gr.GetBounds().getX() + gr.GetBounds().getWidth(), gr.GetBounds().getY() + gr.GetBounds().getHeight()));
            if (ptMin.getX() > ptMax.getX())
            {
                int nSwap = (int) ptMin.getX();
                ptMin = new Point2D.Double(ptMax.getX(), ptMin.getY());
                ptMax = new Point2D.Double(nSwap, ptMax.getY());
            }
            if (ptMin.getY() > ptMax.getY())
            {
                int nSwap = (int) ptMin.getY();
                ptMin = new Point2D.Double(ptMin.getX(), ptMax.getY());
                ptMax = new Point2D.Double(ptMax.getX(), nSwap);
            }
            ptMin = new Point2D.Double(Math.max(ptMin.getX(), 0), Math.max(ptMin.getY(), 0));
            ptMax = new Point2D.Double(Math.min(ptMax.getX(), dg.GetWidth() - 1), Math.min(ptMax.getY(), dg.GetHeight() - 1));
            Analyst pAnalyst = Analyst.CreateInstance("SpatialRel", Application.m_workspace);
            String str = String.format("\"Geometry\":\"%d\"", gr.GetHandle());
            pAnalyst.SetPropertyValue("A", "{" + str + "}");
            pAnalyst.SetPropertyValue("SpatialRel", "Contain");
            for (int i = (int) ptMin.getY(); i <= ptMax.getY(); i++)
            {
                for (int j = (int) ptMin.getX(); j <= ptMax.getX(); j++)
                {
                    //Point2D pt2d = dg.CellToPoint(new Point(j, i));
                	Point2D pt2d = dg.CellToPoint(new Point2D.Double(j, i));
                    GeoPoint geoPoint = new GeoPoint(pt2d.getX(), pt2d.getY());
                    str = String.format("\"Geometry\":\"%d\"", geoPoint.GetHandle());
                    pAnalyst.SetPropertyValue("B", "{" + str + "}");
                    pAnalyst.Execute();
                    String strOutput = pAnalyst.GetPropertyValue("Output");
                    if(strOutput.equals("FALSE"))
                    	continue;
                    
                    if(method == 0) //统一赋值，value=x
                    {                    	
                    	dg.SetValue(j, i, dvalue);
                    }
                    else if(method == 1) //统一加减值，value+=x
                    {
                    	double valueTemp = dg.GetValue(j, i);
                    	valueTemp+=dvalue;
                    	
                    	if(valueTemp<0 && (element.equals("R1") || element.equals("R3") || element.equals("R6") || element.equals("R12") || element.equals("R24"))) //降水不能为负， 就置为0吧
                    		valueTemp = 0;
                    	
                    	dg.SetValue(j, i, valueTemp);
                    }
                    else if(method == 2) //统一增量（百分比），value*=(1+x)
                    {
                    	double valueTemp = dg.GetValue(j, i);
                    	valueTemp*=(1+dvalue);
                    	
                    	if(valueTemp<0 && (element.equals("R1") || element.equals("R3") || element.equals("R6") || element.equals("R12") || element.equals("R24"))) //降水不能为负， 就置为0吧，这里原则上不会为负，保险起见，还是判断下
                    		valueTemp = 0;
                    	
                    	dg.SetValue(j, i, valueTemp);
                    }
                }
            }
            pAnalyst.Destroy();
            dg.FlushCache();
			result = true;
		}
		catch(Exception e)
		{
			log.error("更新格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 判断数据是否脏了
	 * @return
	 */
	@POST
	@Path("getIsDirty")
	@Produces("application/json")
	public Object getIsDirty(@FormParam("para") String para) {
		StringBuffer result =  new StringBuffer();
		try {
			JSONObject jsonObject = new JSONObject(para);
			Integer nTime = CommonTool.getJSONInt(jsonObject, "time");
			String m_strDatasetName = "test";	//服务端重构了，这个全局变量删掉了，该功能以后再说，可能用不上
			if(m_datasetUpdateTime.containsKey(m_strDatasetName)) //这个应该是作为参数传过来的
			{
				if(nTime < m_datasetUpdateTime.get(m_strDatasetName))
				{
					result.append(String.format("{\"time\":%d}", m_datasetUpdateTime.get(m_strDatasetName)));
				}
			}
		} catch (Exception e) {
			log.error("判断数据是否脏了，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result.toString();
	}
	
	/**
	 * 根据气候区划订正格点。已弃用，在客户端已实现
	 * 参数：数据集名、区划子项名称、订正方法（0：统一赋值，value=x；1：统一加减值，value+=x；2：统一增量（百分比），value*=(1+x))）等
	 * 返回：是否成功
	 * @return
	 */
	@POST
	@Path("updateGridByClimaticRegion")
	@Produces("application/json")
	public Object updateGridByClimaticRegion(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		Boolean result = false;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");	
			double dValue= CommonTool.getJSONDouble(jsonObject, "value");
			Integer method= CommonTool.getJSONInt(jsonObject, "method");
			String datasetName = CommonTool.getJSONStr(jsonObject, "datasetName");
			Integer regionId = CommonTool.getJSONInt(jsonObject, "regionId");
			
			String strGridDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
			Dataset dt  = this.getDataset(strGridDatasetName, true);
			if(dt == null)
				return result;
			
			DatasetRaster dg  = (DatasetRaster)dt;
			GeoRegion geo = null;
			DatasetVector dtv = (DatasetVector)this.getDataset(datasetName, true);
			if(dtv != null)
			{
				Recordset rs = dtv.Query("", null);
				if(rs.Seek(regionId))
					geo = (GeoRegion)rs.GetGeometry();
				rs.Destroy();
				
				if(geo != null)
				{
					result = FillRegion(dg, geo, dValue, method, element);
					if(result)
					{
						m_datasetRefreshList.add(dg.GetName());
						
						SimpleDateFormat df = new SimpleDateFormat("MMddHHmmss");
						String strTime = df.format(new Date());
						Integer nTime = Integer.parseInt(strTime);
						m_datasetUpdateTime.put(dg.GetName(),nTime);
					}
				}
			}
		} catch (Exception e) {
			log.error("根据气候区划订正格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("根据气候区划订正格点：" + String.valueOf(endtime - begintime));
		return result;
	}
	
	/*
	 * 
	 * 获取格点值序列，已废弃？
	 * */
	@POST
	@Path("getGridValueSerial")
	@Produces("application/json")
	public Object getGridValueSerial(@FormParam("para") String para){
		ArrayList<GridValueInfo> result = null;
		try
		{
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			Double x = CommonTool.getJSONDouble(jsonObject, "x");
			Double y = CommonTool.getJSONDouble(jsonObject, "y");
			Point2D pt2d = new Point2D.Double(x, y);
			String prefix = String.format("t_%s_%s_%s", type, element, new SimpleDateFormat("yyMMddHH").format(date));
			Datasource ds = (level==null) ? m_datasource : m_datasourceNWP;
			Map<Integer,Double> valMap = new TreeMap<Integer,Double>(); //TreeMap能自动排列
			for(int i=0; i<ds.GetDatasetCount(); i++)
			{
				String dtname = ds.GetDataset(i).GetName().toLowerCase();
				if(dtname.startsWith(prefix) && ds.GetDataset(i).GetType().equals("Raster"))
				{
					DatasetRaster dg = (DatasetRaster)ds.GetDataset(i);
					Point2D pt = dg.PointToCell(pt2d);
					if(pt.getX() > 0 && pt.getX()<dg.GetWidth() && pt.getY()>0 && pt.getY()<dg.GetHeight())
					{
						Double v = Double.valueOf((float)Math.round(dg.GetValue((int)pt.getX(), (int)pt.getY())*100)/100.0); //保留两位小数
						String[] strs = dtname.split("_");
						Integer hourspan = Integer.valueOf(strs[6]); //时效，最好不要用常量
						valMap.put(hourspan, v);	
					}			
				}
			}
			
			if(valMap.size() > 0)
			{
				result = new ArrayList<GridValueInfo>(); 
				for(Map.Entry<Integer, Double> entry:valMap.entrySet()){    
				     result.add(new GridValueInfo(entry.getKey(), entry.getValue()));    
				}   
			}
		}
		catch(Exception e)
		{
			log.error("获取格点值序列，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 根据格点值序列订正格点。已弃用，在客户端已实现
	 * 参数：数据集名、区划子项ID、订正方法（0：统一赋值，value=x；1：统一加减值，value+=x；2：统一增量（百分比），value*=(1+x))）等
	 * 返回：是否成功
	 * @return
	 */
	@POST
	@Path("updateGridByGridValueSerial")
	@Produces("application/json")
	public Object updateGridByGridValueSerial(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		Boolean result = false;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "datetime"));
			//double dValue= CommonTool.getJSONDouble(jsonObject, "value");
			Integer method= CommonTool.getJSONInt(jsonObject, "method");
			String datasetName = CommonTool.getJSONStr(jsonObject, "datasetName");
			Integer regionId = CommonTool.getJSONInt(jsonObject, "regionId");
			String hourSpans = CommonTool.getJSONStr(jsonObject, "hourSpans");
			String gridValues = CommonTool.getJSONStr(jsonObject, "gridValues");
			
			String[] arrayHourSpan = hourSpans.split(",");
			String[] arrayGridValue = gridValues.split(",");
			for(int i=0; i<arrayHourSpan.length; i++)
			{
				Integer hour = Integer.valueOf(arrayHourSpan[i]);
				Double dValue = Double.valueOf(arrayGridValue[i]);
				if(dValue == 0.0) //没有发生变化，不订正
					continue;
				String strGridDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
				Dataset dt  = this.getDataset(strGridDatasetName, true);
				if(dt == null)
					return result;
				DatasetRaster dg = (DatasetRaster)dt;
				GeoRegion geo = null;
				DatasetVector dtv = (DatasetVector)this.getDataset(datasetName, true);
				if(dtv != null)
				{
					Recordset rs = dtv.Query("", null);
					if(rs.Seek(regionId))
						geo = (GeoRegion)rs.GetGeometry();
					rs.Destroy();
					
					if(geo != null)
					{
						result = FillRegion(dg, geo, dValue, method, element);
						if(result)
						{
							m_datasetRefreshList.add(dg.GetName());
							
							SimpleDateFormat df = new SimpleDateFormat("MMddHHmmss");
							String strTime = df.format(new Date());
							Integer nTime = Integer.parseInt(strTime);
							m_datasetUpdateTime.put(dg.GetName(),nTime);
						}
					}
				}
			}
			//Datasource ds = App.getGridDatasource();
			//ds.refresh(); //刷新一下数据源
		} catch (Exception e) {
			log.error("根据气候区划订正格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		long endtime = System.currentTimeMillis();
		log.info("根据气候区划订正格点：" + String.valueOf(endtime - begintime));
		return result;
	}
	
	/*
	 * 添加格点产品信息
	 * */
	private Integer addGridInfo(Statement stmt, String departCode, String type,String element,String forecastTime,int hourSpan,int totalHourSpan,int level,
			String version,String tabelName,String nwpModel, String nwpModelTime,String userName,String  forecaster,String issuer,
			String makeTime,String lastModifyTime,Integer subjective,String remark){
		Integer key = -1;
		 try {
			String sql = String.format("INSERT INTO `t_gridproduct` (`departCode`, `type`, `element`, `forecastTime`, `hourSpan`, `totalHourSpan`, `level`, `version`, `tabelName`, `nwpModel`, `nwpModelTime`, `userName`, `forecaster`, `issuer`, `makeTime`, `lastModifyTime`, `subjective`, `remark`) VALUES ('%s', '%s', '%s', '%s', %d, %d, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s');",
						departCode, type, element, forecastTime, hourSpan, totalHourSpan, level, version, tabelName, nwpModel, nwpModelTime, userName, forecaster, issuer, makeTime, lastModifyTime, subjective, remark);
			Integer row = stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
			ResultSet rs = stmt.getGeneratedKeys ();
			if (rs.next()) {
				key = rs.getInt(row);
				}
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return key;
	}
	
	/*
	 * 修改格点产品信息
	 * */
	private Integer updateGridInfo(Statement stmt,Integer id, String departCode,String type,String element,String forecastTime,int hourSpan,int totalHourSpan,int level,String version, 
			String tabelName,String nwpModel, String nwpModelTime,String userName,String forecaster,String issuer,String makeTime,String lastModifyTime,Integer subjective,String remark){
		Integer key = -1;
		try {			
			if(id<0){
				key = addGridInfo(stmt, departCode, type, element, forecastTime, hourSpan, totalHourSpan, level, version, tabelName, nwpModel, nwpModelTime, userName, forecaster, issuer, makeTime, lastModifyTime, subjective, remark);
				return key;
			}			
			//执行更新
			String sql = String.format("UPDATE `t_gridproduct` SET `type`='%s', `element`='%s', `forecastTime`='%s', `hourSpan`=%d, `totalHourSpan`=%d, `level`=%d, `version`='%s', `tabelName`='%s', `nwpModel`='%s', `nwpModelTime`='%s', `userName`='%s', `forecaster`='%s', `issuer`='%s', `makeTime`='%s', `lastModifyTime`='%s', `subjective`='%d', `remark`='%s' WHERE `id`=%d;",
					type, element, forecastTime, hourSpan, totalHourSpan, level, version, tabelName, nwpModel, nwpModelTime, userName, forecaster, issuer, makeTime, lastModifyTime, subjective, remark, id);
			stmt.executeUpdate(sql);
			key = id;
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return key;
	}
	
	/*
	 * 查询（全部要素）格点信息
	 * */
	private ArrayList<GridInfo> queryGridInfo(String departCode,String type,String maketime,String version,String forecastTime){
		ArrayList<GridInfo> result = new ArrayList<GridInfo>();
		try {
//			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
//					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
//					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
//			Statement  stmt = conn.createStatement();			
			String sql = String.format("select * from t_gridproduct where departCode='%s' and type='%s' and makeTime='%s' and version='%s' and forecastTime='%s' order by userName desc", departCode, type, maketime, version, forecastTime);
			ResultSet resultSet = statmentForGDYBDB.executeQuery(sql);
			while(resultSet.next()) {
				GridInfo gi = new GridInfo(); 
				gi.setId(resultSet.getInt("id"));
				gi.setDepartCode(resultSet.getString("departCode"));
				gi.setType(resultSet.getString("type"));
				gi.setElement(resultSet.getString("element"));
				gi.setForecastTime(resultSet.getString("forecastTime"));
				gi.setHourSpan(resultSet.getInt("hourSpan"));
				gi.setTotalHourSpan(resultSet.getInt("totalHourSpan"));
				gi.setLevel(resultSet.getInt("level"));
				gi.setVerstion(resultSet.getString("version"));
				gi.setTabelName(resultSet.getString("tabelName"));
				gi.setNWPModel(resultSet.getString("nwpModel"));
				gi.setNWPModelTime(resultSet.getString("nwpModelTime"));
				gi.setUserName(resultSet.getString("userName"));
				gi.setForecaster(resultSet.getString("forecaster"));
				gi.setIssuer(resultSet.getString("issuer"));
				gi.setMakeTime(resultSet.getString("makeTime"));
				gi.setLastModifyTime(resultSet.getString("lastModifyTime"));
				gi.setSubjective(resultSet.getInt("subjective"));
				gi.setRemark(resultSet.getString("remark"));
				result.add(gi);
			}
//			stmt.close();
//			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 查询（批量）格点信息
	 * */
	private ArrayList<GridInfo> queryGridInfo(String departCode, String type,String element,String maketime,String version,String forecastTime){
		ArrayList<GridInfo> result = new ArrayList<GridInfo>();
		try {
//			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
//					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
//					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
//			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridproduct where departCode='%s' and type='%s' and element='%s' and makeTime='%s' and version='%s' and forecastTime='%s'", departCode, type, element, maketime, version, forecastTime);
//			ResultSet resultSet = stmt.executeQuery(sql);
			ResultSet resultSet = statmentForGDYBDB.executeQuery(sql);
			while(resultSet.next()) {
				GridInfo gi = new GridInfo(); 
				gi.setId(resultSet.getInt("id"));
				gi.setDepartCode(resultSet.getString("departCode"));
				gi.setType(resultSet.getString("type"));
				gi.setElement(resultSet.getString("element"));
				gi.setForecastTime(resultSet.getString("forecastTime"));
				gi.setHourSpan(resultSet.getInt("hourSpan"));
				gi.setTotalHourSpan(resultSet.getInt("totalHourSpan"));
				gi.setLevel(resultSet.getInt("level"));
				gi.setVerstion(resultSet.getString("version"));
				gi.setTabelName(resultSet.getString("tabelName"));
				gi.setNWPModel(resultSet.getString("nwpModel"));
				gi.setNWPModelTime(resultSet.getString("nwpModelTime"));
				gi.setUserName(resultSet.getString("userName"));
				gi.setForecaster(resultSet.getString("forecaster"));
				gi.setIssuer(resultSet.getString("issuer"));
				gi.setMakeTime(resultSet.getString("makeTime"));
				gi.setLastModifyTime(resultSet.getString("lastModifyTime"));
				gi.setSubjective(resultSet.getInt("subjective"));
				gi.setRemark(resultSet.getString("remark"));
				result.add(gi);
			}
//			stmt.close();
//			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 查询（批量）格点信息
	 * */
	private ArrayList<GridInfo> queryCalamityGridInfo(String element, String maketimeStart, String maketimeEnd){
		ArrayList<GridInfo> result = new ArrayList<GridInfo>();
		try {
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridproduct where element='%s' and makeTime>='%s' and makeTime<='%s' order by makeTime desc", element, maketimeStart, maketimeEnd);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				GridInfo gi = new GridInfo(); 
				gi.setId(resultSet.getInt("id"));
				gi.setDepartCode(resultSet.getString("departCode"));
				gi.setType(resultSet.getString("type"));
				gi.setElement(resultSet.getString("element"));
				gi.setForecastTime(resultSet.getString("forecastTime"));
				gi.setHourSpan(resultSet.getInt("hourSpan"));
				gi.setTotalHourSpan(resultSet.getInt("totalHourSpan"));
				gi.setLevel(resultSet.getInt("level"));
				gi.setVerstion(resultSet.getString("version"));
				gi.setTabelName(resultSet.getString("tabelName"));
				gi.setNWPModel(resultSet.getString("nwpModel"));
				gi.setNWPModelTime(resultSet.getString("nwpModelTime"));
				gi.setUserName(resultSet.getString("userName"));
				gi.setForecaster(resultSet.getString("forecaster"));
				gi.setIssuer(resultSet.getString("issuer"));
				gi.setMakeTime(resultSet.getString("makeTime"));
				gi.setLastModifyTime(resultSet.getString("lastModifyTime"));
				gi.setSubjective(resultSet.getInt("subjective"));
				gi.setRemark(resultSet.getString("remark"));
				result.add(gi);
			}
			stmt.close();
			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 查询（批量）格点信息
	 * */
	private ArrayList<GridInfo> queryNewCalamityGridInfo(String element, String departCode, String maketimeStart, String maketimeEnd){
		ArrayList<GridInfo> result = new ArrayList<GridInfo>();
		try {
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridproduct a where a.id not in (select productId from t_gridproductsendinfo where receiveDepartCode = '%s') and a.element in ("+element+") and a.makeTime>='%s' and a.makeTime<='%s' order by a.makeTime desc", departCode, maketimeStart, maketimeEnd);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				GridInfo gi = new GridInfo(); 
				gi.setId(resultSet.getInt("id"));
				gi.setDepartCode(resultSet.getString("departCode"));
				gi.setType(resultSet.getString("type"));
				gi.setElement(resultSet.getString("element"));
				gi.setForecastTime(resultSet.getString("forecastTime"));
				gi.setHourSpan(resultSet.getInt("hourSpan"));
				gi.setTotalHourSpan(resultSet.getInt("totalHourSpan"));
				gi.setLevel(resultSet.getInt("level"));
				gi.setVerstion(resultSet.getString("version"));
				gi.setTabelName(resultSet.getString("tabelName"));
				gi.setNWPModel(resultSet.getString("nwpModel"));
				gi.setNWPModelTime(resultSet.getString("nwpModelTime"));
				gi.setUserName(resultSet.getString("userName"));
				gi.setForecaster(resultSet.getString("forecaster"));
				gi.setIssuer(resultSet.getString("issuer"));
				gi.setMakeTime(resultSet.getString("makeTime"));
				gi.setLastModifyTime(resultSet.getString("lastModifyTime"));
				gi.setSubjective(resultSet.getInt("subjective"));
				gi.setRemark(resultSet.getString("remark"));
				result.add(gi);
			}
			stmt.close();
			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 查询（批量）格点信息
	 * */
	private ArrayList<SendInfo> queryProductSendInfo(int productId){
		ArrayList<SendInfo> result = new ArrayList<SendInfo>();
		try {
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridproductsendinfo where productId=%d order by receiveTime desc", productId);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				SendInfo info = new SendInfo(); 
				info.setProductId(resultSet.getInt("productId"));
				info.setSendFrom(resultSet.getString("sendFrom"));
				info.setReceiveDepartCode(resultSet.getString("receiveDepartCode"));
				info.setReceiveDepartName(resultSet.getString("receiveDepartName"));
				info.setReceiveTime(resultSet.getString("receiveTime"));
				result.add(info);
			}
			stmt.close();
			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/*
	 * 查询（单个）格点信息
	 * */
	private GridInfo queryGridInfo(String departCode, String type,String element,String maketime,String version,String forecastTime,Integer hourSpan){
		GridInfo result = null;
		try {
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), 
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()),
					dataBaseConnectionConfigInfo.getUser(),dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridproduct where departCode='%s' and type='%s' and element='%s' and makeTime='%s' and version='%s' and forecastTime='%s' and hourSpan=%d", departCode, type, element, maketime, version, forecastTime, hourSpan);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				GridInfo gi = new GridInfo(); 
				gi.setId(resultSet.getInt("id"));
				gi.setDepartCode(resultSet.getString("departCode"));
				gi.setType(resultSet.getString("type"));
				gi.setElement(resultSet.getString("element"));
				gi.setForecastTime(resultSet.getString("forecastTime"));
				gi.setHourSpan(resultSet.getInt("hourSpan"));
				gi.setTotalHourSpan(resultSet.getInt("totalHourSpan"));
				gi.setLevel(resultSet.getInt("level"));
				gi.setVerstion(resultSet.getString("version"));
				gi.setTabelName(resultSet.getString("tabelName"));
				gi.setNWPModel(resultSet.getString("nwpModel"));
				gi.setNWPModelTime(resultSet.getString("nwpModelTime"));
				gi.setUserName(resultSet.getString("userName"));
				gi.setForecaster(resultSet.getString("forecaster"));
				gi.setIssuer(resultSet.getString("issuer"));
				gi.setMakeTime(resultSet.getString("makeTime"));
				gi.setLastModifyTime(resultSet.getString("lastModifyTime"));
				gi.setSubjective(resultSet.getInt("subjective"));
				gi.setRemark(resultSet.getString("remark"));
				result = gi;
			}
			stmt.close();
			conn.close();
		 } 
		 catch (Exception e){
			 e.printStackTrace();
		 } 
		 return result;
	}
	
	/**
	 * 保存格点
	 * @return
	 */
	@POST
	@Path("saveGrid")
	@Produces("application/json")
	public Object saveGrid(@FormParam("para") String para) {
		long begintime = System.currentTimeMillis();
		Integer result = -1;
		Connection conn = null;
		Statement  stmt = null;
		try {
			conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(),
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(),
					dataBaseConnectionConfigInfo.getPassword());
			stmt = conn.createStatement(); 
			
			JSONObject jsonObject = new JSONObject(para);
			Integer id = CommonTool.getJSONInt(jsonObject, "id");
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			//String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String level = CommonTool.getJSONStr(jsonObject, "level");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String strmaketime = CommonTool.getJSONStr(jsonObject, "maketime");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strmaketime);
			String version = CommonTool.getJSONStr(jsonObject, "version");
			String strdate = CommonTool.getJSONStr(jsonObject, "datetime");
			Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strdate);
			Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");
			Integer hourspanTotal = CommonTool.getJSONInt(jsonObject, "hourspanTotal");
			String fromModel = CommonTool.getJSONStr(jsonObject, "fromModel");
			String fromModelTime = CommonTool.getJSONStr(jsonObject, "fromModelTime");
			String userName = CommonTool.getJSONStr(jsonObject, "userName");
			//userName = new String(userName.getBytes(),"ISO8859_1");
			String forecaster = CommonTool.getJSONStr(jsonObject, "forecaster");
			//forecaster = new String(forecaster.getBytes(),"ISO8859_1");
			String issuer = CommonTool.getJSONStr(jsonObject, "issuer");
			Integer subjective = CommonTool.getJSONInt(jsonObject, "subjective");
			//issuer = new String(issuer.getBytes(),"ISO8859_1");
			Double noDataValue = CommonTool.getJSONDouble(jsonObject, "noDataValue");
			String remark = jsonObject.has("remark")?CommonTool.getJSONStr(jsonObject, "remark"):"";
			
			
			Integer cols =  CommonTool.getJSONInt(jsonObject, "cols");
			Integer rows =  CommonTool.getJSONInt(jsonObject, "rows");
			Double left = CommonTool.getJSONDouble(jsonObject, "left");
			Double bottom = CommonTool.getJSONDouble(jsonObject, "bottom");
			Double width = CommonTool.getJSONDouble(jsonObject, "width");
			Double height = CommonTool.getJSONDouble(jsonObject, "height");
			String values = CommonTool.getJSONStr(jsonObject, "values");
			//log.info(values);
			 
			result = saveOneGrid(stmt, id, departCode, type, level, element, strmaketime, maketime, version, strdate, date, hour, hourspanTotal, fromModel, fromModelTime, userName, 
					forecaster, issuer, subjective, remark, noDataValue, cols, rows, left, bottom, width, height, values);
			
			//区台关键岗/值班岗，提交时自动生成首席岗审核发布产品
			if(type.equals("prvn") && version.equals("r")){
				version = "p";
				userName = "";
				issuer = "";
				subjective = 0;
				GridInfo gi = queryGridInfo(departCode, type, element, strmaketime, version, strdate, hour);
				if(gi==null || gi.getUserName().equals("")){
					long begintime1 = System.currentTimeMillis();
					saveOneGrid(stmt, gi==null?-1:gi.getId(), departCode, type, level, element, strmaketime, maketime, version, strdate, date, hour, hourspanTotal, fromModel, fromModelTime, userName,
							forecaster, issuer, subjective, remark, noDataValue, cols, rows, left, bottom, width, height, values);	
					long endtime1 = System.currentTimeMillis();
					log.info("同时生成首席预报产品耗时：" + String.valueOf(endtime1 - begintime1));
				}				
			}
			long endtime = System.currentTimeMillis();
			log.info("保存1个"+element+"格点耗时：" + String.valueOf(endtime - begintime));
		} catch (Exception e) {
			log.error("保存1个格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		try {
			stmt.close();
			conn.close();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}		
		return result;
	}
	
	/**
	 * 保存格点（批量）
	 * @return
	 */
	@POST
	@Path("saveGrids")
	@Produces("application/json")
	public Object saveGrids(@FormParam("para") String para) {		
		ArrayList<Integer> result = new ArrayList<Integer>();
		Connection conn = null;
		Statement  stmt = null;
		try {			
			long begintime = System.currentTimeMillis();
			conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(),
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(),
					dataBaseConnectionConfigInfo.getPassword());
			stmt = conn.createStatement(); 
			
			ArrayList<GridInfo> gisP = null;
			
			JSONObject json = new JSONObject(para);
			JSONArray jsonArray = json.getJSONArray("gridinfos");  
			int iSize = jsonArray.length();
			String element = "";
			for (int i = 0; i < iSize; i++) {  				
				JSONObject jsonObject = jsonArray.getJSONObject(i);
				Integer id = CommonTool.getJSONInt(jsonObject, "id");
				String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
				//String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
				String type = CommonTool.getJSONStr(jsonObject, "type");
				String level = CommonTool.getJSONStr(jsonObject, "level");
				element = CommonTool.getJSONStr(jsonObject, "element");
				String strmaketime = CommonTool.getJSONStr(jsonObject, "maketime");
				Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strmaketime);
				String version = CommonTool.getJSONStr(jsonObject, "version");
				String strdate = CommonTool.getJSONStr(jsonObject, "datetime");
				Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strdate);
				Integer hour = CommonTool.getJSONInt(jsonObject, "hourspan");
				Integer hourspanTotal = CommonTool.getJSONInt(jsonObject, "hourspanTotal");
				String fromModel = CommonTool.getJSONStr(jsonObject, "fromModel");
				String fromModelTime = CommonTool.getJSONStr(jsonObject, "fromModelTime");
				String userName = CommonTool.getJSONStr(jsonObject, "userName");
				//userName = new String(userName.getBytes(),"ISO8859_1");
				String forecaster = CommonTool.getJSONStr(jsonObject, "forecaster");
				//forecaster = new String(forecaster.getBytes(),"ISO8859_1");
				String issuer = CommonTool.getJSONStr(jsonObject, "issuer");
				String remark = jsonObject.has("remark")?CommonTool.getJSONStr(jsonObject, "remark"):"";
				Integer subjective = CommonTool.getJSONInt(jsonObject, "subjective");
				//issuer = new String(issuer.getBytes(),"ISO8859_1");
				Double noDataValue = CommonTool.getJSONDouble(jsonObject, "noDataValue");
				
				
				Integer cols =  CommonTool.getJSONInt(jsonObject, "cols");
				Integer rows =  CommonTool.getJSONInt(jsonObject, "rows");
				Double left = CommonTool.getJSONDouble(jsonObject, "left");
				Double bottom = CommonTool.getJSONDouble(jsonObject, "bottom");
				Double width = CommonTool.getJSONDouble(jsonObject, "width");
				Double height = CommonTool.getJSONDouble(jsonObject, "height");
				String values = CommonTool.getJSONStr(jsonObject, "values");
				//log.info(values);
				 
				Integer key = saveOneGrid(stmt, id, departCode, type, level, element, strmaketime, maketime, version, strdate, date, hour, hourspanTotal, fromModel, fromModelTime, userName, 
						forecaster, issuer, subjective, remark, noDataValue, cols, rows, left, bottom, width, height, values);
				result.add(key);			
				
				//区台关键岗/值班岗，提交时自动生成首席岗审核发布产品
				if(type.equals("prvn") && version.equals("r")){
					version = "p";
					userName = "";
					issuer = "";
					subjective = 0;
					String userNameP = "";	
					int idP = -1;
					if(gisP==null)
						gisP = queryGridInfo(departCode, type, element, strmaketime, version, strdate); //这样查询1次
					if(gisP != null && gisP.size() > 0){
						for(GridInfo gi : gisP){
							if(gi.getHourSpan() == hour){
								userNameP = gi.getUserName();	
								idP = gi.getId();
							}								
						}										
					}
					if(userNameP.equals("")){
						saveOneGrid(stmt, idP, departCode, type, level, element, strmaketime, maketime, version, strdate, date, hour, hourspanTotal, fromModel, fromModelTime, userName,
								forecaster, issuer, subjective, remark, noDataValue, cols, rows, left, bottom, width, height, values);	
					}	
				}				
			 }
			long endtime = System.currentTimeMillis();
			log.info("批量保存"+element+"格点耗时：" + String.valueOf(endtime - begintime));
		} catch (Exception e) {
			log.error("保存格点，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
			
		try {
			stmt.close();
			conn.close();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return result;
	}
	
	private Integer saveOneGrid(Statement stmt,Integer id, String departCode, String type, String level, String element,String strmaketime,Date maketime,String version, String strdate, Date date, Integer hour, Integer hourspanTotal, 
			String fromModel, String fromModelTime, String userName, String forecaster, String issuer,Integer subjective,String remark, 
			Double noDataValue, Integer cols,Integer rows,Double left,Double bottom,Double width,Double height,String values){
		Integer result = -1;
		try
		{	
			String strGridDatasetName = getGridDatasetName(type, level, element, maketime, version, date, hour);
			DatasetRaster dg  = (DatasetRaster)this.getDataset(strGridDatasetName, false); //如果是风场，它就是U分量场
			DatasetRaster dgV = null;	//如果是风场，它就是V分量场；否则它为空，或者为Tag属性
			Boolean iswind = false;
			if(element.equals("10uv") || element.equals("wmax")){
				iswind = true;
				dg  = (DatasetRaster)this.getDataset(strGridDatasetName+"_u", true);
				dgV  = (DatasetRaster)this.getDataset(strGridDatasetName+"_v", true);
			}
			
			Datasource ds = this.getDatasource(strGridDatasetName);
			if(ds == null){
				log.error("数据源为空");
				return -1;
			}
			
			//判断是否具有Tag属性
			String[] arrayStrValues = values.split(",");
			ArrayList<Double> arryValues = new ArrayList<Double>(); 
			for(int i=0; i<arrayStrValues.length; i++)
				arryValues.add(Double.valueOf(arrayStrValues[i]));
			Boolean hasTag = (!iswind)&&(arryValues.size()==cols*rows*2); //不是风场，且值为双倍，则存在tag属性
			if(hasTag)
				dgV  = (DatasetRaster)this.getDataset(strGridDatasetName+"_t", true);

			Boolean bNewDataset = false;
			if(dg == null)
			{
				bNewDataset = true;
				String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", left, bottom, left+width, bottom+height);
				String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
						iswind?strGridDatasetName+"_u":strGridDatasetName, "Single", cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
				dg = ds.CreateDatasetRaster(str);
				if(dg == null)
				{
					log.error("保存格点，详情【创建数据集失败】");
					return -1;
				}
				else
					log.info("保存格点，新建数据集："+(iswind?strGridDatasetName+"_u":strGridDatasetName));
				
				//保存格点预报产品信息
				String tabelName = strGridDatasetName;
				Date dateNow = new Date();
				String lastModifyTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dateNow);
				int nlevel = level == "" ? 1000 : Integer.valueOf(level);				
				result = this.addGridInfo(stmt, departCode, type, element, strdate, hour, hourspanTotal, nlevel, version, tabelName, fromModel, fromModelTime, userName, forecaster, issuer, strmaketime, lastModifyTime, subjective, remark);
			}
			else
			{				
				//更新格点预报产品信息
				String tabelName = strGridDatasetName;
				Date dateNow = new Date();
				String lastModifyTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(dateNow);
				int nlevel = level == "" ? 1000 : Integer.valueOf(level);
				result = this.updateGridInfo(stmt, id, departCode, type, element, strdate, hour, hourspanTotal, nlevel, version, tabelName, fromModel, fromModelTime,userName, forecaster, issuer, strmaketime, lastModifyTime, subjective, remark);
			}			
			
			//有可能哪里错误，导致U分量存在，V分量没有，所以这里放外面来。
			if(iswind && dgV == null){
				String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", left, bottom, left+width, bottom+height);
				String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
						strGridDatasetName+"_v", "Single", cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
				dgV = ds.CreateDatasetRaster(str);
				if(dgV == null)
				{
					log.error("保存格点，详情【创建数据集失败】");
					return -1;
				}
			}
			if(hasTag && dgV == null){
				String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", left, bottom, left+width, bottom+height);
				String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
						strGridDatasetName+"_t", "Single", cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
				dgV = ds.CreateDatasetRaster(str);
				if(dgV == null)
				{
					log.error("保存格点，详情【创建数据集失败】");
					return -1;
				}
			}
			
//			long begintime = System.currentTimeMillis(); 
			
//			GeoRegion geo = null;
//			Rectangle2D bounds = null;
//			Analyst pAnalyst = null;
//			if(departCode.length() > 2) //市县部门需要获取本市边界，仅区域内赋值
//			{
//				pAnalyst = Analyst.CreateInstance("SpatialRel", Application.m_workspace);				            
//	            pAnalyst.SetPropertyValue("SpatialRel", "Contain");
//	            AdminDivisionService ads = new AdminDivisionService();
//				geo = ads.getGeoRegion(departCode);
//				bounds = geo.GetBounds();				
//			}
			
			
//			String[] arrayStrValues = values.split(",");
//			ArrayList<Double> arryValues = new ArrayList<Double>(); 
//			for(int i=0; i<arrayStrValues.length; i++)
//				arryValues.add(Double.valueOf(arrayStrValues[i]));
			Scanline sl = new Scanline(dg.GetValueType(), cols);
			Scanline slV = (iswind||hasTag)?new Scanline(dgV.GetValueType(), cols) : null;
			
			//如果是市台首次提交，尝试由区台初始化/拷贝
			if(bNewDataset && type.equals("cty")){
				log.info("市台首次提交，尝试由区台拷贝初始化");
				String strTypePrvn = "prvn";
				Date maketimePrvn = maketime;
				if(maketime.getHours() == 10) //市台10点做08点的，初始场应该是05点市台
				{
					strTypePrvn = "cty";
					maketimePrvn = new Date(maketime.getYear(), maketime.getMonth(), maketime.getDate(), 5, maketime.getMinutes(), maketime.getSeconds());
				}
				String strGridDatasetNamePrvn = getGridDatasetName(strTypePrvn, level, element, maketimePrvn, version, date, hour);
				DatasetRaster dgPrvn  = null;
				DatasetRaster dgVPrvn = null;
				if(iswind){
					dgPrvn  = (DatasetRaster)this.getDataset(strGridDatasetNamePrvn+"_u", false);
					dgVPrvn  = (DatasetRaster)this.getDataset(strGridDatasetNamePrvn+"_v", false);
				}
				else
				{
					dgPrvn  = (DatasetRaster)this.getDataset(strGridDatasetNamePrvn, false);
					dgVPrvn  = (DatasetRaster)this.getDataset(strGridDatasetNamePrvn+"_t", false);
				}
				
				if(dgPrvn != null){
					//如果区台中存在TAG，则创建市台TAG，格点属性要同步拷贝
					if(!iswind && dgV == null && dgVPrvn != null)
					{
						String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", left, bottom, left+width, bottom+height);
						String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
								strGridDatasetName+"_t", "Single", cols, rows, "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, noDataValue);
						dgV = ds.CreateDatasetRaster(str);
						if(dgV == null)
						{
							log.error("保存格点，详情【创建数据集失败】");
							return -1;
						}
						else{
							slV = new Scanline(dgV.GetValueType(), cols);
						}
					}
					
					dgPrvn.Open();
					dgPrvn.CalcExtreme();
					log.info(String.format("%s：%f", dgPrvn.GetName(), dgPrvn.GetMaxValue())); //test
					
					//拷贝格点值
					for (int i = 0; i < rows ; i++)
		            {
						dgPrvn.GetScanline(0, i, sl);
						dg.SetScanline(0, i, sl);
						if(dgV != null && dgVPrvn != null && slV != null){
							dgVPrvn.GetScanline(0, i, slV);
			                dgV.SetScanline(0, i, slV);
						}						
		            }
					dg.FlushCache();
					dg.CalcExtreme();
					if(dgV != null){
						dgV.FlushCache();
						dgV.CalcExtreme();
					}
					
					log.info("完成格点拷贝");
					bNewDataset = false; //注意这里置为false，防止后面的代码，让第一个市台全部覆盖
				}
				else{
					log.info(strGridDatasetNamePrvn+"参考场未找到");
				}
			}
			
			if(departCode.length() == 2 || bNewDataset){ //区台，如果市台是新建数据集需要全部写入
				if(iswind || hasTag){
					for (int i = rows - 1; i >= 0 ; i--)
		            {
						int count = (rows - 1 - i)*cols*2;
						dg.GetScanline(0, i, sl);
						dgV.GetScanline(0, i, slV);
						for (int j = 0; j < cols; j++)
		                {
								sl.SetValue(j, arryValues.get(count + j*2));
								slV.SetValue(j, arryValues.get(count + j*2 + 1));
		                }
		                dg.SetScanline(0, i, sl);
		                dgV.SetScanline(0, i, slV);
		            }
					dg.FlushCache();
					dg.CalcExtreme();
					dgV.FlushCache();
					dgV.CalcExtreme();
				}
				else{
					for (int i = rows - 1; i >= 0 ; i--)
		            {
						int count = (rows - 1 - i)*cols;
						dg.GetScanline(0, i, sl);
						for (int j = 0; j < cols; j++)
		                {
								sl.SetValue(j, arryValues.get(count+j));
		                }
		                dg.SetScanline(0, i, sl);                
		            }
					dg.FlushCache();
					dg.CalcExtreme();	
				}
//				long endtime = System.currentTimeMillis();
//				log.info("保存区台数据集耗时：" + String.valueOf(endtime - begintime));
			}
			else if(departCode.length() > 2){ //市县台
				//if(geo != null)
				if(true)
				{
					//部门CODE转换为double类型
					double dCode = Double.parseDouble(departCode);
					
					//获取栅格行政区划
					String strAlias = departCode.length()==4?"t_admindiv_city_grid":"t_admindiv_county_grid";
					Datasource dsAdmin = Application.m_workspace.GetDatasource(strAlias);
					if(dsAdmin == null){
						String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
						classPath=classPath.substring(1);					
						String strJson = String.format("{\"Type\":\"GTiff\",\"Alias\":\"%s\",\"Server\":\"%s\"}", strAlias, classPath + "../data/"+strAlias+".tif");
				        dsAdmin = Application.m_workspace.OpenDatasource(strJson);
					}
					if(dsAdmin == null){
						log.error("保存格点：栅格行政区划为空");
						return -1;
					}
			        DatasetRaster dgAdmin = (DatasetRaster)dsAdmin.GetDataset(0);
			        int colsAdmin = dgAdmin.GetWidth();
			        int rowsAdmin = dgAdmin.GetHeight();
			        Scanline slAdmin = new Scanline(dgAdmin.GetValueType(), dgAdmin.GetWidth());
			        
			        //获取行政区划Bounds
			        Rectangle2D bounds = m_areaBounds.get(departCode);
			        if(bounds == null){
			        	int minX = colsAdmin;
			        	int minY = rowsAdmin;
			        	int maxX = 0;
			        	int maxY = 0;
			        	for(int i=0; i<rowsAdmin; i++){
			        		dgAdmin.GetScanline(0, i, slAdmin);
			        		for(int j=0; j<colsAdmin; j++){
			        			if(slAdmin.GetValue(j) == dCode){
			        				if(i<minY)
			        					minY = i;
			        				if(j<minX)
			        					minX = j;
			        				if(i>maxY)
			        					maxY = i;
			        				if(j>maxX)
			        					maxX = j;
			        			}
				        	}	
			        	}
			        	bounds = new java.awt.geom.Rectangle2D.Double(minX, minY, maxX-minX, maxY-minY);
			        	m_areaBounds.put(departCode, bounds);
			        }			        
			        
			        //计算偏移量
			        Point2D pt2d00 = dg.CellToPoint(new Point2D.Double(0, 0));
			        Point2D cell00 = dgAdmin.PointToCell(pt2d00);
			        int offsetX = (int)cell00.getX();
			        int offsetY = (int)cell00.getY();
					
					Boolean isInArea = true;
//					Point2D pt2dLT = new Point2D.Double(bounds.getMinX(), bounds.getMaxY());
//					Point2D pt2dRB = new Point2D.Double(bounds.getMaxX(), bounds.getMinY());
//					Point2D cellLT = dg.PointToCell(pt2dLT);
//					Point2D cellRB = dg.PointToCell(pt2dRB);
//					int areaLeft = (int)cellLT.getX();
//					int areaBottom = (int)cellRB.getY();
//					int areaRight = (int)cellRB.getX();
//					int areaTop = (int)cellLT.getY();
					int areaLeft = (int)bounds.getMinX()-offsetX;
					int areaBottom = (int)bounds.getMinY()-offsetY;
					int areaRight = (int)bounds.getMaxX()-offsetX;
					int areaTop = (int)bounds.getMaxY()-offsetY;
					for (int i = areaTop; i >= areaBottom ; i--)
		            {
						int count = (rows - 1 - i)*cols*((iswind||hasTag)?2:1);
						int iAdmin = i+offsetY; 
						if(iAdmin<0 || iAdmin>=rowsAdmin)
							continue;
						dgAdmin.GetScanline(0, iAdmin, slAdmin);
						dg.GetScanline(0, i, sl);
						if(iswind || hasTag)
							dgV.GetScanline(0, i, slV);
						for (int j = areaLeft; j <= areaRight; j++)
		                {		
							//基于矢量行政区划判断
//							isInArea = true;
//							Point2D pt2d = dg.CellToPoint(new Point(j, i));	
//							String str = String.format("\"Geometry\":\"%X\"", geo.GetHandle());
//				            pAnalyst.SetPropertyValue("A", "{" + str + "}");
//		                    GeoPoint geoPoint = new GeoPoint(pt2d.getX(), pt2d.getY());
//		                    str = String.format("\"Geometry\":\"%X\"", geoPoint.GetHandle());
//		                    pAnalyst.SetPropertyValue("B", "{" + str + "}");
//		                    pAnalyst.Execute();
//		                    String strOutput = pAnalyst.GetPropertyValue("Output");
//		                    if(strOutput.equals("true"))
//		                    	isInArea = true;
//		                    else
//		                    	isInArea = false;
							
							//基于栅格行政区划判断
							int jAdmin = j+offsetX; 
							if(jAdmin<0 || jAdmin>=colsAdmin)
								continue;
							double dCodeTemp = slAdmin.GetValue(jAdmin);
							isInArea = (dCodeTemp == dCode);
							
							//赋值
							if(isInArea)
							{
								if(iswind || hasTag){
									sl.SetValue(j, arryValues.get(count + j*2));
									slV.SetValue(j, arryValues.get(count + j*2 + 1));
								}
								else{
									sl.SetValue(j, arryValues.get(count+j));	
								}								
							}
		                }
		                dg.SetScanline(0, i, sl);     
		                if(iswind || hasTag)
		                	dgV.SetScanline(0, i, slV);
		            }
					dg.FlushCache();
					dg.CalcExtreme();
					if(iswind || hasTag){
						dgV.FlushCache();
						dgV.CalcExtreme();	
					}
				}
			}
			if(sl != null)
				sl.Destroy();
			if(slV != null)
				slV.Destroy();
//			result = true;
		} catch (Exception e) {
			log.error("保存格点，详情【" + e.getMessage() + "】");
			//e.printStackTrace();
			
			//输出日志，测试用
			StringWriter sw = new StringWriter();  
            PrintWriter pw = new PrintWriter(sw);  
            e.printStackTrace(pw);  
            log.error(sw.toString());
            pw.close();
            try {
            	sw.close();	
			} catch (Exception e2) {
				// TODO: handle exception
			}            
			
			result = -1;
		}
		return result;
	}
	
	/**
	 * 生成格点报，导出Micaps第4和11类数据
	 * @return
	 */
	@POST
	@Path("export")
	@Produces("application/json")
	public Object export(@FormParam("para") String para) {
		Boolean result = false;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String stationCode = CommonTool.getJSONStr(jsonObject, "StationCode");  	//例如广西：BANN
			String type = CommonTool.getJSONStr(jsonObject, "type");                	//省台订正：prvn
			String elements = CommonTool.getJSONStr(jsonObject, "elements");	    	//所有要素，逗号分隔，例如：2t,tmax,tmin,r3,r12,tcc,vis,10uv。因为不同的业务（陆地岗、海洋岗、短临岗、首席岗等）生成的格点报
			String[] arrayElement = elements.split(",");
			Date maketime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			String version = CommonTool.getJSONStr(jsonObject, "version");
			String exportType = CommonTool.getJSONStr(jsonObject, "exportType"); //输出类型
			Double left = CommonTool.getJSONDouble(jsonObject, "left"); //输出范围
			Double bottom = CommonTool.getJSONDouble(jsonObject, "bottom"); //输出范围
			Double right = CommonTool.getJSONDouble(jsonObject, "right"); //输出范围
			Double top = CommonTool.getJSONDouble(jsonObject, "top"); //输出范围
//			String datetime = CommonTool.getJSONStr(jsonObject, "datetime");         	//预报时间：2015-11-03 08:00:00
//			Date dateForecast = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(datetime);
			
			//根据制作时间查询起报时间
			String strMakeTimeHHmm = new SimpleDateFormat("HH:mm").format(maketime);
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", "cty", strMakeTimeHHmm);
			ResultSet resultSet = stmt.executeQuery(sql);			
			int forecastHour = -1;
			while(resultSet.next()) {
				forecastHour = resultSet.getInt("forecastHour");
				break;
			}
			stmt.close();
			conn.close();
			Date dateForecast = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "maketime"));
			dateForecast.setHours(forecastHour);
			
//			Date dateNow = new Date();
//			String makeTime = new SimpleDateFormat("yyyyMMddHHmmss").format(dateNow);
			String strMakeTime = new SimpleDateFormat("yyyyMMddHHmmss").format(maketime);
			String forecastTime = new SimpleDateFormat("yyyyMMddHHmm").format(dateForecast);
			String forecastTime_yyMMddHH = new SimpleDateFormat("yyMMddHH").format(dateForecast);
			
			ArrayList<OutputSetting> outputSettingsAll = getOutputSetting();			
			ArrayList<Scheme> defaultSchemes = getDefaultScheme();
			for(String element : arrayElement){
				Scheme scheme = null;				
				for(int i=0; i<defaultSchemes.size(); i++){
					Scheme schemeTemp = defaultSchemes.get(i);
					if(schemeTemp.element.equals(element)){
						scheme = schemeTemp;
						break;
					}
				}
				if(scheme == null){
					log.error("默认方案中不存在要素：" + element);
					continue;
				}
				
				ArrayList<OutputSetting> outputSettings = new ArrayList<OutputSetting>();
				for(int i=0; i<outputSettingsAll.size(); i++){
					OutputSetting outputSettingTemp = outputSettingsAll.get(i);
					if(outputSettingTemp.element.equals(element)){
						outputSettings.add(outputSettingTemp);
					}
				}
				if(outputSettings.size() == 0){
					log.error("输出设置中不存在要素：" + element);
					continue;
				}							
				
				for(OutputSetting outputsetting : outputSettings)
				{
					Integer hourSpan = outputsetting.hourSpan;
					Integer hourSpanTotal = outputsetting.hourSpanTotal;
					
					File folder = new File(outputsetting.outputPath);
					if(!folder.exists()){
						folder.mkdirs();
					}
					else
					{
						//String filter = "Z_NWGD_C_(.*)_date(.*)";
						//filter = filter.replaceAll("date", forecastTime);
						String filter = "date(.*)";
						filter = filter.replaceAll("date", forecastTime_yyMMddHH);
						File dataFile = new File(outputsetting.outputPath);
						File[] files = dataFile.listFiles(new BaoWenFileFilter(filter));
						if(files != null && files.length > 0)
						{
							for(File file : files)
								file.delete();
						}
					}
					
					Export export = null;
					if(exportType.equals("micaps"))
						export = new ExportMicaps();
					else if(exportType.equals("grib2"))
						export = new ExportGrib2();
					
					//Z_NWGD_C_CCCC_YYYYMMDDhhmmss_P_RFFC_SPCC-TMP_YYYYMMDDhhmm_FFFxx.GRB2
					//String strFile = String.format("%s/Z_NWGD_C_%s_%s_P_RFFC_SPCC-%s_%s_%s%s", outputsetting.outputPath, stationCode, strMakeTime, outputsetting.elementOut, forecastTime, new DecimalFormat("000").format(outputsetting.hourSpanTotal), new DecimalFormat("00").format(hourSpan));
					String strFile = String.format("%s/%s", outputsetting.outputPath, forecastTime_yyMMddHH);
					for(int h = hourSpan; h<=hourSpanTotal; h+=hourSpan){						
						Dataset dt = null;
						if(outputsetting.method == -1) //直接取值
						{
							if(element.equals("10uv") || element.equals("wmax")){
								String strDatasetName = this.getGridDatasetName(type, "1000", element, maketime, version, dateForecast, h);
								dt = this.getDataset(strDatasetName+"_u", true);	
								if(dt == null)
								{
									log.error("格点产品不存在：" + strDatasetName+"_u");
									continue;
								}	
								DatasetRaster drU = (DatasetRaster)dt;
								dt = this.getDataset(strDatasetName+"_v", true);	
								if(dt == null)
								{
									log.error("格点产品不存在：" + strDatasetName+"_v");
									continue;
								}	
								DatasetRaster drV = (DatasetRaster)dt;
								Map<String, String> metadata = export.generateMetaData(drU, outputsetting.elementCaption, outputsetting.elementOut, dateForecast, h, 
										outputsetting.isolineInterval, outputsetting.isolineStart, outputsetting.isolineEnd);
								export.writeUV(strFile, drU, drV, metadata, left, bottom, right, top);
								continue;
							}
							else{
								String strDatasetName = this.getGridDatasetName(type, "1000", element, maketime, version, dateForecast, h);
								dt = this.getDataset(strDatasetName, true);	
								if(dt == null)
								{
									log.error("格点产品不存在：" + strDatasetName);
									continue;
								}	
							}							
						}
						if(outputsetting.method == 2) //求和
						{
							ArrayList<DatasetRaster> arrayDatasetRaster = new ArrayList<DatasetRaster>();
							String[] strHourSpans = scheme.hourspan.split(",");
							for(String strHourSpan : strHourSpans){
								Integer nHourSpan = Integer.valueOf(strHourSpan);
								if(nHourSpan > (h-hourSpan) && nHourSpan <= h){
									String strDatasetName = this.getGridDatasetName(type, "1000", element, maketime, version, dateForecast, h);
									dt = this.getDataset(strDatasetName, true);
									if(dt == null)
									{
										log.error("格点产品不存在：" + strDatasetName);
										continue;
									}
									arrayDatasetRaster.add((DatasetRaster)dt);
								}
							}
							if(arrayDatasetRaster.size() == 0){
								log.error(outputsetting.elementOut + "与" + element + "时效不匹配");
								continue;
							}
							else
							{
								//创建结果数据源数据集
								String strAliasMem = "dsOutputMem";
								String desDatasetNameStatistics = "dtOutputMem";
								String strJson = "{\"Type\":\"Memory\",\"Alias\":\""+ strAliasMem +"\",\"Server\":\"\"}";
								Datasource dsMem = Application.m_workspace.GetDatasource(strAliasMem);
								if(dsMem != null)
									Application.m_workspace.CloseDatasource(dsMem.GetAlias());
								dsMem = Application.m_workspace.CreateDatasource(strJson);
								DatasetRaster dg0 = (DatasetRaster)arrayDatasetRaster.get(0);
								
								Rectangle2D rcBounds = dg0.GetBounds();
								String strBounds = String.format("\"left\":%f,\"bottom\":%f,\"right\":%f,\"top\":%f", rcBounds.getX(), rcBounds.getY(), rcBounds.getX() + rcBounds.getWidth(), rcBounds.getY() + rcBounds.getHeight()); //左 上 宽 高
								String str = String.format("{\"Name\":\"%s\",\"ValueType\":\"%s\",\"Width\":%d,\"Height\":%d,\"BlockSize\":\"256 256\",\"Projection\":\"%s\",\"Bounds\":{%s},\"NoDataValue\":%f}",
										desDatasetNameStatistics, "Single", dg0.GetWidth(), dg0.GetHeight(), "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs", strBounds, dg0.GetNoDataValue());
								DatasetRaster dgOutputMem = dsMem.CreateDatasetRaster(str);
								dgOutputMem.SetBounds(rcBounds); //因为内存数据源不支持在构造函数中赋予Bounds，因此需要调用这个接口
								dgOutputMem.Open();
								
								
								int cols = dgOutputMem.GetWidth();
	    						int rows = dgOutputMem.GetHeight();
								Scanline sl = new Scanline(dg0.GetValueType(), cols);
								double dNoDataValue = dgOutputMem.GetNoDataValue();
								double dValue = dNoDataValue;							
								for (int i = 0; i<rows; i++)
					            {
									dgOutputMem.GetScanline(0, i, sl);
									for(int j = 0; j< cols; j++){							
										dValue = dNoDataValue;
										
										for(int k=0; k<arrayDatasetRaster.size(); k++){
											DatasetRaster dgTemp = (DatasetRaster)arrayDatasetRaster.get(k);
											double dValueTemp = dgTemp.GetValue(j, i);
											if(dValueTemp == dNoDataValue)
												continue;
											if(outputsetting.method == 0){ //最大
												if(dValue == dNoDataValue || dValueTemp > dValue)
													dValue = dValueTemp;
											}
											else if(outputsetting.method == 1){ //最小
												if(dValue == dNoDataValue || dValueTemp < dValue)
													dValue = dValueTemp;
											}
											else if(outputsetting.method == 2){ //求和
												{
													if(dValue == dNoDataValue)
														dValue = dValueTemp;
													else
														dValue += dValueTemp;
												}
											}
										}
										sl.SetValue(j, dValue);
									}								
									dgOutputMem.SetScanline(0, i, sl);
					            }
								dgOutputMem.FlushCache();
								dgOutputMem.CalcExtreme();
								dt = dgOutputMem;
							}							
						}
						
						if(dt != null){				
							DatasetRaster dr = (DatasetRaster)dt;
							Map<String, String> metadata = export.generateMetaData(dr, outputsetting.elementCaption, outputsetting.elementOut, dateForecast, h, 
									outputsetting.isolineInterval, outputsetting.isolineStart, outputsetting.isolineEnd);
							export.write(strFile, dr, metadata, left, bottom, right, top);
						}	
					}
					export.destroy(); //grib数据源需要关闭才能写入文件
				}
			}
			
			result = true;
		} catch (Exception e) {
			log.error("生成格点报，详情【" + e.getMessage() + "】");
			e.printStackTrace();
		}
		return result;
	}
	
	/*
	 * 获取默认方案
	 * */
	private ArrayList<Scheme> getDefaultScheme()
	{
		ArrayList<Scheme> defaultScheme = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme");
			ResultSet resultSet = stmt.executeQuery(sql);
			defaultScheme = new ArrayList<Scheme>();
			while(resultSet.next()) {
				defaultScheme.add(new Scheme(resultSet.getString("type"), resultSet.getString("makeTime"), resultSet.getString("element"), resultSet.getString("model"), resultSet.getString("hourspan"), resultSet.getDouble("defaultDataValue")));
			}
			stmt.close();
			conn.close();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return defaultScheme;
	}
	
	/*
	 * 获取输出设置
	 * */
	private ArrayList<OutputSetting> getOutputSetting()
	{
		ArrayList<OutputSetting> outputSetting = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), 
					dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_gridoutputsetting");
			ResultSet resultSet = stmt.executeQuery(sql);
			outputSetting = new ArrayList<OutputSetting>();
			while(resultSet.next()) {
				outputSetting.add(new OutputSetting(resultSet.getString("elementOut"), resultSet.getString("elementCaption"), resultSet.getString("element"), 
						resultSet.getInt("hourSpan"), resultSet.getInt("hourSpanTotal"), resultSet.getString("outputPath"), resultSet.getInt("method"), 
						resultSet.getDouble("isolineInterval"), resultSet.getDouble("isolineStart") , resultSet.getDouble("isolineEnd"),
						resultSet.getString("stationCode"), resultSet.getInt("outputGrib2") , resultSet.getString("grib2Path"), resultSet.getInt("hourSpanTotalGrib2")));
			}
			stmt.close();
			conn.close();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		return outputSetting;
	}
	
	/**
	 * 获取初始场默认方案
	 * @return
	 */
	@POST
	@Path("getGridDefaultSchemes")
	@Produces("application/json")
	public Object getGridDefaultSchemes(@FormParam("para") String para) {
		ArrayList<Scheme> result = null;
		try {			
			result = getDefaultScheme();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 添加关键点
	 * @return
	 */
	@POST
	@Path("addKeyPoint")
	@Produces("application/json")
	public Integer addKeyPoint(@FormParam("para") String para) {
		Integer key = -1;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			
			String stationNum = CommonTool.getJSONStr(jsonObject, "stationNum");
			String stationName = CommonTool.getJSONStr(jsonObject, "stationName");
			String latitude = CommonTool.getJSONStr(jsonObject, "latitude");
			String longitude = CommonTool.getJSONStr(jsonObject, "longitude");
			String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("INSERT INTO `t_keystation` (`StationNum`, `StationName`, `Latitude`, `Longitude`, `AreaCode`) VALUES ('%s', '%s', %s, %s, '%s');",
					stationNum, stationName, latitude, longitude, areaCode);
		    Integer row = stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
		    ResultSet rs = stmt.getGeneratedKeys ();
		    if (rs.next()) {
			key = rs.getInt(row);
			}
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return key;
	}
	
	/**
	 * 更新关键点
	 * @return
	 */
	@POST
	@Path("updateKeyPoint")
	@Produces("application/json")
	public Integer updateKeyPoint(@FormParam("para") String para) {
		Integer key = -1;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			
			String id = CommonTool.getJSONStr(jsonObject, "id");
			String stationNum = CommonTool.getJSONStr(jsonObject, "stationNum");
			String stationName = CommonTool.getJSONStr(jsonObject, "stationName");
			String latitude = CommonTool.getJSONStr(jsonObject, "latitude");
			String longitude = CommonTool.getJSONStr(jsonObject, "longitude");
			String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			//执行更新
			String sql = String.format("UPDATE `t_keystation` SET `StationNum`='%s', `StationName`='%s', `Latitude`='%s', `Longitude`=%s, `AreaCode`=%s WHERE `id`=%s;",
					stationNum, stationName, latitude, longitude, areaCode, id);
			stmt.executeUpdate(sql);
			key = Integer.valueOf(id).intValue();
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return key;
	}
	
	/**
	 * 删除关键点
	 * @return
	 */
	@POST
	@Path("deleteKeyPoint")
	@Produces("application/json")
	public Integer deleteKeyPoint(@FormParam("para") String para) {
		Integer key = -1;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String id = CommonTool.getJSONStr(jsonObject, "id");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			//执行删除
			String sql = String.format("DELETE FROM `t_keystation` WHERE `id`=%s;", id);
			stmt.executeUpdate(sql);
			key = Integer.valueOf(id).intValue();
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return key;
	}
	
	/**
	 * 获取关键点
	 * @return
	 */
	@POST
	@Path("getKeyPoints")
	@Produces("application/json")
	public Object getKeyPoints(@FormParam("para") String para) {
		ArrayList<KeyStation> result = null;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			result = queryKeyPoints(areaCode);
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	private ArrayList<KeyStation>  queryKeyPoints(String areaCode){
		ArrayList<KeyStation> result = null;
		try {			
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_keystation where AreaCode like '%s%%'", areaCode);
			ResultSet resultSet = stmt.executeQuery(sql);
			result = new ArrayList<KeyStation>();
			while(resultSet.next()) {
				result.add(new KeyStation(resultSet.getInt("id"),resultSet.getString("StationNum"), resultSet.getString("StationName"), 
						resultSet.getDouble("Latitude"), resultSet.getDouble("Longitude"), resultSet.getDouble("Height"), 
						resultSet.getInt("ZoomLevel"), resultSet.getInt("Type"), resultSet.getString("AreaCode")));
			}
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 获取站点
	 * @return
	 */
	@POST
	@Path("getStations")
	@Produces("application/json")
	public Object getStations(@FormParam("para") String para) {
		ArrayList<Station> result = null;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			result = queryStations(areaCode);
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	private ArrayList<Station>  queryStations(String areaCode){
		ArrayList<Station> result = null;
		try {			
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_station where AreaCode like '%s%%'", areaCode);
			ResultSet resultSet = stmt.executeQuery(sql);
			result = new ArrayList<Station>();
			while(resultSet.next()) {
				result.add(new Station(resultSet.getString("StationNum"), resultSet.getString("StationName"), 
						resultSet.getDouble("Latitude"), resultSet.getDouble("Longitude"), resultSet.getDouble("Height"), 
						resultSet.getInt("ZoomLevel"), resultSet.getInt("Type"), resultSet.getString("AreaCode")));
			}
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 获取预报站点
	 * @return
	 */
	@POST
	@Path("getStationsForecast")
	@Produces("application/json")
	public Object getStationsForecast(@FormParam("para") String para) {
		ArrayList<Station> result = null;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String areaCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			result = queryStationsForecast(areaCode);
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	private ArrayList<Station>  queryStationsForecast(String areaCode){
		ArrayList<Station> result = null;
		try {			
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_stationForecast where AreaCode like '%s%%'", areaCode);
			ResultSet resultSet = stmt.executeQuery(sql);
			result = new ArrayList<Station>();
			while(resultSet.next()) {
				result.add(new Station(resultSet.getString("StationNum"), resultSet.getString("StationName"), 
						resultSet.getDouble("Latitude"), resultSet.getDouble("Longitude"), resultSet.getDouble("Height"), 
						resultSet.getInt("ZoomLevel"), resultSet.getInt("Type"), resultSet.getString("AreaCode")));
			}
			stmt.close();
			conn.close();
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 获取航线
	 * @return
	 */
	@POST
	@Path("getSeaLanes")
	@Produces("application/json")
	public Object getSeaLanes(@FormParam("para") String para) {
		String result = null;
		try {
			String strAlias = "dsSeaLanes";
			Datasource ds = Application.m_workspace.GetDatasource(strAlias);
			if(ds == null)
			{
				String classPath = Thread.currentThread().getContextClassLoader().getResource("").getPath();
				classPath=classPath.substring(1);
				String strJson = String.format("{\"Type\":\"ESRI Shapefile\",\"Alias\":\"%s\",\"Server\":\"%s\"}", strAlias, classPath + "../data/SeaLanes.shp");
				ds = Application.m_workspace.OpenDatasource(strJson);
			}
			if(ds != null){
				DatasetVector dtv = (DatasetVector)ds.GetDataset(0);
				result = Toolkit.convertDatasetVectorToJson(dtv, "LINE");
			}
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 格点转站点
	 * @return
	 */
	@POST
	@Path("grid2station")
	@Produces("application/json")
	public Object grid2station(@FormParam("para") String para) {
		ForecastData result = null;
		try {
			JSONObject jsonObject = new JSONObject(para);
			
			String departCode = CommonTool.getJSONStr(jsonObject, "departCode");
			Integer stationType = CommonTool.getJSONInt(jsonObject, "stationType");
			Integer productId = CommonTool.getJSONInt(jsonObject, "productId");
			Date makeTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String version = CommonTool.getJSONStr(jsonObject, "postType"); //一定是发布版
			
			//根据制作时间获取预报时间
			String strMakeTime = new SimpleDateFormat("HH:mm").format(makeTime);
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", type, strMakeTime);
			ResultSet resultSet = stmt.executeQuery(sql);
			int forecastHour = -1;
			while(resultSet.next()) {
				forecastHour = resultSet.getInt("forecastHour");
				break;
			}
			stmt.close();
			conn.close();
			Date forecastTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
			forecastTime.setHours(forecastHour);
						
			//将要素、时效转换为ElementDefine数组
			ArrayList<ElementDefine> elements = new ArrayList<ElementDefine>();
			JSONArray jsonArray = jsonObject.getJSONArray("elements");
			int nSize = jsonArray.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObjectElement = jsonArray.getJSONObject(i);
				String strName = CommonTool.getJSONStr(jsonObjectElement, "name");
				String strElement = CommonTool.getJSONStr(jsonObjectElement, "element");
				Integer hourSpan = CommonTool.getJSONInt(jsonObjectElement, "hourSpan");
				String strStatistic = CommonTool.getJSONStr(jsonObjectElement, "statistic");
				String strHourSpans = CommonTool.getJSONStr(jsonObjectElement, "hourSpans");
				strHourSpans = strHourSpans.substring(1, strHourSpans.length() - 1);
				String[] arrayHourSpans = strHourSpans.split(",");
				ArrayList<Integer> nHourSpans = new ArrayList<Integer>(); 
				for(String strHourSpan : arrayHourSpans)
				{
					nHourSpans.add(Integer.valueOf(strHourSpan));
				}
				ElementDefine element = new ElementDefine(strName, strElement, hourSpan, strStatistic, nHourSpans);
				elements.add(element);
			}
			
			HashMap paramMap = new HashMap();
			paramMap.put("id", productId);
			paramMap.put("type", stationType);
			paramMap.put("departCode", departCode+"%");
			IForecastfineService forecastfineService = (IForecastfineService)ContextLoader.getCurrentWebApplicationContext().getBean("ForecastfineService");
			Object stations = forecastfineService.getUserStationNew(paramMap);
			
			result = GridUtil.grid2station(type, makeTime, version, forecastTime, elements, stations);
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 格点转任意点
	 * @return
	 */
	@POST
	@Path("grid2points")
	@Produces("application/json")
	public Object grid2points(@FormParam("para") String para) {
		ForecastData result = null;
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String type = CommonTool.getJSONStr(jsonObject, "type");
			String version = CommonTool.getJSONStr(jsonObject, "version");
			Date makeTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
			JSONArray jsonArrayElement = jsonObject.getJSONArray("elements");
			JSONArray jsonArrayPoint = jsonObject.getJSONArray("points");
			
			Date forecastTime = new Date(makeTime.getTime());
			
			//根据制作时间查询起报时间			
			if(type.equals("prvn") || type.equals("cty") || type.equals("county")){
				String strMakeTime = new SimpleDateFormat("HH:mm").format(makeTime);
				Class.forName("com.mysql.jdbc.Driver");
				Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
						dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
				Statement  stmt = conn.createStatement();
				String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", type, strMakeTime);
				ResultSet resultSet = stmt.executeQuery(sql);
				int forecastHour = -1;
				while(resultSet.next()) {
					
					forecastHour = resultSet.getInt("forecastHour");
					break;
				}
				stmt.close();
				conn.close();
				forecastTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
				forecastTime.setHours(forecastHour);	
			}			
						
			//将要素、时效转换为ElementDefine数组
			ArrayList<ElementDefine> elements = new ArrayList<ElementDefine>();			
			int nSize = jsonArrayElement.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObjectElement = jsonArrayElement.getJSONObject(i);
				String strName = CommonTool.getJSONStr(jsonObjectElement, "name");
				String strElement = CommonTool.getJSONStr(jsonObjectElement, "element");
				String strHourSpans = CommonTool.getJSONStr(jsonObjectElement, "hourSpans");
				strHourSpans = strHourSpans.substring(1, strHourSpans.length() - 1);
				String[] arrayHourSpans = strHourSpans.split(",");
				ArrayList<Integer> nHourSpans = new ArrayList<Integer>(); 
				for(String strHourSpan : arrayHourSpans)
				{
					nHourSpans.add(Integer.valueOf(strHourSpan));
				}
				ElementDefine element = new ElementDefine(strName, strElement, nHourSpans);
				elements.add(element);
			}
			
			//将任意点转换"站点"形式
			ArrayList<Map> stations = new ArrayList<Map>();
			nSize = jsonArrayPoint.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObjectPoint = jsonArrayPoint.getJSONObject(i);
				Double x = CommonTool.getJSONDouble(jsonObjectPoint, "x");
				Double y = CommonTool.getJSONDouble(jsonObjectPoint, "y");
				Map station = new HashMap<String, Object>();
				station.put("StationNum", String.valueOf(i));
				station.put("Longitude", x);
				station.put("Latitude", y);
				stations.add(station);
			}			
			
			result = GridUtil.grid2station(type, makeTime, version, forecastTime, elements, stations);			
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 格点转任意点
	 * @return
	 */
	@POST
	@Path("grid2pointsNew")
	@Produces("application/json")
	public Object grid2pointsNew(@FormParam("para") String para) {
		ForecastData result = null;
		try {
			String elements = "{elements:[{\"name\":\"2t\",\"element\":\"2t\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"},{\"name\":\"r3\",\"element\":\"r3\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"},{\"name\":\"wd3\",\"element\":\"10uv\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"},{\"name\":\"ws3\",\"element\":\"10uv\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"},{\"name\":\"wmax\",\"element\":\"wmax\",\"hourSpans\":\"[24,48,72,96,120,144,168,192,216,240]\"},{\"name\":\"tmax\",\"element\":\"tmax\",\"hourSpans\":\"[24,48,72,96,120,144,168,192,216,240]\"},{\"name\":\"tmin\",\"element\":\"tmin\",\"hourSpans\":\"[24,48,72,96,120,144,168,192,216,240]\"},{\"name\":\"w\",\"element\":\"w\",\"hourSpans\":\"[12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240]\"},{\"name\":\"r12\",\"element\":\"r12\",\"hourSpans\":\"[12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192,204,216,228,240]\"},{\"name\":\"rh\",\"element\":\"rh\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"},{\"name\":\"tcc\",\"element\":\"tcc\",\"hourSpans\":\"[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240]\"}]}";
			JSONObject jsonObjectEle = new JSONObject(elements);
			JSONObject jsonObject = new JSONObject(para);
			String type = "prvn";
			String version = "p";
			Date makeTime = new Date();
			makeTime.setMinutes(0);
			if(makeTime.getHours() >=6 && makeTime.getHours()<16 || makeTime.getHours()==16 && makeTime.getMinutes()<30){
				makeTime.setHours(5);
			}
			else {
				if(makeTime.getHours() <6){
					makeTime.setDate(makeTime.getDate() - 1);
				}
				makeTime.setHours(16);
			}
			JSONArray jsonArrayElement = jsonObjectEle.getJSONArray("elements");
			JSONArray jsonArrayPoint = jsonObject.getJSONArray("points");
			
			//根据制作时间查询起报时间
			String strMakeTime = new SimpleDateFormat("HH:mm").format(makeTime);
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", type, strMakeTime);
			ResultSet resultSet = stmt.executeQuery(sql);
			int forecastHour = -1;
			while(resultSet.next()) {
				
				forecastHour = resultSet.getInt("forecastHour");
				break;
			}
			stmt.close();
			conn.close();
			Date forecastTime = new Date();
			forecastTime.setTime(makeTime.getTime());
			forecastTime.setHours(forecastHour);
						
			//将要素、时效转换为ElementDefine数组
			ArrayList<ElementDefine> elements1 = new ArrayList<ElementDefine>();			
			int nSize = jsonArrayElement.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObjectElement = jsonArrayElement.getJSONObject(i);
				String strName = CommonTool.getJSONStr(jsonObjectElement, "name");
				String strElement = CommonTool.getJSONStr(jsonObjectElement, "element");
				String strHourSpans = CommonTool.getJSONStr(jsonObjectElement, "hourSpans");
				strHourSpans = strHourSpans.substring(1, strHourSpans.length() - 1);
				String[] arrayHourSpans = strHourSpans.split(",");
				ArrayList<Integer> nHourSpans = new ArrayList<Integer>(); 
				for(String strHourSpan : arrayHourSpans)
				{
					nHourSpans.add(Integer.valueOf(strHourSpan));
				}
				ElementDefine element = new ElementDefine(strName, strElement, nHourSpans);
				elements1.add(element);
			}
			
			//将任意点转换"站点"形式
			ArrayList<Map> stations = new ArrayList<Map>();
			nSize = jsonArrayPoint.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObjectPoint = jsonArrayPoint.getJSONObject(i);
				Double x = CommonTool.getJSONDouble(jsonObjectPoint, "x");
				Double y = CommonTool.getJSONDouble(jsonObjectPoint, "y");
				Map station = new HashMap<String, Object>();
				station.put("StationNum", String.valueOf(i));
				station.put("Longitude", x);
				station.put("Latitude", y);
				stations.add(station);
			}			
			
			result = GridUtil.grid2station(type, makeTime, version, forecastTime, elements1, stations);			
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	
	/**
	 * 获取格点报（micaps）文件
	 * @return
	 */
	@POST
	@Path("getGridFiles")
	@Produces("application/json")
	public Object getGridFiles(@FormParam("para") String para) {
		ArrayList<FileInfo> fileInfos = new ArrayList<FileInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String strMakeTime = CommonTool.getJSONStr(jsonObject, "makeTime");
			Date makeTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime);
			strMakeTime = new SimpleDateFormat("yyyyMMddHHmmss").format(makeTime);
			String stationCodeString = "BANN";
			
			//根据制作时间查询起报时间
			String strMakeTimeHHmm = new SimpleDateFormat("HH:mm").format(makeTime);
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", "cty", strMakeTimeHHmm);
			ResultSet resultSet = stmt.executeQuery(sql);			
			int forecastHour = -1;
			while(resultSet.next()) {
				forecastHour = resultSet.getInt("forecastHour");
				break;
			}
			stmt.close();
			conn.close();
			Date forecastTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
			forecastTime.setHours(forecastHour);
			String strForecastTime = new SimpleDateFormat("yyyyMMddHHmm").format(forecastTime);
			
			//根据输出配置，获取文件信息
			ArrayList<OutputSetting> outputSettingsAll = getOutputSetting();
			for(OutputSetting outputsetting : outputSettingsAll)
			{
				Integer hourSpan = outputsetting.hourSpan;
				Integer hourSpanTotal = outputsetting.hourSpanTotal;
				
				File[] files = null;
				File folder = new File(outputsetting.outputPath);
				if(!folder.exists()){
					continue;
				}
				else
				{
					String filter = "Z_NWGD_C_.*?_makeTime.*?";
					filter = filter.replaceAll("makeTime", strMakeTime);
					File dataFile = new File(outputsetting.outputPath);
					files = dataFile.listFiles(new BaoWenFileFilter(filter));
				}
				
				String filenamewithoutextension = String.format("Z_NWGD_C_%s_%s_P_RFFC_SPCC-%s_%s_%s%s", stationCodeString, strMakeTime, outputsetting.elementOut, strForecastTime, new DecimalFormat("000").format(outputsetting.hourSpanTotal), new DecimalFormat("00").format(hourSpan));
				for(int h = hourSpan; h<=hourSpanTotal; h+=hourSpan){
					String filename = String.format("%s.%03d", filenamewithoutextension, h);
					Integer status = 0;
					Integer size = 0;
					String tag = outputsetting.elementCaption;
					if(files != null && files.length > 0)
					{
						for(File file : files){
							if(file.getName().equals(filename)){
								status = 1;
								size = (int)file.length(); //B
								break;
							}
						}
					}
					fileInfos.add(new FileInfo(filename, size, status, tag, outputsetting.outputPath));
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return fileInfos;
	}
	
	/**
	 * 获取格点报（grib2）文件
	 * @return
	 */
	@POST
	@Path("getGrib2Files")
	@Produces("application/json")
	public Object getGrib2Files(@FormParam("para") String para) {
		ArrayList<FileInfo> fileInfos = new ArrayList<FileInfo>();
		try {			
			JSONObject jsonObject = new JSONObject(para);
			String strMakeTime = CommonTool.getJSONStr(jsonObject, "makeTime");
			Date makeTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(strMakeTime);
			strMakeTime = new SimpleDateFormat("yyyyMMddHHmmss").format(makeTime);
			
			//根据制作时间查询起报时间
			String strMakeTimeHHmm = new SimpleDateFormat("HH:mm").format(makeTime);
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", 
					dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(), dataBaseConnectionConfigInfo.getPassword());
			Statement  stmt = conn.createStatement();
			String sql = String.format("select * from t_griddefaultscheme where type='%s' and makeTime='%s'", "cty", strMakeTimeHHmm);
			ResultSet resultSet = stmt.executeQuery(sql);			
			int forecastHour = -1;
			while(resultSet.next()) {
				forecastHour = resultSet.getInt("forecastHour");
				break;
			}
			stmt.close();
			conn.close();
			Date forecastTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(jsonObject, "makeTime"));
			forecastTime.setHours(forecastHour);
			String strForecastTime = new SimpleDateFormat("yyyyMMddHHmm").format(forecastTime);
			
			//根据输出配置，获取文件信息
			ArrayList<OutputSetting> outputSettingsAll = getOutputSetting();
			for(OutputSetting outputsetting : outputSettingsAll)
			{
				if(outputsetting.outputGrib2 == 0)
					continue;
				String stationCode = outputsetting.stationCode;
				Integer hourSpan = outputsetting.hourSpan;
				Integer hourSpanTotalGrib2 = outputsetting.hourSpanTotalGrib2;
				
				File[] files = null;
				File folder = new File(outputsetting.grib2Path);
				if(folder.exists()){
					String filter = "Z_NWGD_C_.*?-" + outputsetting.elementOut + "_forecastTime.*?.GRB2";
					filter = filter.replaceAll("forecastTime", strForecastTime);
					File dataFile = new File(outputsetting.grib2Path);
					files = dataFile.listFiles(new BaoWenFileFilter(filter));
				}
				else
				{
					//continue;
				}
				
				if(files == null || files.length == 0){
					String filename = String.format("Z_NWGD_C_%s_%s_P_RFFC_SPCC-%s_%s_%s%s.GRB2", stationCode, strMakeTime, outputsetting.elementOut, strForecastTime, new DecimalFormat("000").format(hourSpanTotalGrib2), new DecimalFormat("00").format(hourSpan));
					Integer status = 0;
					Integer size = 0;
					String tag = outputsetting.elementCaption;
					fileInfos.add(new FileInfo(filename, size, status, tag, outputsetting.grib2Path));
				}
				else{
					for(File file : files){
						String filename = file.getName();
						Boolean exist = FTPService.exist(commonfig.getFtpIp(), 21, commonfig.getFtpUser(), commonfig.getFtpPassword(), commonfig.getFtpDir(), filename.substring(filename.lastIndexOf("/")+1));
						Integer status = exist?3:1; //3：已上传FTP，1：文件已生成
						Integer size = (int)file.length(); //B
						String tag = outputsetting.elementCaption;
						fileInfos.add(new FileInfo(filename, size, status, tag, outputsetting.grib2Path));
					}	
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return fileInfos;
	}
	

	/**
	 * 站点转格点
	 * @return
	 */
	@POST
	@Path("station2grid")
	@Produces("application/json")
	public Object station2grid(@FormParam("para") String para) {
		Boolean result = null;
		try {
			JSONObject json = new JSONObject(para);
			Date makeTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(CommonTool.getJSONStr(json, "makeTime"));
			String type = CommonTool.getJSONStr(json, "type");
			String version = "p"; //一定是发布版
			JSONArray jsonArray = json.getJSONArray("items");  
			int nSize = jsonArray.length();
			for (int i = 0; i < nSize; i++) {  
				JSONObject jsonObject = jsonArray.getJSONObject(i);			
				String element = CommonTool.getJSONStr(jsonObject, "element");
				String gdybElement = CommonTool.getJSONStr(jsonObject, "gdybElement");
				Integer hour = CommonTool.getJSONInt(jsonObject, "hour");
				Integer hourSpan = CommonTool.getJSONInt(jsonObject, "hourSpan");
				String statistic  = CommonTool.getJSONStr(jsonObject, "statistic");
				
				Map<String, Double> stationValues = new HashMap<String, Double>();
				JSONArray jsonArrayStationNums = jsonObject.getJSONArray("stationNums");
				JSONArray jsonArrayDatas = jsonObject.getJSONArray("datas");
				int nSizeStation = jsonArrayStationNums.length();
				for (int j = 0; j < nSizeStation; j++) {  
					stationValues.put(jsonArrayStationNums.getString(j), Double.valueOf(jsonArrayDatas.getString(j)));
				}
				
				//订正本要素
				
				//要素间交叉订正
				
			}
		}
		catch(Exception e){
			e.printStackTrace();
			}
		return result;
	}
	/**
	 * 保存格点
	 * @return
	 */
	@POST
	@Path("getRecentGridInfo")
	@Produces("application/json")
	public Object getRecentGridInfo(@FormParam("para") String para) {
		ArrayList<String> result=new ArrayList<String>();
		Connection conn = null;
		Statement  stmt = null;
		try {
			conn = DriverManager.getConnection(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(),
					dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()), dataBaseConnectionConfigInfo.getUser(),
					dataBaseConnectionConfigInfo.getPassword());
			stmt = conn.createStatement(); 
			
			JSONObject jsonObject = new JSONObject(para);
			String departCode = CommonTool.getJSONStr(jsonObject, "areaCode");
			String element = CommonTool.getJSONStr(jsonObject, "element");
			String strHourSpan = CommonTool.getJSONStr(jsonObject, "hourspan");
			String sql = String.format("select tabelName from t_gridproduct where departCode='%s' and element='%s' limit 0,10", departCode, element);
			ResultSet resultSet = stmt.executeQuery(sql);
			while(resultSet.next()) {
				result.add(resultSet.getString(1));
			}
		}
		catch(Exception ex){
			log.error("获取最近几个格点失败!");
		}
		return result;
	}

}
