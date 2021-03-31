package com.diet.app.service;

import java.sql.Date;
import java.util.List;

import com.diet.app.dto.AppointmentDTO;

public interface AppointmentService {

	public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO);

	public AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO);

	public List<AppointmentDTO> getAllAppointment(Date date);

	public AppointmentDTO updateAppointmentStatus(int appointmentID, String status);

	public AppointmentDTO getAppointment(int appointmentID);
}
