/**     
 * @公司:	spd
 * @作者: wangkun       
 * @创建: 2017-06-13
 * @最后修改: 2017-06-13
 * @功能: 文件类型过滤
 **/
package com.spd.grid.tool;

import java.io.File;
import java.io.FileFilter;

public class TypeFileFilter implements FileFilter {
		private String filtrStr;
		public TypeFileFilter(String filtrStr) {
			this.filtrStr = filtrStr.toLowerCase();
		}
		@Override  
	    public boolean accept(File pathname) {  
		        String filename = pathname.getName().toLowerCase();
		        return filename.matches(filtrStr);
	    }
}
