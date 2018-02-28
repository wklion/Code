package com.spd.grid.domain;

import java.util.List;

public class MakeDatagramParam {
	private String datetime;
	private String type;
	private int hourspan;
	private int strategy;
	public int getStrategy() {
		return strategy;
	}
	public void setStrategy(int strategy) {
		this.strategy = strategy;
	}
	private String fileName;
	private String dic;
	private List<DatagramData> lsDatagramData;
	public int getHourspan() {
		return hourspan;
	}
	public void setHourspan(int hourspan) {
		this.hourspan = hourspan;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getDic() {
		return dic;
	}
	public void setDic(String dic) {
		this.dic = dic;
	}
	public String getDatetime() {
		return datetime;
	}
	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<DatagramData> getLsDatagramData() {
		return lsDatagramData;
	}
	public void setLsDatagramData(List<DatagramData> lsDatagramData) {
		this.lsDatagramData = lsDatagramData;
	}
}
