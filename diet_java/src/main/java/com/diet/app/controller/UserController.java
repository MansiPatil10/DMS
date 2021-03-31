package com.diet.app.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diet.app.config.TokenProvider;
import com.diet.app.dto.UpdatePasswordDTO;
import com.diet.app.dto.UserDTO;
import com.diet.app.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserService userService;

	@Autowired
	TokenProvider tokenProvider;

	@PreAuthorize("hasAnyRole('ADMIN')")
	@PostMapping(value = "/doctor", consumes = MediaType.APPLICATION_JSON_VALUE)
	public UserDTO addDoctor(@Valid @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String token) {
		userDTO.setRole("DOCTOR");

		userDTO = userService.createUser(userDTO);
		userDTO.setPassword("");
		return userDTO;
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
	@PostMapping(value = "/receptionist", consumes = MediaType.APPLICATION_JSON_VALUE)
	public UserDTO addReceptionist(@Valid @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String token) {
		userDTO.setRole("RECEPTIONIST");

		userDTO = userService.createUser(userDTO);
		userDTO.setPassword("");
		return userDTO;
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR','RECEPTIONIST')")
	@PutMapping(value = "/password", consumes = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<String> updatePassword(@Valid @RequestBody UpdatePasswordDTO userDTO,
			@RequestHeader("Authorization") String token) {
		/*
		 * if (!tokenProvider.getUsernameFromToken(token).equals(userDTO.getUsername()))
		 * { throw new UnauthorisedException("Unathorised request"); }
		 */
		if (userService.updatePassword(userDTO)) {
			return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Password updation failed", HttpStatus.OK);
		}
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
	@GetMapping(value = "/role/{role}")
	public List<UserDTO> getUser(@PathVariable String role, @RequestHeader("Authorization") String token) {

		List<UserDTO> users = userService.getUsersByRole(role);

		return users;
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
	@GetMapping(value = "/{userID}")
	public UserDTO getUserById(@PathVariable int userID, @RequestHeader("Authorization") String token) {

		UserDTO user = userService.getUser(userID);

		return user;
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
	@PutMapping(value = "/{userID}/status/{status}")
	public String updateUserStatus(@PathVariable int userID, @PathVariable String status,
			@RequestHeader("Authorization") String token) {

		if (userService.changeUserStatus(userID, status)) {
			return "User updated successfully";
		} else {
			return "User updation failed";
		}

	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
	@PutMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public UserDTO updateUser(@Valid @RequestBody UserDTO userDTO, @RequestHeader("Authorization") String token) {

		return userService.updateUser(userDTO);
	}

}
