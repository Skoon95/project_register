package dev.shyoon.registerform.mappers;

import dev.shyoon.registerform.entities.RegisterContactCodeEntity;
import dev.shyoon.registerform.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    UserEntity selectUserByContact (@Param(value = "contact")String contact);

    RegisterContactCodeEntity selectRegisterContactCodeByContactSalt(RegisterContactCodeEntity registerContactCode);


    int insertRegisterContactCode (RegisterContactCodeEntity registerContactCode);


    int updateRegisterCode(RegisterContactCodeEntity registerContactCode);
}
