package com.diet.app.controller;

import java.sql.Date;
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

import com.diet.app.dto.AppointmentDTO;
import com.diet.app.service.AppointmentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/appointment")
public class AppointmentController {

	@Autowired
	AppointmentService appointmentService;

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public AppointmentDTO createAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO,
			@RequestHeader("Authorization") String token) {
		appointmentDTO = appointmentService.createAppointment(appointmentDTO);

		return appointmentDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public AppointmentDTO updateAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO,
			@RequestHeader("Authorization") String token) {
		appointmentDTO = appointmentService.updateAppointment(appointmentDTO);

		return appointmentDTO;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping("/list/{date}")
	public List<AppointmentDTO> getAllAppointment(@PathVariable Date date,
			@RequestHeader("Authorization") String token) {
		List<AppointmentDTO> appointment = appointmentService.getAllAppointment(date);

		return appointment;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping("/{appointmentID}/status/{status}")
	public AppointmentDTO updateAppointmentStatus(@PathVariable int appointmentID, @PathVariable String status,
			@RequestHeader("Authorization") String token) {
		AppointmentDTO appointment = appointmentService.updateAppointmentStatus(appointmentID, status);

		return appointment;
	}

	@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
	@GetMapping("/{appointmentID}")
	public AppointmentDTO getAppointment(@PathVariable int appointmentID,
			@RequestHeader("Authorization") String token) {
		AppointmentDTO appointment = appointmentService.getAppointment(appointmentID);

		return appointment;
	}
}
