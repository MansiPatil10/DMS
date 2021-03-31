package com.diet.app.repository;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.DietDays;

public interface DietDaysRepository extends CrudRepository<DietDays, Integer> {

	public Iterable<DietDays> findAllByDietId(int dietID);

	public Integer deleteAllByDietId(int dietID);
}
