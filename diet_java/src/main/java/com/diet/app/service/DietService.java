package com.diet.app.service;

import java.util.List;

import com.diet.app.dto.DietDTO;

public interface DietService {
	public DietDTO addDiet(DietDTO dietDTO);

	public DietDTO updateDiet(DietDTO dietDTO);

	public DietDTO getDiet(int dietID);

	public List<DietDTO> getAllDiet();

	public DietDTO updateDietStatus(int dietID, String status);
}
