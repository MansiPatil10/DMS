package com.diet.app.repository;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.CasePaper;

public interface CasePaperRepository extends CrudRepository<CasePaper, Integer> {

	public Iterable<CasePaper> findAllByPatientId(int patientId);

	public Iterable<CasePaper> findAllByPatientIdOrderByEndDateDesc(int patientId);
}
