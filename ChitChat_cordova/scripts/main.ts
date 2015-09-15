﻿/// <reference path="./typings/tsd.d.ts" />
requirejs.config({
    paths: {
        jquery: '../js/jquery.min',
        cryptojs: '../js/crypto-js/crypto-js'
    }
});

// Directly call the RequireJS require() function and from here
// TypeScript's external module support takes over
//require(["../../scripts/server/serverImplemented"]);

class Main {
    private serverListener = new ChatServer.ServerEventListener();

    constructor() { }

    public startChatServerListener() {
        this.serverListener.addListenner();
    }
}