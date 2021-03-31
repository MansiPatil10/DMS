package com.diet.app.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diet.app.dto.DietDTO;
import com.diet.app.service.DietService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/diet")
public class DietController {

	@Autowired
	DietService dietService;

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public DietDTO addDiet(@Valid @RequestBody DietDTO dietDTO, @RequestHeader("Authorization") String token) {
		dietDTO = dietService.addDiet(dietDTO);

		return dietDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public DietDTO udateDiet(@Valid @RequestBody DietDTO dietDTO, @RequestHeader("Authorization") String token) {
		dietDTO = dietService.updateDiet(dietDTO);

		return dietDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@GetMapping(value = "/{dietID}")
	public DietDTO getDiet(@PathVariable int dietID, @RequestHeader("Authorization") String token) {
		DietDTO dietDTO = dietService.getDiet(dietID);

		return dietDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@GetMapping(value = "/list")
	public List<DietDTO> getAllDiet(@RequestHeader("Authorization") String token) {
		List<DietDTO> dietDTO = dietService.getAllDiet();

		return dietDTO;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
	@DeleteMapping(value = "/{dietID}")
	public DietDTO deleteDiet(@PathVariable int dietID, @RequestHeader("Authorization") String token) {
		DietDTO dietDTO = dietService.updateDietStatus(dietID, "DISABLED");

		return dietDTO;
	}
}
