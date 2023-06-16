package dev.shyoon.registerform.services;

import dev.shyoon.registerform.entities.RegisterContactCodeEntity;
import dev.shyoon.registerform.entities.UserEntity;
import dev.shyoon.registerform.enums.RegisterResult;
import dev.shyoon.registerform.enums.SendRegisterContactCodeResult;
import dev.shyoon.registerform.enums.VerifyRegisterContactCodeResult;
import dev.shyoon.registerform.mappers.UserMapper;
import dev.shyoon.registerform.utills.CryptoUtil;
import dev.shyoon.registerform.utills.NCloudUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Service
public class RegisterService {

    private final UserMapper userMapper;

    @Autowired
    public RegisterService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }



    public SendRegisterContactCodeResult sendRegisterContactCodeResult(RegisterContactCodeEntity registerContactCode){
        if (registerContactCode == null
        || registerContactCode.getContact() == null
        || !registerContactCode.getContact().matches("^(010)(\\d{8})$")){ //잘못된 전화번호 or 값이 입력되어 있지 않을때
            return SendRegisterContactCodeResult.FAILURE;
        }

        if (this.userMapper.selectUserByContact(registerContactCode.getContact()) !=null){ //사용중인 연락처일 때
            return SendRegisterContactCodeResult.FAILURE_DUPLICATE;
        }
        String code = RandomStringUtils.randomNumeric(6); //랜덤 숫자 6자리 (인증번호)
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f", //비밀번호 암호화
                registerContactCode.getCode(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date(); //시간제한을 걸기위한 Date값
        Date expiresAt = DateUtils.addMinutes(createdAt,5); //시간제한 5분
        registerContactCode.setCode(code).setSalt(salt).setCreatedAt(createdAt).setExpiresAt(expiresAt).setExpired(false);

        NCloudUtil.sendSms(registerContactCode.getContact(), String.format("[We Meet 회원가입] 인증번호[%s]를 입력해주세요",registerContactCode.getCode()));

        return this.userMapper.insertRegisterContactCode(registerContactCode)>0
                ? SendRegisterContactCodeResult.SUCCESS
                : SendRegisterContactCodeResult.FAILURE;
    }



    public VerifyRegisterContactCodeResult verifyRegisterContactCodeResult(RegisterContactCodeEntity registerContactCode){
        registerContactCode = this.userMapper.selectRegisterContactCodeByContactSalt(registerContactCode);
        if (registerContactCode == null){
            return VerifyRegisterContactCodeResult.FAILURE;
        }
        if (new Date().compareTo(registerContactCode.getExpiresAt())>0){
            return VerifyRegisterContactCodeResult.FAILURE_EXPIRED; //인증번호 만료
        }
        registerContactCode.setExpired(true);
        return this.userMapper.updateRegisterCode(registerContactCode)>0
                ? VerifyRegisterContactCodeResult.SUCCESS
                : VerifyRegisterContactCodeResult.FAILURE;
    }


    public RegisterResult register(UserEntity user,RegisterContactCodeEntity registerContactCode)throws NoSuchAlgorithmException {

        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL; //사용중인 이메일
        }
        if (this.userMapper.selectUserByContact(user.getContact()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_CONTACT; //사용중인 연락처
        }
        if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_NICKNAME; //사용 중인 닉네임
        }
        registerContactCode = this.userMapper.selectRegisterContactCodeByContactSalt(registerContactCode);
        if (registerContactCode == null || !registerContactCode.isExpired()) {
            return RegisterResult.FAILURE;
        }
        user.setPassword(CryptoUtil.hashSha512(user.getPassword())); //저장되는 패스워드 암호화


        return this.userMapper.insertUser(user) > 0
                ? RegisterResult.SUCCESS
                : RegisterResult.FAILURE;
    }



}
