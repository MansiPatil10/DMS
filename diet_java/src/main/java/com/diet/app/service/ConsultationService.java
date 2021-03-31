package com.diet.app.service;

import java.util.List;

import com.diet.app.dto.ConsultationDTO;

public interface ConsultationService {

	public ConsultationDTO addConsultation(ConsultationDTO consultationDTO);

	public ConsultationDTO getConsultation(int consultationID);

	public List<ConsultationDTO> getConsultationByPatient(int patientID);
}
