package com.diet.app.controller;

import java.sql.SQLException;

import javax.mail.MessagingException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.diet.app.exception.DataNotFoundException;
import com.diet.app.exception.InvalidPasswordException;
import com.diet.app.exception.UnauthorisedException;
import com.diet.app.exception.UserAlreadyExistException;
import com.diet.app.exception.UserNotFoundException;
import com.diet.app.model.ErrorResponse;

@ControllerAdvice
public class ExceptionController {

	@ExceptionHandler(value = SQLException.class)
	public ResponseEntity<Object> exception(SQLException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(500);
		response.setError_message("Someting went wrong. Please contact with administrator.");
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(value = UserAlreadyExistException.class)
	public ResponseEntity<Object> exception(UserAlreadyExistException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(400);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(value = InvalidPasswordException.class)
	public ResponseEntity<Object> exception(InvalidPasswordException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(401);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(value = UserNotFoundException.class)
	public ResponseEntity<Object> exception(UserNotFoundException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(404);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(value = DataNotFoundException.class)
	public ResponseEntity<Object> exception(DataNotFoundException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(404);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(value = UnauthorisedException.class)
	public ResponseEntity<Object> exception(UnauthorisedException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(401);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public ResponseEntity<Object> exception(MethodArgumentNotValidException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(400);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(value = MessagingException.class)
	public ResponseEntity<Object> exception(MessagingException exception) {
		ErrorResponse response = new ErrorResponse();
		response.setError_code(400);
		response.setError_message(exception.getMessage());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}
	/*
	 * @ExceptionHandler(value = Exception.class) public ResponseEntity<Object>
	 * exception(Exception exception) { ErrorResponse response = new
	 * ErrorResponse(); response.setError_code(500);
	 * response.setError_message(exception.getMessage()); return new
	 * ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); }
	 */
}
