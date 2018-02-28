package com.spd.grid.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import com.spd.grid.service.impl.FTPService;

public class FTPServiceTest {

	public static void main(String[] args) throws Exception {
		FTPService fTPService = new FTPService();
		String strFile = "C:/Users/lenovo/Desktop/temp/山洪灾害气象风险预警.png";
		InputStream input = new FileInputStream(new File(strFile));
		Boolean b = fTPService.uploadFile("127.0.0.1", 21, "wklion", "wklion", "tt", "wk.png", input);
		input.close();
		System.out.print(b);
	}

}
