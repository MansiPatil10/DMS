package com.diet.app.serviceimpl;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diet.app.dto.AppointmentDTO;
import com.diet.app.dto.CasePaperDTO;
import com.diet.app.dto.PatientDTO;
import com.diet.app.entity.Appointment;
import com.diet.app.exception.DataNotFoundException;
import com.diet.app.repository.AppointmentRepository;
import com.diet.app.service.AppointmentService;
import com.diet.app.service.CasePaperService;
import com.diet.app.service.PatientService;
import com.diet.app.util.AppUtil;

@Service
public class AppointmentServiceImpl implements AppointmentService {

	@Autowired
	AppointmentRepository appointmentRepository;

	@Autowired
	PatientService patientService;

	@Autowired
	CasePaperService casePaperService;

	@Override
	public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
		appointmentDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		appointmentDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());
		appointmentDTO.setAppointmentNo(getAppointmentCount(appointmentDTO.getAppointmentDate()) + 1);
		appointmentDTO.setStatus("PENDING");

		Appointment appointment = appointmentRepository.save(appointmentDTO.createEntity());
		return AppointmentDTO.valueOf(appointment);
	}

	@Override
	public AppointmentDTO updateAppointment(AppointmentDTO appointmentDTO) {
		Optional<Appointment> appointment = appointmentRepository.findById(appointmentDTO.getAppointmentId());
		AppointmentDTO updatedappointmentDTO = null;
		if (appointment.isPresent()) {
			updatedappointmentDTO = AppointmentDTO.valueOf(appointment.get());
			if (appointmentDTO.getAppointmentDate().compareTo(updatedappointmentDTO.getAppointmentDate()) == 0) {
				updatedappointmentDTO.setAppointmentNo(getAppointmentCount(appointmentDTO.getAppointmentDate()) + 1);
			}
			updatedappointmentDTO.setAppointmentDate(appointmentDTO.getAppointmentDate());
			updatedappointmentDTO.setStatus(appointmentDTO.getStatus());
			updatedappointmentDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

			appointmentRepository.save(updatedappointmentDTO.createEntity());
		} else {
			throw new DataNotFoundException("Appointment not found");
		}
		try {
			CasePaperDTO casePaperDTO = casePaperService.getCasePaper(updatedappointmentDTO.getCasePaperNo());
			updatedappointmentDTO.setCasePaper(casePaperDTO);

			PatientDTO patientDTO = patientService.getPatient(casePaperDTO.getPatientId());
			updatedappointmentDTO.setPatient(patientDTO);
		} catch (DataNotFoundException e) {
			// TODO: handle exception
		}
		return updatedappointmentDTO;
	}

	@Override
	public AppointmentDTO updateAppointmentStatus(int appointmentID, String status) {
		Optional<Appointment> appointment = appointmentRepository.findById(appointmentID);
		AppointmentDTO updatedappointmentDTO = null;
		if (appointment.isPresent()) {
			updatedappointmentDTO = AppointmentDTO.valueOf(appointment.get());

			updatedappointmentDTO.setStatus(status);
			updatedappointmentDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

			appointmentRepository.save(updatedappointmentDTO.createEntity());
		} else {
			throw new DataNotFoundException("Appointment not found");
		}
		try {
			CasePaperDTO casePaperDTO = casePaperService.getCasePaper(updatedappointmentDTO.getCasePaperNo());
			updatedappointmentDTO.setCasePaper(casePaperDTO);

			PatientDTO patientDTO = patientService.getPatient(casePaperDTO.getPatientId());
			updatedappointmentDTO.setPatient(patientDTO);
		} catch (DataNotFoundException e) {
			// TODO: handle exception
		}
		return updatedappointmentDTO;
	}

	@Override
	public List<AppointmentDTO> getAllAppointment(Date date) {
		Iterable<Appointment> appointments = appointmentRepository
				.findAllByAppointmentDateOrderByAppointmentNoAsc(date);
		List<AppointmentDTO> appointmentsDTO = new ArrayList<>();
		for (Appointment appointment : appointments) {
			AppointmentDTO appointmentDTO = AppointmentDTO.valueOf(appointment);
			try {
				CasePaperDTO casePaperDTO = casePaperService.getCasePaper(appointmentDTO.getCasePaperNo());
				appointmentDTO.setCasePaper(casePaperDTO);

				PatientDTO patientDTO = patientService.getPatient(casePaperDTO.getPatientId());
				appointmentDTO.setPatient(patientDTO);
			} catch (DataNotFoundException e) {
				// TODO: handle exception
			}
			appointmentsDTO.add(appointmentDTO);
		}
		if (appointmentsDTO.isEmpty()) {
			throw new DataNotFoundException("Appointment not found");
		}
		return appointmentsDTO;
	}

	public int getAppointmentCount(Date date) {
		int count = appointmentRepository.countByAppointmentDate(date);

		return count;
	}

	@Override
	public AppointmentDTO getAppointment(int appointmentID) {
		Optional<Appointment> appointment = appointmentRepository.findById(appointmentID);
		AppointmentDTO appointmentDTO = null;
		if (appointment.isPresent()) {
			appointmentDTO = AppointmentDTO.valueOf(appointment.get());

		} else {
			throw new DataNotFoundException("Appointment not found");
		}
		try {
			CasePaperDTO casePaperDTO = casePaperService.getCasePaper(appointmentDTO.getCasePaperNo());
			appointmentDTO.setCasePaper(casePaperDTO);

			PatientDTO patientDTO = patientService.getPatient(casePaperDTO.getPatientId());
			appointmentDTO.setPatient(patientDTO);
		} catch (DataNotFoundException e) {
			// TODO: handle exception
		}
		return appointmentDTO;

	}
}
