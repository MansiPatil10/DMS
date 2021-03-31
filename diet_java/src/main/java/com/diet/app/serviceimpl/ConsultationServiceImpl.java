package com.diet.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diet.app.dto.ConsultationDTO;
import com.diet.app.dto.DietDTO;
import com.diet.app.dto.PatientDTO;
import com.diet.app.entity.Consultation;
import com.diet.app.exception.DataNotFoundException;
import com.diet.app.repository.ConsultationRepository;
import com.diet.app.service.ConsultationService;
import com.diet.app.service.DietService;
import com.diet.app.service.PatientService;
import com.diet.app.util.AppUtil;

@Service
public class ConsultationServiceImpl implements ConsultationService {

	@Autowired
	ConsultationRepository consultationRepository;

	@Autowired
	DietService dietService;

	@Autowired
	PatientService patientService;

	@Override
	public ConsultationDTO addConsultation(ConsultationDTO consultationDTO) {
		consultationDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		consultationDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

		ConsultationDTO consultationDTO2 = ConsultationDTO
				.valueOf(consultationRepository.save(consultationDTO.createEntity()));

		sendMail(consultationDTO2, dietService.getDiet(consultationDTO.getDietPlanId()));
		return consultationDTO2;

	}

	@Override
	public ConsultationDTO getConsultation(int consultationID) {
		Optional<Consultation> consultation = consultationRepository.findById(consultationID);
		ConsultationDTO consultationDTO;
		if (consultation.isPresent()) {
			Consultation _consultation = consultation.get();

			consultationDTO = ConsultationDTO.valueOf(_consultation);
		} else {
			throw new DataNotFoundException("Consultation not found");
		}
		return consultationDTO;
	}

	@Override
	public List<ConsultationDTO> getConsultationByPatient(int patientID) {
		Iterable<Consultation> consultations = consultationRepository.findAllByPatientId(patientID);
		List<ConsultationDTO> consultationsDTO = new ArrayList<>();
		for (Consultation consultation : consultations) {
			consultationsDTO.add(ConsultationDTO.valueOf(consultation));
		}
		if (consultationsDTO.isEmpty()) {
			throw new DataNotFoundException("Consultation not found");
		}
		return consultationsDTO;
	}

	private boolean sendMail(ConsultationDTO consultationDTO, DietDTO dietDTO) {
		AppUtil util = new AppUtil();

		PatientDTO patientDTO = patientService.getPatient(consultationDTO.getPatientId());

		util.sendMail(patientDTO.getEmail(), "Test", util.getTemplate(consultationDTO, dietDTO));
		return true;
	}

}
