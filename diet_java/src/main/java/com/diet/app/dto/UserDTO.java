package com.diet.app.dto;

import java.sql.Timestamp;

import org.dozer.DozerBeanMapper;

import com.diet.app.entity.User;

public class UserDTO {

	private int userId;
	private String username;
	private String password;
	private String name;
	private String role;
	private String status;
	private Timestamp createdAt;
	private Timestamp updatedAt;

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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
	public static UserDTO valueOf(User user) {

		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(user, UserDTO.class);

	}

	// Converts DTO into Entity
	public User createEntity() {
		DozerBeanMapper mapper = new DozerBeanMapper();
		return mapper.map(this, User.class);
	}
}
