package com.diet.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diet.app.dto.PatientDTO;
import com.diet.app.entity.Patient;
import com.diet.app.exception.DataNotFoundException;
import com.diet.app.exception.UserAlreadyExistException;
import com.diet.app.exception.UserNotFoundException;
import com.diet.app.repository.PatientRepository;
import com.diet.app.service.PatientService;
import com.diet.app.util.AppUtil;

@Service
public class PatientServiceImpl implements PatientService {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	PatientRepository patientRepository;

	@Override
	public PatientDTO addPatient(PatientDTO patientDTO) {

		if (patientRepository.findByMobile(patientDTO.getMobile()).isPresent()) {
			throw new UserAlreadyExistException("Mobile number already exist");
		}
		patientDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		patientDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

		long maxNewSeq = patientRepository.count();

		patientDTO.setUID(1000 + maxNewSeq + 1);

		Patient patient = patientRepository.save(patientDTO.createEntity());

		return PatientDTO.valueOf(patient);
	}

	@Override
	public PatientDTO updatePatient(PatientDTO patientDTO) {
		Optional<Patient> patient = patientRepository.findById(patientDTO.getPatient_id());
		Patient updatedPatient;
		if (patient.isPresent()) {
			updatedPatient = patient.get();
			updatedPatient.setName(patientDTO.getName());
			updatedPatient.setEmail(patientDTO.getEmail());
			updatedPatient.setMobile(patientDTO.getMobile());
			updatedPatient.setDob(patientDTO.getDob());
			updatedPatient.setUpdatedAt(AppUtil.getCurrentSystemDate());
			patientRepository.save(updatedPatient);

		} else {
			throw new UserNotFoundException("Patient not present");
		}
		return PatientDTO.valueOf(updatedPatient);
	}

	@Override
	public PatientDTO getPatient(long patientID) {
		Optional<Patient> patient = patientRepository.findById(patientID);
		PatientDTO patientDTO = null;
		if (patient.isPresent()) {
			patientDTO = PatientDTO.valueOf(patient.get());
		} else {
			throw new UserNotFoundException("Patient not present");
		}
		return patientDTO;
	}

	@Override
	public PatientDTO getPatientByUid(long patientUID) {
		Optional<Patient> patient = patientRepository.findByUID(patientUID);
		PatientDTO patientDTO = null;
		if (patient.isPresent()) {
			patientDTO = PatientDTO.valueOf(patient.get());
		} else {
			throw new UserNotFoundException("Patient not present");
		}
		return patientDTO;
	}

	@Override
	public List<PatientDTO> getAllPatient() {
		Iterable<Patient> patients = patientRepository.findAll();
		List<PatientDTO> patientsDTO = new ArrayList<>();
		for (Patient patient : patients) {
			PatientDTO patientDTO = PatientDTO.valueOf(patient);

			patientsDTO.add(patientDTO);
		}
		if (patientsDTO.isEmpty()) {
			throw new DataNotFoundException("Data not present");
		}
		return patientsDTO;
	}

}
