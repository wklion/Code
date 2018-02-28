package com.spd.grid.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DataSource {
	
	
	  private static final Logger log = LoggerFactory.getLogger(DataSource.class);
	  private static DataSource dataSource = null;
	 // private static Connection conn = null;
	    
	    private DataSource(){
	        
	    }
	    
	    public static synchronized DataSource getInstance() {
	        if(dataSource == null){
	        	dataSource = new DataSource();
	        }
	        return dataSource;
	    }
	    
	    public Connection getConnection(){
	    	Connection conn = null;
	    	try {
	    		 conn = DataSourceSingleton.getInstance().getConnection();
			} catch (SQLException e) {
				e.printStackTrace();
				log.error("获取数据库连接失败，请检查网络");
			}
	    	return conn;
	    }
	    
	    
	    

}
