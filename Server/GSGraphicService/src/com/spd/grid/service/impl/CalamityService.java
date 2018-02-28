package com.spd.grid.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.spd.grid.mapper.CalamityMapper;
import com.spd.grid.service.ICalamityService;

@Component("CalamityService")
public class CalamityService implements ICalamityService {
	@Resource
	private CalamityMapper calamityMapper;
	
	public CalamityMapper getCalamityMapper() {
		return calamityMapper;
	}

	public void setForecastfineMapper(CalamityMapper calamityMapper) {
		this.calamityMapper = calamityMapper;
	}
	
	@Override
	public List<Map> getData(HashMap paraMap){
		return calamityMapper.getData(paraMap);
	}

	@Override
	public List<Map> getDataByTimes(HashMap paraMap) {
		return calamityMapper.getDataByTimes(paraMap);
	}
	
	@Override
	public List<Map> getAllDisaster(HashMap paraMap) {
		return calamityMapper.getAllDisaster(paraMap);
	}
	
	@Override
	public List<Map> getLight(HashMap paraMap){
		return calamityMapper.getLight(paraMap);
	}

	@Override
	public List<Map> getLightByTimes(HashMap paraMap) {
		return calamityMapper.getLightByTimes(paraMap);
	}
	
	@Override
	public List<Map> getHeavy(HashMap paraMap){
		return calamityMapper.getHeavy(paraMap);
	}

	@Override
	public List<Map> getHeavyByTimes(HashMap paraMap) {
		return calamityMapper.getHeavyByTimes(paraMap);
	}
	
	@Override
	public List<Map> getPre(HashMap paraMap){
		return calamityMapper.getPre(paraMap);
	}

	@Override
	public List<Map> getPreByTimes(HashMap paraMap) {
		return calamityMapper.getPreByTimes(paraMap);
	}
	
	@Override
	public List<Map> getAllByTimes(HashMap paraMap) {
		return calamityMapper.getAllByTimes(paraMap);
	}
	
	@Override
	public List<Map> getAllDisasterByTimes(HashMap paraMap) {
		return calamityMapper.getAllDisasterByTimes(paraMap);
	}
	
	@Override
	public List<Map> getStationDetail(HashMap paraMap) {
		return calamityMapper.getStationDetail(paraMap);
	}
	
	@Override
	public List<Map> getAllStations(HashMap paraMap) {
		return calamityMapper.getAllStations(paraMap);
	}
	
	@Override
	public List<Map> getStationDetailByTimes(HashMap paraMap) {
		return calamityMapper.getStationDetailByTimes(paraMap);
	}
	
	@Override
	public List<Map> getStationDetailByUnion(HashMap paraMap) {
		return calamityMapper.getStationDetailByUnion(paraMap);
	}
	
	@Override
	public List<Map> getOneStationDetail(HashMap paraMap) {
		return calamityMapper.getOneStationDetail(paraMap);
	}
	
	@Override
	public List<Map> testStation(HashMap paraMap) {
		return calamityMapper.testStation(paraMap);
	}
}
