package com.spd.grid.domain;

public class FlashFloodAlertResult {
	private String id;
	private int productid;
	private int level;
	private int hourspan;
	private String datetime;
	public String getDatetime() {
		return datetime;
	}
	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}
	private double rain;
	public double getRain() {
		return rain;
	}
	public void setRain(double rain) {
		this.rain = rain;
	}
	public int getHourspan() {
		return hourspan;
	}
	public void setHourspan(int hourspan) {
		this.hourspan = hourspan;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public int getProductid() {
		return productid;
	}
	public void setProductid(int productid) {
		this.productid = productid;
	}
}
