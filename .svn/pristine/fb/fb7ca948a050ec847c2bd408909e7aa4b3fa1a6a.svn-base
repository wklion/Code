package com.spd.grid.ws;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;

import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.spd.grid.domain.CommonResult;
import com.spd.grid.domain.UploadFileParam;
import com.sun.jersey.multipart.FormDataParam;

@Stateless
@Path("FileService")
public class FileService {
	@POST
	@Path("uploadFile")
	@Produces("application/json")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Object uploadFile(@FormDataParam("file") InputStream inStream,
			@FormDataParam("param") String param){
		CommonResult commonResult = new CommonResult();
		Gson gson = new Gson();
		UploadFileParam uploadFileParam = gson.fromJson(param, UploadFileParam.class);
		String dic = uploadFileParam.getDic();
		String fileName = uploadFileParam.getFileName();
		String strFile = dic+fileName;
		byte[] bytes = new byte[1024];
		int index; 
		try {
			File file = new File(strFile);
			if(!file.exists()){
				file.createNewFile();
			}
			FileOutputStream downloadFile = new FileOutputStream(strFile);
			while ((index = inStream.read(bytes)) != -1) {  
			        downloadFile.write(bytes, 0, index);  
			        downloadFile.flush();  
			}  
			downloadFile.close();
			inStream.close();
			commonResult.setSuc(true);
		} catch (Exception e) {
			commonResult.setErr(e.getMessage());
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return commonResult;
	}
}
