package com.spd.grid.jdbc;

import com.alibaba.druid.pool.DruidDataSource;
import com.spd.grid.domain.ApplicationContextFactory;
import com.spd.grid.domain.DataBaseConnectionConfigInfo;

public class DataSourceSingleton {
	
	
	    private DataSourceSingleton() {}  
	 
	    private static DruidDataSource dataSource=null;  
	    
	    
	    
	    public static DruidDataSource getInstance() {  
	         if (dataSource == null) {    
	        	 DataBaseConnectionConfigInfo dataBaseConnectionConfigInfo = (DataBaseConnectionConfigInfo)ApplicationContextFactory.getInstance().getBean("dataBaseConnectionConfigInfo");
	        	 dataSource = new DruidDataSource();
	        	 dataSource.setDriverClassName("com.mysql.jdbc.Driver"); 
	        	 dataSource.setUsername(dataBaseConnectionConfigInfo.getUser());
	        	 dataSource.setPassword(dataBaseConnectionConfigInfo.getPassword());
	        	 dataSource.setUrl(String.format("jdbc:mysql://%s:%s/%s", dataBaseConnectionConfigInfo.getServer(), dataBaseConnectionConfigInfo.getPort(), dataBaseConnectionConfigInfo.getDatabase()));
	        	 dataSource.setInitialSize(5);
	        	 dataSource.setMinIdle(1);
	        	 dataSource.setMaxActive(10); // 启用监控统计功能  dataSource.setFilters("stat");// for mysql  dataSource.setPoolPreparedStatements(false);
	         }    
	        return dataSource;  
	    }  

}
