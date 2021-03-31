package com.diet.app.dto;

import java.sql.Date;
import java.sql.Timestamp;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.Consultation;

public class ConsultationDTO {

	private int consulationNo;
	private Date date;
	private int appointmentNo;
	private double weight;
	private double height;
	private double bmi;
	private int dietPlanId;
	private int patientId;
	private Timestamp createdAt;
	private Timestamp updatedAt;

	public int getConsulationNo() {
		return consulationNo;
	}

	public void setConsulationNo(int consulationNo) {
		this.consulationNo = consulationNo;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public int getAppointmentNo() {
		return appointmentNo;
	}

	public void setAppointmentNo(int appointmentNo) {
		this.appointmentNo = appointmentNo;
	}

	public double getWeight() {
		return weight;
	}

	public void setWeight(double weight) {
		this.weight = weight;
	}

	public double getHeight() {
		return height;
	}

	public void setHeight(double height) {
		this.height = height;
	}

	public double getBmi() {
		return bmi;
	}

	public void setBmi(double bmi) {
		this.bmi = bmi;
	}

	public int getDietPlanId() {
		return dietPlanId;
	}

	public void setDietPlanId(int dietPlanId) {
		this.dietPlanId = dietPlanId;
	}

	public int getPatientId() {
		return patientId;
	}

	public void setPatientId(int patientId) {
		this.patientId = patientId;
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
	public static ConsultationDTO valueOf(Consultation consultation) {

		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(consultation, ConsultationDTO.class);

	}

	// Converts DTO into Entity
	public Consultation createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, Consultation.class);
	}
}
