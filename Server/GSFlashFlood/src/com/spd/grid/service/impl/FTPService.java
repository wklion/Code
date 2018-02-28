package com.spd.grid.service.impl;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;

public class FTPService {
	/**
	 * Description: 向FTP服务器上传文件
	 * @Version1.0 
	 * @param url FTP服务器hostname
	 * @param port FTP服务器端口
	 * @param username FTP登录账号
	 * @param password FTP登录密码
	 * @param path FTP服务器保存目录
	 * @param filename 上传到FTP服务器上的文件名
	 * @param input 输入流
	 * @return 成功返回true，否则返回false
	 */
	public static boolean uploadFile(String url,int port,String username, String password, String path, String filename, InputStream input) {
		boolean success = false;
		FTPClient ftp = new FTPClient();
		try {
			int reply;
			ftp.connect(url, port);//连接FTP服务器
			//如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(username, password);//登录
			reply = ftp.getReplyCode();
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftp.disconnect();
				return success;
			}
			
			if(!ftp.changeWorkingDirectory(new String(path.getBytes("GBK"),"ISO-8859-1"))){
				String[] dirs = path.split("/");
				for (String dir : dirs) {
					if (null == dir || "".equals(dir)) continue;
					if (!ftp.changeWorkingDirectory(dir)) {
						String strDic = new String(dir.getBytes("GBK"),"ISO-8859-1");
						if (!ftp.makeDirectory(strDic)) {
							return false;
						}
						else{
							ftp.changeWorkingDirectory(strDic);
						}
					}
				}
			}
			//ftp.changeWorkingDirectory(new String(path.getBytes("GBK"),"ISO-8859-1"));
			ftp.setControlEncoding("GBK");
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftp.enterLocalPassiveMode();
			ftp.storeFile(filename, input);	
			input.close();
			ftp.logout();
			success = true;
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ftp.isConnected()) {
				try {
					ftp.disconnect();
				} catch (IOException ioe) {
				}
			}
		}
		return success;
	}
	
	
	/**
	 * Description: 判断FTP上是否存在文件
	 * @Version1.0 
	 * @param url FTP服务器hostname
	 * @param port FTP服务器端口
	 * @param username FTP登录账号
	 * @param password FTP登录密码
	 * @param path FTP服务器保存目录
	 * @param filename FTP服务器上的文件名
	 * @return 成功返回true，否则返回false
	 */
	public static boolean exist(String url,int port,String username, String password, String path, String filename) {
		boolean exist = false;
		FTPClient ftp = new FTPClient();
		try {
			int reply;
			ftp.connect(url, port);//连接FTP服务器
			//如果采用默认端口，可以使用ftp.connect(url)的方式直接连接FTP服务器
			ftp.login(username, password);//登录
			reply = ftp.getReplyCode();
			if (!FTPReply.isPositiveCompletion(reply)) {
				ftp.disconnect();
				return exist;
			}
			ftp.changeWorkingDirectory(new String(path.getBytes("GBK"),"ISO-8859-1"));
			FTPFile[] files = ftp.listFiles(filename);
			if(files.length > 0)
				exist = true;
			ftp.logout();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (ftp.isConnected()) {
				try {
					ftp.disconnect();
				} catch (IOException ioe) {
				}
			}
		}
		return exist;
	}
}
