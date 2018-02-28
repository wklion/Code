package com.spd.grid.domain;

/*
 * 文件信息，add by dinlerkey, 2017-10-25
 * */
public class LeadFile {
	private String l_filename;	//文件名
	private String l_leadTime;	//创建时间
	
	
	public LeadFile(String filename, String leadTime) {
		this.l_filename = filename;
		this.l_leadTime = leadTime;
	}
	
	public String getL_filename() {
		return l_filename;
	}
	public void setL_Filename(String filename) {
		this.l_filename = filename;
	}
	public String getL_leadTime() {
		return l_leadTime;
	}
	public void setL_leadTime(String leadTime) {
		this.l_leadTime = leadTime;
	}
}
