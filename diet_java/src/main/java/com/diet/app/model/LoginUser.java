package com.diet.app.model;

import javax.validation.constraints.NotEmpty;

public class LoginUser {

	@NotEmpty(message = "User Name is mandatory")
	// @Pattern(regexp = "[a-zA-Z ]*", message = "Please enter valid user name")
	private String username;
	@NotEmpty(message = "Password is mandatory")
	private String password;

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
}
