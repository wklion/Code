package com.spd.util;

import java.io.File;
import java.io.FilenameFilter;

/**
 * @作者:wangkun
 * @日期:2017年12月19日
 * @公司:spd
 * @说明:
*/
public class FileNameSelector implements FilenameFilter{
	String extension = ".";
	public FileNameSelector(String fileExtensionNoDot){
		extension += fileExtensionNoDot;
	}
	@Override
	public boolean accept(File dir, String name){
		return name.endsWith(extension);
	}
}
