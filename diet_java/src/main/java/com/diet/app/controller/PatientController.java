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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diet.app.dto.PatientDTO;
import com.diet.app.service.PatientService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/patient")
public class PatientController {

	@Autowired
	PatientService patientService;

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public PatientDTO addPatient(@Valid @RequestBody PatientDTO patientDTO,
			@RequestHeader("Authorization") String token) {
		patientDTO = patientService.addPatient(patientDTO);

		return patientDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public PatientDTO udatePatient(@Valid @RequestBody PatientDTO patientDTO,
			@RequestHeader("Authorization") String token) {
		patientDTO = patientService.updatePatient(patientDTO);

		return patientDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/{patientID}")
	public PatientDTO getPatient(@PathVariable long patientID, @RequestHeader("Authorization") String token) {

		return patientService.getPatient(patientID);
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/UID/{patientUID}")
	public PatientDTO getPatientByUid(@PathVariable long patientUID, @RequestHeader("Authorization") String token) {

		return patientService.getPatientByUid(patientUID);
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/list")
	public List<PatientDTO> getAllPatient(@RequestHeader("Authorization") String token) {

		return patientService.getAllPatient();
	}
}
