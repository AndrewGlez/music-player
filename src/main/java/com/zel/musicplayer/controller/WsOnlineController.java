package com.zel.musicplayer.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WsOnlineController {

    @MessageMapping("/end1")
    @SendTo("/topic/online")
    public String getMessage(String message){
        return message;
    }
}
