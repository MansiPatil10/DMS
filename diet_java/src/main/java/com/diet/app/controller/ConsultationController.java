package com.diet.app.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diet.app.dto.ConsultationDTO;
import com.diet.app.service.ConsultationService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/consultation")
public class ConsultationController {

	@Autowired
	ConsultationService consultationService;

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public ConsultationDTO addConsultation(@Valid @RequestBody ConsultationDTO consultationDTO,
			@RequestHeader("Authorization") String token) {
		consultationDTO = consultationService.addConsultation(consultationDTO);

		return consultationDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@GetMapping(value = "/{consultationID}")
	public ConsultationDTO getConsultation(@PathVariable int consultationID,
			@RequestHeader("Authorization") String token) {
		ConsultationDTO consultationDTO = consultationService.getConsultation(consultationID);

		return consultationDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@GetMapping(value = "/patient/{patientID}/list")
	public List<ConsultationDTO> getConsultationByPatient(@PathVariable int patientID,
			@RequestHeader("Authorization") String token) {
		List<ConsultationDTO> consultationDTO = consultationService.getConsultationByPatient(patientID);

		return consultationDTO;
	}
}
