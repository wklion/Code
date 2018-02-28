package com.spd.flashflood.other;

import java.io.File;
import java.io.FileFilter;

public class EndFilter implements FileFilter {
	private String formater;
	public EndFilter(String str){
		this.formater = str;
	}
	@Override
	public boolean accept(File file) {
		if(file.isDirectory()){
			return true;
		}
		else{
			String name = file.getName();
			if(name.endsWith(formater))
		                return true;  
		            else  
		                return false;  
		}
	}
}
