package com.diet.app.service;

import java.util.List;

import com.diet.app.dto.PatientDTO;

public interface PatientService {

	public PatientDTO addPatient(PatientDTO patientDTO);

	public PatientDTO updatePatient(PatientDTO patientDTO);

	public PatientDTO getPatient(long patientID);

	public PatientDTO getPatientByUid(long patientUID);

	public List<PatientDTO> getAllPatient();
}
