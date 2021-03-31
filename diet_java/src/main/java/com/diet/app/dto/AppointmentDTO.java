package com.diet.app.dto;

import java.sql.Date;
import java.sql.Timestamp;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.Appointment;

public class AppointmentDTO {

	private int appointmentId;
	private int appointmentNo;
	private Date appointmentDate;
	private int casePaperNo;
	private String status;
	private CasePaperDTO casePaper;
	private PatientDTO patient;
	private Timestamp createdAt;
	private Timestamp updatedAt;

	public int getAppointmentId() {
		return appointmentId;
	}

	public void setAppointmentId(int appointmentId) {
		this.appointmentId = appointmentId;
	}

	public int getAppointmentNo() {
		return appointmentNo;
	}

	public void setAppointmentNo(int appointmentNo) {
		this.appointmentNo = appointmentNo;
	}

	public Date getAppointmentDate() {
		return appointmentDate;
	}

	public void setAppointmentDate(Date appointmentDate) {
		this.appointmentDate = appointmentDate;
	}

	public int getCasePaperNo() {
		return casePaperNo;
	}

	public void setCasePaperNo(int casePaperNo) {
		this.casePaperNo = casePaperNo;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public CasePaperDTO getCasePaper() {
		return casePaper;
	}

	public void setCasePaper(CasePaperDTO casePaper) {
		this.casePaper = casePaper;
	}

	public PatientDTO getPatient() {
		return patient;
	}

	public void setPatient(PatientDTO patient) {
		this.patient = patient;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}

	// Converts Entity into DTO
	public static AppointmentDTO valueOf(Appointment appointment) {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(appointment, AppointmentDTO.class);

	}

	// Converts DTO into Entity
	public Appointment createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, Appointment.class);
	}
}
