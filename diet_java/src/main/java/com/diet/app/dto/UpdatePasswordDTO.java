package com.diet.app.dto;

import javax.validation.constraints.NotEmpty;

public class UpdatePasswordDTO {

	private String username;

	@NotEmpty(message = "Old password is mandatory")
	private String oldPassword;

	@NotEmpty(message = "New password is mandatory")
	private String newPassword;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
