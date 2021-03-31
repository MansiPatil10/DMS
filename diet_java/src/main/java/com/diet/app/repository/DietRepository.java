package com.diet.app.repository;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.Diet;

public interface DietRepository extends CrudRepository<Diet, Integer> {

	Iterable<Diet> findAllByTypeAndStatus(String type, String status);
}
