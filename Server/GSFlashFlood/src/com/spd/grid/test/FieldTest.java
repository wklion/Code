package com.spd.grid.test;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

import com.spd.flashflood.model.Threshold;

public class FieldTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Threshold threshold = new Threshold();
		threshold.setGeoID("345");
		threshold.setL1_H24(38.0);
		Object val = getFieldValueByName("geoID",threshold);
		Object l1h24 = getFieldValueByName("L1_H24",threshold);
		System.out.print(l1h24);
	}
	 private static Object getFieldValueByName(String fieldName, Object o) {  
		       try {    
		           String firstLetter = fieldName.substring(0, 1).toUpperCase();    
		           String getter = "get" + firstLetter + fieldName.substring(1);    
		           Method method = o.getClass().getMethod(getter, new Class[] {});    
		           Object value = method.invoke(o, new Object[] {});    
		           return value;    
		       } catch (Exception e) {  
		           return null;    
		       }    
		   } 
}
