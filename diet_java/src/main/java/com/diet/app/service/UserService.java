package com.diet.app.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.diet.app.dto.UpdatePasswordDTO;
import com.diet.app.dto.UserDTO;

public interface UserService {

	public UserDetails loadUserByUsername(String username);

	public UserDTO createUser(UserDTO userDTO);

	public UserDTO getUser(int userID);

	public List<UserDTO> getUsersByRole(String role);

	public Boolean changeUserStatus(int userId, String status);

	public UserDTO updateUser(UserDTO userDTO);

	public Boolean updatePassword(UpdatePasswordDTO userDTO);
}
