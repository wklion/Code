package com.spd.grid.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class NotFoundAnnotationException extends Exception{
	 private static final Logger log = LoggerFactory.getLogger(NotFoundAnnotationException.class);
	
	public NotFoundAnnotationException(String errorInfo){
		log.error(errorInfo);
		
	}
	

}
