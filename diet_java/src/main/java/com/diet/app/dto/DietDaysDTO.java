package com.diet.app.dto;

import java.sql.Timestamp;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.DietDays;

public class DietDaysDTO {

	private int dietId;
	private String name;
	private String description;
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
	public static DietDaysDTO valueOf(DietDays dietDays) {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(dietDays, DietDaysDTO.class);

	}

	// Converts DTO into Entity
	public DietDays createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, DietDays.class);
	}
}
