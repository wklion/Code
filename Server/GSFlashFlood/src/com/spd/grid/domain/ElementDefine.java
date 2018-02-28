package com.spd.grid.domain;

import java.util.ArrayList;

/*
 * 预报数据之自定义要素，例如{"name":"tmin12","element":"2t","hourSpan":"12","statistic":"min","hourSpans":[12,24,36,48,60,72]}
 * by zouwei, 2016-1-5
 * */
public class ElementDefine {
	private String name; //自定义要素名
	private String element; //格点精细化预报要素
	private Integer hourSpan; //（统计）时效间隔
	private String strStatistic; //统计方法：none sum min max
	private Integer nStatisticCode; //统计方法编码：0-none 1-sum 2-min 3-max
	private ArrayList<Integer> hourSpans; 
	
	//不统计
	public ElementDefine(String name, String element, ArrayList<Integer> hourSpans)
	{
		this.name = name;
		this.element = element;
		this.hourSpans = hourSpans;
		this.hourSpan = 0;
		this.strStatistic = "";
		this.nStatisticCode = 0;
	}
	
	//统计
	public ElementDefine(String name, String element, Integer hourSpan,String strStatistic, ArrayList<Integer> hourSpans)
	{
		this.name = name;
		this.element = element;
		this.hourSpan = hourSpan;
		this.hourSpans = hourSpans;
		this.strStatistic = strStatistic;
		if(this.strStatistic.equals("sum"))
			this.nStatisticCode = 1;
		else if(this.strStatistic.equals("min"))
			this.nStatisticCode = 2;
		else if(this.strStatistic.equals("max"))
			this.nStatisticCode = 3;
		else
			this.nStatisticCode = 0;
	}
	
	public String getName()
	{
		return this.name;
	}
	
	public void setName(String val)
	{
		this.name = val;
	}
	
	public String getElement()
	{
		return this.element;
	}
	
	public void setElement(String val)
	{
		this.element = val;
	}
	
	public Integer getHourSpan() {
		return this.hourSpan;
	}
	
	public void setHourSpan(Integer val) {
		this.hourSpan = val;
	}
	
	public String getStatistic() {
		return this.strStatistic;
	}
	
	public void setStatistic(String val) {
		this.strStatistic = val;
	}
	
	public Integer getStatisticCode() {
		return this.nStatisticCode;
	}
	
	public ArrayList<Integer> getHourSpans()
	{
		return this.hourSpans;
	}
	
	public void setHourSpans(ArrayList<Integer> val)
	{
		this.hourSpans = val;
	}
}
