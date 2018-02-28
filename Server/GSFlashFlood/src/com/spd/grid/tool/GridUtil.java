package com.spd.grid.tool;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import com.mg.objects.Dataset;
import com.mg.objects.DatasetRaster;
import com.spd.grid.domain.ForecastData;
import com.spd.grid.domain.ElementDefine;
import com.spd.grid.domain.ForecastDataItem;
import com.spd.grid.ws.GridService;

public class GridUtil {	
	
	/*
	 * 格点预报转站点预报
	 * */
	public static ForecastData grid2station(String type, Date makeTime,String version, Date forecastTime, ArrayList<ElementDefine> elements, Object stations)
	{
		ForecastData result = new ForecastData();
		try {
			ArrayList<ForecastDataItem> items = new ArrayList<ForecastDataItem>();
			
			GridService gridService = new GridService();
			ArrayList<Map> listStation = (ArrayList<Map>)stations;
			for(ElementDefine elementDefine : elements)
			{				
				String element = elementDefine.getName();
				String elementGrid = elementDefine.getElement();
				
				if(element.equals("") || elementGrid.equals("")){
					System.out.println("未知要素："+elementGrid);
					continue;
				}
				
				ArrayList<Integer> hourSpans = elementDefine.getHourSpans();							
				for(Integer hourSpan : hourSpans){					
					try
					{					
						if(elementGrid.equals("wmax") || elementGrid.equals("10uv"))
						{
							if(elementDefine.getStatisticCode() <= 0) //不统计
							{
								String strDatasetName = gridService.getGridDatasetName(type, "1000", elementGrid, makeTime, version, forecastTime, hourSpan);
								String strDatasetNameU = strDatasetName+"_u";
								String strDatasetNameV = strDatasetName+"_v";
								Dataset dtU = gridService.getDataset(strDatasetNameU, false);
								Dataset dtV = gridService.getDataset(strDatasetNameV, false);
								if(dtU == null || dtV == null)
								{
									System.out.println("数据集不存在，详情【" + strDatasetName + "】");
									continue;
								}	
								else
								{
									ArrayList<Double> wsValues = new ArrayList<Double>();
									ArrayList<Double> wdValues = new ArrayList<Double>();
									DatasetRaster dgU  = (DatasetRaster)dtU;
									dgU.CalcExtreme();
									DatasetRaster dgV  = (DatasetRaster)dtV;
									dgV.CalcExtreme();
									Boolean bNum = (element.indexOf("Num")>0); //如果包含Num，则认为是数值（例如风速将返回m/s），而非级别
									for(int i = 0; i < listStation.size(); i++) {
										Map map = listStation.get(i);
										String stationNum = map.get("StationNum").toString();
										Double longitude = Double.valueOf( map.get("Longitude").toString());
										Double latitude = Double.valueOf( map.get("Latitude").toString());
										Point2D pt = new Point2D.Double(longitude, latitude);
										Point2D cell = dgU.PointToCell(pt);
										int col = (int)cell.getX();
										int row = (int)cell.getY();
										Double u = dgU.GetValue(col, row);
										Double v = dgV.GetValue(col, row);
										Double ws = Math.sqrt(u*u + v*v);
										Double wd = 270.0-Math.atan2(v, u)*180.0/Math.PI;
										if(u == 0.0 && v == 0.0){
											ws = 0.0;
											wd = 0.0;
										}
										wd%=360;
										if(wd<0)
											wd+=360;
										
										if(bNum){
											wsValues.add(ws);
											wdValues.add(wd);
										}
										else{
											Double wsCode = getWSCode(ws);
											Double wdCode = getWDCode(wd);									
											wsValues.add(wsCode);
											wdValues.add(wdCode);
										}
									}
									
									if(element.startsWith("ws"))
										items.add(new ForecastDataItem(element, hourSpan, wsValues));
									else if(element.startsWith("wd"))
										items.add(new ForecastDataItem(element, hourSpan, wdValues));
								}	
							}
							else //统计 
							{
								ArrayList<Double> values = new ArrayList<Double>();
								ArrayList<Double> wsValues = new ArrayList<Double>();
								ArrayList<Double> wdValues = new ArrayList<Double>();
								Integer hourSpanStart = hourSpan - elementDefine.getHourSpan(); //统计时效区间为(hourSpanStart, hourSpan]								
								for(int h=hourSpanStart+1; h<=hourSpan; h++) //逐小时遍历数据并进行统计
								{
									String strDatasetName = gridService.getGridDatasetName(type, "1000", elementGrid, makeTime, version, forecastTime, h);
									String strDatasetNameU = strDatasetName+"_u";
									String strDatasetNameV = strDatasetName+"_v";
									Dataset dtU = gridService.getDataset(strDatasetNameU, false);
									Dataset dtV = gridService.getDataset(strDatasetNameV, false);
									if(dtU == null || dtU == null){
										continue;
									}	
									else
									{										
										DatasetRaster dgU = (DatasetRaster)dtU;										
										DatasetRaster dgV = (DatasetRaster)dtV;
										dgU.CalcExtreme();
										dgV.CalcExtreme();
										Boolean isFirst = values.size()==0;
										for(int i = 0; i < listStation.size(); i++) {
											Map map = listStation.get(i);
											Double longitude = Double.valueOf( map.get("Longitude").toString());
											Double latitude = Double.valueOf( map.get("Latitude").toString());
											Point2D pt = new Point2D.Double(longitude, latitude);
											Point2D cell = dgU.PointToCell(pt);
											double u = dgU.GetValue((int)cell.getX(), (int)cell.getY());
											double v = dgV.GetValue((int)cell.getX(), (int)cell.getY());
											Double ws = Math.sqrt(u*u + v*v);
											Double wd = 270.0-Math.atan2(v, u)*180.0/Math.PI;
											if(u == 0.0 && v == 0.0){
												ws = 0.0;
												wd = 0.0;
											}
											wd%=360;
											if(wd<0)
												wd+=360;
											
											Double wsCode = getWSCode(ws);
											Double wdCode = getWDCode(wd);
											
											if(isFirst){
												values.add(ws);
												wsValues.add(wsCode);
												wdValues.add(wdCode);
											}												
											else{
												if(elementDefine.getStatisticCode() == 2){
													if(ws < values.get(i)){
														values.set(i, ws);
														wsValues.set(i, wsCode);
														wdValues.set(i, wdCode);	
													}														
												}
												else if(elementDefine.getStatisticCode() == 3){
													if(ws > values.get(i)){
														values.set(i, ws);
														wsValues.set(i, wsCode);
														wdValues.set(i, wdCode);
													}
												}
											}
										}																
									}	
								}
								if(values.size() != 0) //有数据才返回
								{
									if(element.startsWith("ws"))
										items.add(new ForecastDataItem(element, hourSpan, wsValues));
									else if(element.startsWith("wd"))
										items.add(new ForecastDataItem(element, hourSpan, wdValues));
								}
							}
						}
						else
						{			
							if(elementDefine.getStatisticCode() <= 0) //不统计
							{
								String strDatasetName = gridService.getGridDatasetName(type, "1000", elementGrid, makeTime, version, forecastTime, hourSpan);
								Dataset dt = gridService.getDataset(strDatasetName, false);
								if(dt == null)
								{
									System.out.println("数据集不存在，详情【" + strDatasetName + "】");
									continue;
								}	
								else
								{								
									ArrayList<Double> values = new ArrayList<Double>();
									DatasetRaster dg = (DatasetRaster)dt;
									for(int i = 0; i < listStation.size(); i++) {
										Map map = listStation.get(i);
										Double longitude = Double.valueOf( map.get("Longitude").toString());
										Double latitude = Double.valueOf( map.get("Latitude").toString());
										Point2D pt = new Point2D.Double(longitude, latitude);
										Point2D cell = dg.PointToCell(pt);
										double dValue = dg.GetValue((int)cell.getX(), (int)cell.getY());
										values.add(Math.round(dValue*10.0)/10.0);									
									}
									items.add(new ForecastDataItem(element, hourSpan, values));								
								}							
							}
							else //统计
							{
								ArrayList<Double> values = new ArrayList<Double>();
								Integer hourSpanStart = hourSpan - elementDefine.getHourSpan(); //统计时效区间为(hourSpanStart, hourSpan]
								for(int h=hourSpanStart+1; h<=hourSpan; h++) //逐小时遍历数据并进行统计
								{
									String strDatasetName = gridService.getGridDatasetName(type, "1000", elementGrid, makeTime, version, forecastTime, h);
									Dataset dt = gridService.getDataset(strDatasetName, false);
									if(dt == null){
										continue;
									}	
									else
									{
										DatasetRaster dg = (DatasetRaster)dt;
										Boolean isFirst = values.size()==0;
										for(int i = 0; i < listStation.size(); i++) {
											Map map = listStation.get(i);
											Double longitude = Double.valueOf( map.get("Longitude").toString());
											Double latitude = Double.valueOf( map.get("Latitude").toString());
											Point2D pt = new Point2D.Double(longitude, latitude);
											Point2D cell = dg.PointToCell(pt);
											double dValue = dg.GetValue((int)cell.getX(), (int)cell.getY());
											dValue = Math.round(dValue*10.0)/10.0;
											if(isFirst)
												values.add(dValue);
											else{
												if(elementDefine.getStatisticCode() == 1){
													values.set(i, values.get(i)+dValue);
												}
												else if(elementDefine.getStatisticCode() == 2){
													if(dValue < values.get(i))
														values.set(i, dValue);
												}
												else if(elementDefine.getStatisticCode() == 3){
													if(dValue > values.get(i))
														values.set(i, dValue);
												}
											}
										}																
									}	
								}
								if(values.size() != 0) //有数据才返回
									items.add(new ForecastDataItem(element, hourSpan, values));	
							}
						}	
					}
					catch(Exception ex){
						System.out.println("时效："+ hourSpan +"小时，获取格点数据失败，详情【" + ex.getMessage() + "】");
					}					
				}
			}
			
			ArrayList<String> stationNums = new ArrayList<String>();
			for(int i = 0; i < listStation.size(); i++) {
				Map map = listStation.get(i);
				stationNums.add(map.get("StationNum").toString());
			}
			result.setStationNums(stationNums);
			result.setItems(items);
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		return result;
	}
	
	/*
	 * 站点转格点
	 * */
	public Boolean station2grid(String type, Date makeTime,String version, Date forecastTime,Integer hour,String elementGrid,Integer hourSpan, String statistic, Map<String, Double> stationValues) {
		Boolean result = false;		
		GridService gridService = new GridService();
		if(elementGrid.equals("wmax") || elementGrid.equals("10uv"))
		{
			String strDatasetName = gridService.getGridDatasetName(type, "1000", elementGrid, makeTime, version, forecastTime, hour);
			String strDatasetNameU = strDatasetName+"_u";
			String strDatasetNameV = strDatasetName+"_v";
			Dataset dtU = gridService.getDataset(strDatasetNameU, false);
			Dataset dtV = gridService.getDataset(strDatasetNameV, false);
			if(dtU == null || dtV == null)
			{
				System.out.println("数据集不存在，详情【" + strDatasetName + "】");
				return result;
			}	
			else
			{
				
			}
		}
		else
		{
			
		}
		return result;
	}
	
	//风向转编码
	public static double getWDCode(double wd) {
		Double wdCode = 9.0;
		if(wd<0)
			wdCode = 9.0;
		else if(wd>337.5 || wd<=22.5)
			wdCode = 8.0;
		else if(wd>292.5 && wd<=337.5)
			wdCode = 7.0;
		else if(wd>247.5 && wd<=292.5)
			wdCode = 6.0;
		else if(wd>202.5 && wd<=247.5)
			wdCode = 5.0;
		else if(wd>157.5 && wd<=202.5)
			wdCode = 4.0;
		else if(wd>112.5 && wd<=157.5)
			wdCode = 3.0;
		else if(wd>67.5 && wd<=157.5)
			wdCode = 2.0;
		else if(wd>22.5 && wd<=67.5)
			wdCode = 1.0;
		return wdCode;
	}
	
	//风速转编码
	public static double getWSCode(double ws) {
		Double wsCode = 0.0;
		if(ws<=3.3)
			wsCode = 0.0;
		else if(ws<=7.9)
			wsCode = 1.0;
		else if(ws<=10.7)
			wsCode = 2.0;
		else if(ws<=13.8)
			wsCode = 3.0;
		else if(ws<=17.1)
			wsCode = 4.0;
		else if(ws<=20.7)
			wsCode = 5.0;
		else if(ws<=24.4)
			wsCode = 6.0;
		else if(ws<=28.4)
			wsCode = 7.0;
		else if(ws<=32.6)
			wsCode = 8.0;
		else if(ws<=36.9)
			wsCode = 9.0;
		return wsCode;
	}
}