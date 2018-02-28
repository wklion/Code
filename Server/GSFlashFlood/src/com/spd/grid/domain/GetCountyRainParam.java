package com.spd.grid.domain;

public class GetCountyRainParam {
	private int strategy;
	private int hourSpan;
	private String datetime;
	public int getStrategy() {
		return strategy;
	}
	public void setStrategy(int strategy) {
		this.strategy = strategy;
	}
	public int getHourSpan() {
		return hourSpan;
	}
	public void setHourSpan(int hourSpan) {
		this.hourSpan = hourSpan;
	}
	public String getDatetime() {
		return datetime;
	}
	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}
}
