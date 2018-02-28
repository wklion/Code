package com.spd.flashflood.model;
/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-10-18
 * @最后修改: 2017-10-18
 * @功能: 山洪类
 **/
public class FlashFloodAlert {
	public int getProductID() {
		return productID;
	}
	public void setProductID(int productID) {
		this.productID = productID;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getGeoID() {
		return geoID;
	}
	public void setGeoID(String geoID) {
		this.geoID = geoID;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getHourspan() {
		return hourspan;
	}
	public void setHourspan(int hourspan) {
		this.hourspan = hourspan;
	}
	public String getDatetime() {
		return datetime;
	}
	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}
	public int getStrategy() {
		return strategy;
	}
	public void setStrategy(int strategy) {
		this.strategy = strategy;
	}
	public double getRain() {
		return rain;
	}
	public void setRain(double rain) {
		this.rain = rain;
	}
	public double[] getRains() {
		return rains;
	}
	public void setRains(double[] rains) {
		this.rains = rains;
	}
	private int productID;
	private String type;
	private String geoID;
	private int level;
	private int hourspan;
	private String datetime;
	private int strategy;
	private double rain;
	private double[] rains;
}
