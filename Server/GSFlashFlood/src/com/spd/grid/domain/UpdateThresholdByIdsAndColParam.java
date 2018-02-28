package com.spd.grid.domain;

public class UpdateThresholdByIdsAndColParam {
	private String[] ids;
	private String type;
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	private String colName;
	private double value;
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
	public String[] getIds() {
		return ids;
	}
	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		this.colName = colName;
	}
	public void setIds(String[] ids) {
		this.ids = ids;
	}
}
