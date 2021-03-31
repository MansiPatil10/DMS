package com.diet.app.repository;

import java.sql.Date;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.Appointment;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {

	Iterable<Appointment> findAllByAppointmentDateOrderByAppointmentNoAsc(Date date);

	int countByAppointmentDate(Date date);
}
