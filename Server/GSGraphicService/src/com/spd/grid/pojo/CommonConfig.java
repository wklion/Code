package com.spd.grid.pojo;

public class CommonConfig {

	private String ip;
	private String db;
	private String port;
	private String user;
	private String password;
	private String outputPath;

	public void setIP(String ip) {
		this.ip = ip;
	}

	public String getIP() {
		return this.ip;
	}
	
	public void setDB(String db) {
		this.db = db;
	}

	public String getDB() {
		return this.db;
	}
	
	public void setPort(String port) {
		this.port = port;
	}

	public String getPort() {
		return this.port;
	}
	
	public void setUser(String user) {
		this.user = user;
	}

	public String getUser() {
		return this.user;
	}
	
	public void setPassWord(String password) {
		this.password = password;
	}

	public String getPassWord() {
		return this.password;
	}
	
	public void setOutputPath(String outputPath) {
		this.outputPath = outputPath;
	}

	public String getOutputPath() {
		return this.outputPath;
	}
	
}
