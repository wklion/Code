package com.spd.grid.pojo;

public class CommonConfig {

	private String ForecastPath;
	private String nowcastPath;
	private String dl;
	private String ftpIp;
	private String ftpUser;
	private String ftpPassword;
	private String ftpDir;
	private String ds;
	private String kglj;
	private String kgds;
	public String getKglj() {
		return kglj;
	}
	public void setKglj(String kglj) {
		this.kglj = kglj;
	}
	public String getKgds() {
		return kgds;
	}
	public void setKgds(String kgds) {
		this.kgds = kgds;
	}
	public String getDl() {
		return dl;
	}
	public void setDl(String dl) {
		this.dl = dl;
	}

	public String getDs() {
		return ds;
	}

	public void setDs(String ds) {
		this.ds = ds;
	}
	public void setForecastPath(String forecastPath) {
		ForecastPath = forecastPath;
	}

	public String getForecastPath() {
		return ForecastPath;
	}

	public void setNowcastPath(String nowcastPath) {
		this.nowcastPath = nowcastPath;
	}

	public String getNowcastPath() {
		return nowcastPath;
	}
	
	public void setFtpIp(String ftpIp){
		this.ftpIp = ftpIp;
	}	
	public String getFtpIp(){
		return ftpIp;
	}
	
	public void setFtpUser(String ftpUser){
		this.ftpUser = ftpUser;
	}	
	public String getFtpUser(){
		return ftpUser;
	}
	
	public void setFtpPassword(String ftpPassword){
		this.ftpPassword = ftpPassword;
	}	
	public String getFtpPassword(){
		return ftpPassword;
	}
	
	public void setFtpDir(String ftpDir){
		this.ftpDir = ftpDir;
	}	
	public String getFtpDir(){
		return ftpDir;
	}
	
}
