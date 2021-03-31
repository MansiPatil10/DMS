package com.diet.app.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.diet.app.entity.User;

public interface UserRepository extends CrudRepository<User, Integer> {
	Optional<User> findByUsername(String username);

	public Iterable<User> findAllByRole(String role);
}
