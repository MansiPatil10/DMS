package com.diet.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diet.app.dto.DietDTO;
import com.diet.app.entity.Diet;
import com.diet.app.entity.DietDays;
import com.diet.app.exception.DataNotFoundException;
import com.diet.app.repository.DietDaysRepository;
import com.diet.app.repository.DietRepository;
import com.diet.app.service.DietService;
import com.diet.app.util.AppUtil;

@Service
public class DietServiceImpl implements DietService {

	@Autowired
	DietRepository dietRepository;

	@Autowired
	DietDaysRepository dietDaysRepository;

	@Override
	public DietDTO addDiet(DietDTO dietDTO) {
		dietDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		dietDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());
		dietDTO.setStatus("ACTIVE");
		Diet diet = dietRepository.save(dietDTO.createEntity());
		if (!dietDTO.getDietDays().isEmpty()) {
			for (DietDays day : dietDTO.getDietDays()) {
				day.setDietId(diet.getDietId());
				day.setCreatedAt(AppUtil.getCurrentSystemDate());
				day.setUpdatedAt(AppUtil.getCurrentSystemDate());

				dietDaysRepository.save(day);
			}
		}
		return DietDTO.valueOf(diet);
	}

	@Override
	@Transactional
	public DietDTO updateDiet(DietDTO dietDTO) {
		Optional<Diet> diet = dietRepository.findById(dietDTO.getDietId());
		DietDTO updatedDietDTO = null;
		if (diet.isPresent()) {
			updatedDietDTO = DietDTO.valueOf(diet.get());
			updatedDietDTO.setName(dietDTO.getName());
			updatedDietDTO.setDescription(dietDTO.getDescription());
			updatedDietDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());
			dietRepository.save(updatedDietDTO.createEntity());
			dietDaysRepository.deleteAllByDietId(dietDTO.getDietId());

			if (!dietDTO.getDietDays().isEmpty()) {
				for (DietDays day : dietDTO.getDietDays()) {
					day.setDietId(dietDTO.getDietId());
					day.setCreatedAt(AppUtil.getCurrentSystemDate());
					day.setUpdatedAt(AppUtil.getCurrentSystemDate());

					dietDaysRepository.save(day);
				}
			}
		} else {
			throw new DataNotFoundException("Data not present");
		}
		return dietDTO;
	}

	@Override
	public DietDTO getDiet(int dietID) {
		Optional<Diet> diet = dietRepository.findById(dietID);
		DietDTO dietDTO = null;
		if (diet.isPresent()) {
			dietDTO = DietDTO.valueOf(diet.get());
			Iterable<DietDays> dietDays = dietDaysRepository.findAllByDietId(dietDTO.getDietId());
			for (DietDays dietDay : dietDays) {
				dietDTO.getDietDays().add(dietDay);
			}
		} else {
			throw new DataNotFoundException("Data not present");
		}
		return dietDTO;
	}

	@Override
	public List<DietDTO> getAllDiet() {
		Iterable<Diet> dietPlans = dietRepository.findAllByTypeAndStatus("MASTER", "ACTIVE");
		List<DietDTO> dietPlansDTO = new ArrayList<>();
		for (Diet diet : dietPlans) {
			DietDTO dietDTO = DietDTO.valueOf(diet);

			Iterable<DietDays> dietDays = dietDaysRepository.findAllByDietId(dietDTO.getDietId());
			for (DietDays dietDay : dietDays) {
				dietDTO.getDietDays().add(dietDay);
			}
			dietPlansDTO.add(dietDTO);
		}
		if (dietPlansDTO.isEmpty()) {
			throw new DataNotFoundException("Data not present");
		}
		return dietPlansDTO;
	}

	@Override
	public DietDTO updateDietStatus(int dietID, String status) {
		Optional<Diet> diet = dietRepository.findById(dietID);
		DietDTO updatedDietDTO = null;
		if (diet.isPresent()) {
			updatedDietDTO = DietDTO.valueOf(diet.get());
			updatedDietDTO.setStatus(status);
			updatedDietDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

			dietRepository.save(updatedDietDTO.createEntity());

		} else {
			throw new DataNotFoundException("Data not present");
		}
		return updatedDietDTO;
	}

}
