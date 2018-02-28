package com.spd.grid.domain;

/*
 * 文件信息，add by zouwei, 2016-03-31
 * */
public class FileInfo {
	private String m_filename;	//文件名
	private Integer m_size;		//文件大小
	private Integer m_status;	//文件状态，例如是否存在，0-不存在，1-存在，2-（存在且）未上传，3-（存在且）已上传
	private String m_tag;		//标识，例如用于标识要素名
	private String m_path;		//标识，例如用于标识要素名
	
	public FileInfo(String filename,Integer size,Integer status,String tag,String path){
		m_filename = filename;
		m_size = size;
		m_status = status;
		m_tag = tag;
		m_path = path;
	}
	
	public String getFileName(){
		return m_filename;
	}
	
	public void setFileName(String val){
		m_filename = val;
	}
	
	public Integer getSize(){
		return m_size;
	}
	
	public void setSize(Integer val) {
		m_size = val;
	}
	
	public Integer getStatus() {
		return m_status;
	}
	
	public void setStatus(Integer val) {
		m_status = val;
	}
	
	public String getTag() {
		return m_tag;
	}
	
	public void setTag(String val) {
		m_tag = val;
	}

	public void setPath(String m_path) {
		this.m_path = m_path;
	}

	public String getPath() {
		return m_path;
	}
}
