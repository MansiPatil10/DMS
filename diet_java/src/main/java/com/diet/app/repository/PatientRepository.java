package com.diet.app.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.Patient;

public interface PatientRepository extends CrudRepository<Patient, Long> {

	long count();

	Optional<Patient> findByUID(long patientUID);

	Optional<Patient> findByMobile(String mobile);
}
