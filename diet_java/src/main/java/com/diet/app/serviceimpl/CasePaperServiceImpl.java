package com.diet.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diet.app.dto.CasePaperDTO;
import com.diet.app.entity.CasePaper;
import com.diet.app.exception.DataNotFoundException;
import com.diet.app.repository.CasePaperRepository;
import com.diet.app.service.CasePaperService;
import com.diet.app.util.AppUtil;

@Service
public class CasePaperServiceImpl implements CasePaperService {

	@Autowired
	CasePaperRepository casePaperRepository;

	@Override
	public CasePaperDTO addCasePaper(CasePaperDTO casePaperDTO) {
		casePaperDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		casePaperDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

		CasePaper casePaper = casePaperRepository.save(casePaperDTO.createEntity());

		return CasePaperDTO.valueOf(casePaper);
	}

	@Override
	public CasePaperDTO updateCasePaper(CasePaperDTO casePaperDTO) {
		Optional<CasePaper> casePaper = casePaperRepository.findById(casePaperDTO.getCasePaperNo());
		if (casePaper.isPresent()) {
			CasePaper updatedCasePaper = casePaper.get();
			updatedCasePaper.setStartDate(casePaperDTO.getStartDate());
			updatedCasePaper.setEndDate(casePaperDTO.getEndDate());
			updatedCasePaper.setUpdatedAt(AppUtil.getCurrentSystemDate());

			casePaperRepository.save(updatedCasePaper);
		} else {
			throw new DataNotFoundException("Case paper not found");
		}
		return casePaperDTO;
	}

	@Override
	public CasePaperDTO getCasePaper(int casePaperID) {
		Optional<CasePaper> casePaper = casePaperRepository.findById(casePaperID);
		CasePaperDTO casePaperDTO;
		if (casePaper.isPresent()) {
			CasePaper _casePaper = casePaper.get();

			casePaperDTO = CasePaperDTO.valueOf(_casePaper);
		} else {
			throw new DataNotFoundException("Case paper not found");
		}
		return casePaperDTO;
	}

	@Override
	public List<CasePaperDTO> getAllCasePaper() {
		Iterable<CasePaper> casePapers = casePaperRepository.findAll();
		List<CasePaperDTO> casePaperDTO = new ArrayList<>();
		for (CasePaper casePaper : casePapers) {
			casePaperDTO.add(CasePaperDTO.valueOf(casePaper));
		}
		if (casePaperDTO.isEmpty()) {
			throw new DataNotFoundException("Case paper not found");
		}
		return casePaperDTO;
	}

	@Override
	public CasePaperDTO getCasePaperByPatient(int patientID) {
		Iterable<CasePaper> casePapers = casePaperRepository.findAllByPatientIdOrderByEndDateDesc(patientID);
		CasePaperDTO casePaperDTO = null;
		for (CasePaper casePaper : casePapers) {
			casePaperDTO = CasePaperDTO.valueOf(casePaper);
			break;
		}
		if (casePaperDTO == null) {
			throw new DataNotFoundException("Case paper not found");
		}
		return casePaperDTO;
	}

	@Override
	public List<CasePaperDTO> getAllCasePaperByPatient(int patientID) {
		Iterable<CasePaper> casePapers = casePaperRepository.findAllByPatientIdOrderByEndDateDesc(patientID);
		List<CasePaperDTO> casePaperDTO = new ArrayList<>();
		for (CasePaper casePaper : casePapers) {
			casePaperDTO.add(CasePaperDTO.valueOf(casePaper));
		}
		if (casePaperDTO.isEmpty()) {
			throw new DataNotFoundException("Case paper not found");
		}
		return casePaperDTO;
	}
}
