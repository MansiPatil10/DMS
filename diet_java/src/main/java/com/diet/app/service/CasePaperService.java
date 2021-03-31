package com.diet.app.service;

import java.util.List;

import com.diet.app.dto.CasePaperDTO;

public interface CasePaperService {

	public CasePaperDTO addCasePaper(CasePaperDTO casePaperDTO);

	public CasePaperDTO updateCasePaper(CasePaperDTO casePaperDTO);

	public CasePaperDTO getCasePaper(int casePaperID);

	public CasePaperDTO getCasePaperByPatient(int pataientID);

	public List<CasePaperDTO> getAllCasePaper();

	public List<CasePaperDTO> getAllCasePaperByPatient(int pataientID);
}