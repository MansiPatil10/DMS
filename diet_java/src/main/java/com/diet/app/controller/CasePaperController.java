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

import com.diet.app.dto.CasePaperDTO;
import com.diet.app.service.CasePaperService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/casepaper")
public class CasePaperController {

	@Autowired
	CasePaperService casePaperService;

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public CasePaperDTO addCasePaper(@Valid @RequestBody CasePaperDTO casePaperDTO,
			@RequestHeader("Authorization") String token) {
		casePaperDTO = casePaperService.addCasePaper(casePaperDTO);

		return casePaperDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public CasePaperDTO updateCasePaper(@Valid @RequestBody CasePaperDTO casePaperDTO,
			@RequestHeader("Authorization") String token) {
		casePaperDTO = casePaperService.updateCasePaper(casePaperDTO);

		return casePaperDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/{casePaperID}")
	public CasePaperDTO getCasePaper(@PathVariable int casePaperID, @RequestHeader("Authorization") String token) {
		CasePaperDTO casePaperDTO = casePaperService.getCasePaper(casePaperID);

		return casePaperDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/patient/{patientID}")
	public CasePaperDTO getCasePaperByPatient(@PathVariable int patientID,
			@RequestHeader("Authorization") String token) {
		CasePaperDTO casePaperDTO = casePaperService.getCasePaperByPatient(patientID);

		return casePaperDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/patient/{patientID}/list")
	public List<CasePaperDTO> getAllCasePaperByPatient(@PathVariable int patientID,
			@RequestHeader("Authorization") String token) {
		List<CasePaperDTO> casePaperDTO = casePaperService.getAllCasePaperByPatient(patientID);

		return casePaperDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping(value = "/list")
	public List<CasePaperDTO> getAllCasePaper(@RequestHeader("Authorization") String token) {
		List<CasePaperDTO> casePaperDTO = casePaperService.getAllCasePaper();

		return casePaperDTO;
	}
}
