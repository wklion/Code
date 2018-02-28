package com.spd.grid.tool;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;

import com.spd.weathermap.util.LogTool;

public class FileHelper {
		private  Logger log = LogTool.getLogger(this.getClass());
		/**
		 * @作者:wangkun
		 * @日期:2017年7月3日
		 * @修改日期:2017年7月3日
		 * @参数:
		 * @返回:
		 * @说明:拷贝文件
		 */
		public void Copy(String srcFile,String targerFile){
				try {
						FileInputStream fis = new FileInputStream(srcFile);
						FileOutputStream fos = new FileOutputStream(targerFile);
						int len = 0;
						byte[] buf = new byte[1024];
						while ((len = fis.read(buf)) != -1) {
				            fos.write(buf, 0, len);
				        }
				        fis.close();
				        fos.close();
				} catch (Exception e) {
						log.info("拷贝文件出错!");
				}
		}
		public String getDateTimeFromFile(String fileName,String filePattern){
				int firstIndex = filePattern.indexOf("{");
				int secondIndex = filePattern.indexOf("}");
				String strFormatDateTime = filePattern.substring(firstIndex+1,secondIndex);
				/*int yCount  = findCharCount(strFormatDateTime,'y');
				int MCount  = findCharCount(strFormatDateTime,'M');
				int dCount  = findCharCount(strFormatDateTime,'d');
				int HCount  = findCharCount(strFormatDateTime,'H');
				int mCount  = findCharCount(strFormatDateTime,'m');
				strFormatDateTime.replaceAll("y", "\\d{"+MCount+"}");
				strFormatDateTime.replaceAll("M", "\\d{"+yCount+"}");
				strFormatDateTime.replaceAll("d", "\\d{"+dCount+"}");
				strFormatDateTime.replaceAll("H", "\\d{"+HCount+"}");
				strFormatDateTime.replaceAll("m", "\\d{"+mCount+"}");*/
				String strDateTime = fileName.substring(firstIndex);
				strDateTime = strDateTime.substring(0,secondIndex-firstIndex-1);
				SimpleDateFormat sdf = new SimpleDateFormat(strFormatDateTime);
				Date date = null;
				try {
						date = sdf.parse(strDateTime);
				} catch (ParseException e) {
						e.printStackTrace();
				}
				Calendar cal = Calendar.getInstance();
				cal.setTime(date);
				cal.add(Calendar.HOUR, 8);
				return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(cal.getTime());
		}
		/**
		 * @作者:wangkun
		 * @日期:2017年7月6日
		 * @修改日期:2017年7月6日
		 * @参数:str-字符串;matchChar-匹配字符串
		 * @返回:字符串个数
		 * @说明:查找字符个数
		 */
		public int findCharCount(String str,char matchChar){
			int count = 0;
			int strCount = str.length();
			for(int i=0;i<strCount;i++){
				char c = str.charAt(i);
				if(c==matchChar){
						count++;
				}
			}
			return count;
		}
		public File findGrid2(String dic,String strFormater){
			File file = new File(dic);
			File[] files = file.listFiles(new EndFilter(strFormater));
			if(files==null||files.length<1){
				return null;
			}
			return files[0];
		}
	/**
	 * @作者:wangkun
	 * @日期:2017年11月3日
	 * @修改日期:2017年11月3日
	 * @参数:
	 * @返回:
	 * @说明:
	 */
	public Boolean saveStringToFile(String str,String dic,String fileName){
		File fileDir = new File(dic);
		if(!fileDir.exists()){
			fileDir.mkdirs();
		}
		String strFile = dic+fileName;
		File file = new File(strFile);
		try {
			file.createNewFile();
			BufferedWriter out = new BufferedWriter(new FileWriter(file));
			out.write(str);
			out.flush();
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return true;
	}
}
