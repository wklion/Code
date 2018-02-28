package com.spd.util;

import java.lang.reflect.Method;

public class ClassUtil {
	public Object getFieldValueByName(String fieldName, Object obj){
		 String firstLetter = fieldName.substring(0, 1).toUpperCase();
		 String getter = "get" + firstLetter + fieldName.substring(1);
		 Object value = null;
		 try {
			Method method = obj.getClass().getMethod(getter, new Class[] {});
			value = method.invoke(obj, new Object[] {});
		} catch (Exception e) {
			e.printStackTrace();
		}
		return value;
	}
}
