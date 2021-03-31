package com.diet.app.serviceimpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.diet.app.dto.UpdatePasswordDTO;
import com.diet.app.dto.UserDTO;
import com.diet.app.entity.User;
import com.diet.app.exception.InvalidPasswordException;
import com.diet.app.exception.UserNotFoundException;
import com.diet.app.repository.UserRepository;
import com.diet.app.service.UserService;
import com.diet.app.util.AppUtil;

@Service("userService")
public class UserServiceImpl implements UserService, UserDetailsService {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	UserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) {
		Optional<User> user = userRepository.findByUsername(username);
		if (!user.isPresent()) {
			throw new UsernameNotFoundException("Invalid username or password.");
		}
		return new org.springframework.security.core.userdetails.User(user.get().getUsername(),
				user.get().getPassword(), getAuthority(user.get()));
	}

	private Set<SimpleGrantedAuthority> getAuthority(User user) {
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
		return authorities;
	}

	@Override
	public UserDTO createUser(UserDTO userDTO) {
		userDTO.setCreatedAt(AppUtil.getCurrentSystemDate());
		userDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());
		userDTO.setPassword(bcryptEncoder.encode(userDTO.getPassword()));

		User user = userRepository.save(userDTO.createEntity());

		return UserDTO.valueOf(user);
	}

	@Override
	public UserDTO getUser(int userID) {
		Optional<User> user = userRepository.findById(userID);
		if (user.isPresent()) {
			return UserDTO.valueOf(user.get());
		} else {
			throw new UserNotFoundException("User not present");
		}
	}

	@Override
	public List<UserDTO> getUsersByRole(String role) {
		Iterable<User> users = userRepository.findAllByRole(role);
		List<UserDTO> userDTOs = new ArrayList<>();

		for (User user : users) {
			UserDTO userDTO = UserDTO.valueOf(user);
			userDTOs.add(userDTO);
		}

		if (userDTOs.size() < 1) {
			throw new UserNotFoundException("Users not available with given role");
		}
		return userDTOs;

	}

	@Override
	public Boolean changeUserStatus(int userID, String status) {
		Optional<User> user = userRepository.findById(userID);
		User updatedUser;
		if (user.isPresent()) {
			updatedUser = user.get();
			updatedUser.setStatus(status);
			userRepository.save(updatedUser);

		} else {
			throw new UserNotFoundException("User not present");
		}
		return true;
	}

	@Override
	public UserDTO updateUser(UserDTO userDTO) {
		Optional<User> user = userRepository.findById(userDTO.getUserId());
		User updatedUser;
		if (user.isPresent()) {
			updatedUser = user.get();
			updatedUser.setName(userDTO.getName());
			updatedUser.setUsername(userDTO.getUsername());
			userRepository.save(updatedUser);

		} else {
			throw new UserNotFoundException("User not present");
		}
		return UserDTO.valueOf(updatedUser);
	}

	@Override
	public Boolean updatePassword(UpdatePasswordDTO userDTO) {
		UserDTO updatedUserDTO = null;

		Optional<User> user = userRepository.findByUsername(userDTO.getUsername());
		if (user.isPresent()) {
			updatedUserDTO = UserDTO.valueOf(user.get());

			if (BCrypt.checkpw(userDTO.getOldPassword(), user.get().getPassword())) {
				updatedUserDTO.setPassword(bcryptEncoder.encode(userDTO.getNewPassword()));
				updatedUserDTO.setUpdatedAt(AppUtil.getCurrentSystemDate());

				userRepository.save(updatedUserDTO.createEntity());
			} else {
				throw new InvalidPasswordException("Invalid password");
			}
		} else {
			logger.info("User not found");
			throw new UserNotFoundException("User not found");
		}
		return true;
	}

}
