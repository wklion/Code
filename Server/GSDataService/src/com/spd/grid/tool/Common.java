package com.spd.grid.tool;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

public class Common {
	/**
		 * @autor:wangkun
		 * @date:2017年6月13日
		 * @modifydate:2017年6月13日
		 * @param:文件路径
		 * @return:
		 * @description:读取txt
	 */
	public String readTxt(String strFile){
		File file = new File(strFile);
		if(!file.exists()){
			System.out.println("文件不存在!");
			return "";
		}
		StringBuilder sb = new StringBuilder();
		try{
			FileInputStream fis = new FileInputStream(file);
			InputStreamReader read = new InputStreamReader(fis,"utf-8");
			BufferedReader bufferedReader = new BufferedReader(read);
			String lineTxt = null;
			while((lineTxt = bufferedReader.readLine()) != null){
				sb.append(lineTxt);
				sb.append("\r\n");
	        }
			read.close();
			fis.close();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
		return sb.toString();
	}
}
