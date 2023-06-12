package dev.shyoon.registerform.controllers;

import dev.shyoon.registerform.entities.RegisterContactCodeEntity;
import dev.shyoon.registerform.enums.SendRegisterContactCodeResult;
import dev.shyoon.registerform.enums.VerifyRegisterContactCodeResult;
import dev.shyoon.registerform.services.RegisterService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

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

}
