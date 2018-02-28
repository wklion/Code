package com.spd.grid.domain;

public class FtpInfo {
	private String url;
	private int port;
	private String userName;
	private String password;
	private String dic;
	private String fileName;
	private String strFile;
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getDic() {
		return dic;
	}
	public void setDic(String dic) {
		this.dic = dic;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getStrFile() {
		return strFile;
	}
	public void setStrFile(String strFile) {
		this.strFile = strFile;
	}
}
