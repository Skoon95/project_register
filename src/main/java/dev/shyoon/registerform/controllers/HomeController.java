package dev.shyoon.registerform.controllers;

import dev.shyoon.registerform.entities.RegisterContactCodeEntity;
import dev.shyoon.registerform.entities.UserEntity;
import dev.shyoon.registerform.enums.RegisterResult;
import dev.shyoon.registerform.enums.SendRegisterContactCodeResult;
import dev.shyoon.registerform.enums.VerifyRegisterContactCodeResult;
import dev.shyoon.registerform.services.RegisterService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping(value = "/register")
public class HomeController {

    private final RegisterService registerService;

    @Autowired
    public HomeController(RegisterService registerService) {
        this.registerService = registerService;
    }

    //    기본주소
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView getRegister() {
        ModelAndView modelAndView = new ModelAndView("home/register");
        return modelAndView;
    }





    @RequestMapping(value = "contactCode",
    method = RequestMethod.GET,
    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCode(RegisterContactCodeEntity registerContactCode){
        SendRegisterContactCodeResult result = this.registerService.sendRegisterContactCodeResult(registerContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result",result.name().toLowerCase());
        }};
        if (result == SendRegisterContactCodeResult.SUCCESS){
            responseObject.put("salt",registerContactCode.getSalt());
        }
        return responseObject.toString();
    }


    @RequestMapping(value = "contactCode",
    method = RequestMethod.PATCH,
    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContactCode(RegisterContactCodeEntity registerContactCode){
        VerifyRegisterContactCodeResult result = this.registerService.verifyRegisterContactCodeResult(registerContactCode);
        JSONObject responseObject = new JSONObject() {{
           put("result",result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "register",
    method = RequestMethod.POST,
    produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(UserEntity user
            ,RegisterContactCodeEntity registerContactCode
            ,@RequestParam(value = "birthStr")String birthStr) throws ParseException,NoSuchAlgorithmException {
        // sdf를 이용해서 넘어오는 date타입을 매칭 시켜준다 년-월-일, 하지않을 경우 미스매치가 일어남
//        js에서도 birStr로 넘기고 있으며 받아올때도 birthStr ->데이트 값을 문자로 변환 시킬것이기 때문에 이렇게 이름을 지음
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date birth = sdf.parse(birthStr);
        user.setBirth(birth);



        RegisterResult result = this.registerService.register(user, registerContactCode);
        JSONObject responseObject = new JSONObject(){{
           put("result",result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

}
