package com.spd.grid.ws;

import java.util.HashMap;

import javax.ejb.Stateless;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.web.context.ContextLoader;

@Stateless
@Path("MessageService")
public class MessageService {

	@POST
	@Path("getProductSendInfo")
	@Produces("application/json")
	public Object getProductSendInfo(@FormParam("para") String para){
		JSONObject jsonObject = null;
		try {
//			jsonObject = new JSONObject(para);
//			String productId = jsonObject.getString("productId");
//			IMessageService messageService = (ICalamityService)ContextLoader.getCurrentWebApplicationContext().getBean("MessageService");
//			HashMap paramMap = new HashMap();
//			paramMap.put("productId", productId);
//			Object result = messageService.getData(paramMap);
//			return result;
		 } 
		 catch (Exception e) {
			 e.printStackTrace();
			 } 
		 return null;
	}
	
}
