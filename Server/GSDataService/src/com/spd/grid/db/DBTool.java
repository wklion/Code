package com.spd.grid.db;

import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class DBTool {

	private static DriverManagerDataSource ds ;//= new DriverManagerDataSource ();    
	
	private DBTool() {
		
	}
	
	private static void init() {
		if(ds == null) {
			ds = new DriverManagerDataSource ();   
			ds.setDriverClassName("com.mysql.jdbc.Driver");     
			ds.setUrl("jdbc:mysql://localhost:3309/sampledb");     
			ds.setUsername("root");     
			ds.setPassword("1234");
		}
	}
	
	public static Connection getConnection() {
		init();
		try {
			Connection actualCon = ds.getConnection();
			return actualCon;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void close() {
		try {
			ds.getConnection().close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
