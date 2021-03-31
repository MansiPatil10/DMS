package com.diet.app.dto;

import java.sql.Date;
import java.sql.Timestamp;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.CasePaper;

public class CasePaperDTO {

	private int casePaperNo;
	private int patientId;
	private Date startDate;
	private Date endDate;
	private double amount;
	private Timestamp createdAt;
	private Timestamp updatedAt;

	public int getCasePaperNo() {
		return casePaperNo;
	}

	public void setCasePaperNo(int casePaperNo) {
		this.casePaperNo = casePaperNo;
	}

	public int getPatientId() {
		return patientId;
	}

	public void setPatientId(int patientId) {
		this.patientId = patientId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
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
	public static CasePaperDTO valueOf(CasePaper casePaper) {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(casePaper, CasePaperDTO.class);

	}

	// Converts DTO into Entity
	public CasePaper createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, CasePaper.class);
	}
}
