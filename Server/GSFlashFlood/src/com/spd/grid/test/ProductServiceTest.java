package com.spd.grid.test;

import com.spd.grid.ws.ProductService;

public class ProductServiceTest {

	public static void main(String[] args) {
		ProductService ps = new ProductService();
		String param = "{\"types\":\"中小河流\",\"datetime\":\"2017-07-20 08:00:00\"}";
		ps.getLastFlashFloodByType(param);
	}

}
