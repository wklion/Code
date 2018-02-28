package com.spd.model;

import java.util.List;

/**
 * @作者:wangkun
 * @日期:2017年12月18日
 * @公司:spd
 * @说明:
*/
public class ImgTask {
	private String name;
	private Boolean isUTC;
	private String timeFormat;
	private String sourceDir;
	private String type;
	private String outputFile;
	private int tolerant;
	private String datePattern;
	private Boolean isEnable;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getIsUTC() {
		return isUTC;
	}

	public void setIsUTC(Boolean isUTC) {
		this.isUTC = isUTC;
	}

	public String getTimeFormat() {
		return timeFormat;
	}

	public void setTimeFormat(String timeFormat) {
		this.timeFormat = timeFormat;
	}

	public String getSourceDir() {
		return sourceDir;
	}

	public void setSourceDir(String sourceDir) {
		this.sourceDir = sourceDir;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	

	public String getOutputFile() {
		return outputFile;
	}

	public void setOutputFile(String outputFile) {
		this.outputFile = outputFile;
	}

	public int getTolerant() {
		return tolerant;
	}

	public void setTolerant(int tolerant) {
		this.tolerant = tolerant;
	}

	public String getDatePattern() {
		return datePattern;
	}

	public void setDatePattern(String datePattern) {
		this.datePattern = datePattern;
	}

	public Boolean getIsEnable() {
		return isEnable;
	}

	public void setIsEnable(Boolean isEnable) {
		this.isEnable = isEnable;
	}
	
}
