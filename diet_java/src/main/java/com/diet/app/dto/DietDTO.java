package com.diet.app.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.Diet;
import com.diet.app.entity.DietDays;

public class DietDTO {

	private int dietId;
	private String name;
	private String description;
	private String type;
	private String status;
	private List<DietDays> dietDays = new ArrayList<>();
	private Timestamp createdAt;
	private Timestamp updatedAt;

	public int getDietId() {
		return dietId;
	}

	public void setDietId(int dietId) {
		this.dietId = dietId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<DietDays> getDietDays() {
		return dietDays;
	}

	public void setDietDays(List<DietDays> dietDays) {
		this.dietDays = dietDays;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}

	// Converts Entity into DTO
	public static DietDTO valueOf(Diet diet) {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(diet, DietDTO.class);

	}

	// Converts DTO into Entity
	public Diet createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, Diet.class);
	}
}
