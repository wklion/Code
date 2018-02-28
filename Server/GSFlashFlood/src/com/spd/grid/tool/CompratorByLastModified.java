/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-08-01
 * @最后修改: 2017-08-01
 * @功能: 文件比较器，按时间
 **/
package com.spd.grid.tool;

import java.io.File;
import java.util.Comparator;

public class CompratorByLastModified implements Comparator<File>{
	public int compare(File f1, File f2) {
		long diff = f1.lastModified()-f2.lastModified();
		if(diff>0)
			return 1;
		else if(diff==0)
			return 0;
		else
			return -1;
	}
	public boolean equals(Object obj){  
	      return true;  
	} 
}
