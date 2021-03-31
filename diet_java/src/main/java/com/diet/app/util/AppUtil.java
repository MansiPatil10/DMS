package com.diet.app.util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import com.diet.app.dto.ConsultationDTO;
import com.diet.app.dto.DietDTO;
import com.diet.app.entity.DietDays;
import com.diet.app.model.Constants;

@PropertySource("classpath:constant.properties")
public class AppUtil {

	static Logger logger = LoggerFactory.getLogger(AppUtil.class);

	public static Timestamp getCurrentSystemDate() {
		String METHOD_NAME = "Controller.getCurrentSystemDate";
		logger.info("In method {} ", METHOD_NAME);

		long currentDateMilli = System.currentTimeMillis();
		return new Timestamp(currentDateMilli);
	}

	public static String generateUniqueId() {
		return UUID.randomUUID().toString();
	}

	public void sendMail(String to, String subject, String text) {

		Properties mailProp = new Properties();
		mailProp.setProperty("mail.smtp.auth", "true");
		mailProp.setProperty("mail.smtp.starttls.enable", "true");

		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(Constants.HOST);
		mailSender.setPort(Constants.PORT);
		mailSender.setUsername(Constants.USERNAME);
		mailSender.setPassword(Constants.PASSWORD);
		mailSender.setProtocol(Constants.PROTOCOL);
		mailSender.setJavaMailProperties(mailProp);

		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "utf-8");
		try {
			message.setFrom("dietms.dms@gmail.com");
			message.setTo(to);
			message.setSubject(subject);
			message.setText(text, true);
		} catch (MessagingException e) {
			logger.error(e.getMessage());
		}

		mailSender.send(mimeMessage);
	}

	public String getTemplate(ConsultationDTO consultationDTO, DietDTO dietDTO) {
		String start = "<html><head><style>table,th,td {border: 1px solid black;border-collapse: collapse;}</style></head><body><table>";
		String end = "</table></body></html>";

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String today = df.format(new Date());

		StringBuilder result = new StringBuilder();
		result.append(start);

		result.append("<tr><td>Consultation Date : </td></tr><tr><td>" + today + "</td></tr>");

		result.append("</table></br><table><tr><th>Day</th><th>Time</th><th>Diet</th></tr>");
		for (DietDays day : dietDTO.getDietDays()) {
			result.append("<tr><td>" + day.getDay() + "</td><td>" + day.getTime() + "</td><td>" + day.getDiet()
					+ "</td></tr>");
		}

		result.append(end);

		return result.toString();
	}
}
