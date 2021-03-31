package com.diet.app.repository;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.Consultation;

public interface ConsultationRepository extends CrudRepository<Consultation, Integer> {

	public Iterable<Consultation> findAllByPatientId(int patientID);
}
