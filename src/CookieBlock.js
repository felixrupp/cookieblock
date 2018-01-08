'use strict';

require("babel-polyfill");

import GoogleAnalytics from "./modules/analytics/GoogleAnalytics";
import Piwik from "./modules/analytics/Piwik";
import Facebook from "./modules/social/Facebook";
import Twitter from "./modules/social/Twitter";
import Instagram from "./modules/social/Instagram";
import Pinterest from "./modules/social/Pinterest";

/**
 * CookieBlock
 *
 * @author Felix Rupp <kontakt@felixrupp.com>
 * @copyright Felix Rupp
 * @license MIT
 *
 * @since 1.0.0
 */
export default class CookieBlock {

    /**
     * Constructor
     */
    constructor() {

        this.appOptions = new Map([
            ["respectDoNotTrack", false]
        ]);

        this.pluginOptions = new Map([
            ["googleAnalytics", {active: false, options: []}],
            ["piwik", {active: false, options: []}],
            ["facebook", {active: false, options: []}],
            ["twitter", {active: false, options: []}],
            ["instagram", {active: false, options: []}],
            ["pinterest", {active: false, options: []}]
        ]);

        this.pluginObjects = new Map([
            ["googleAnalytics", {object: new GoogleAnalytics()}],
            ["piwik", {object: new Piwik()}],
            ["facebook", {object: new Facebook()}],
            ["twitter", {object: new Twitter()}],
            ["instagram", {object: new Instagram()}],
            ["pinterest", {object: new Pinterest()}]
        ]);
    }

    /**
     * Init
     */
    init() {

        let cookieValue = this.getCookieBlockCookie();

        console.log("Initial Cookie Values:");
        console.log(cookieValue);

        // Init the cookie values with default options
        if (cookieValue === null) {

            console.log("Manage DNT before Cookie:");
            console.log(this.manageDoNotTrack());

            console.log("Default Plugin Options:");
            console.log(this.pluginOptions);

            this.setCookieBlockCookie(this.pluginOptions);
        }
        else {
            this.pluginOptions = cookieValue;

            console.log("Manage DNT after Cookie:");
            console.log(this.manageDoNotTrack());
            this.setCookieBlockCookie(this.pluginOptions);
        }

        console.log("Cookie/Plugin Values:");
        console.log(this.getCookieBlockCookie());

        // Block all active modules initially
        this.pluginOptions.forEach((options, moduleId) => {

            this.manageCookie(moduleId)
        });
    }

    /**
     * Set Cookie
     * @param pluginOptions
     * @param days
     */
    setCookieBlockCookie(pluginOptions, days = 36500) {

        let expires;

        if (days) {

            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {

            expires = "";
        }

        document.cookie = encodeURIComponent('CookieBlock') + "=" + encodeURIComponent(JSON.stringify(pluginOptions)) + expires + "; path=/";
    }

    /**
     * Get Cookie
     * @returns {*}
     */
    getCookieBlockCookie() {

        let nameEQ = encodeURIComponent('CookieBlock') + "=";
        let ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {

            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);

            if (c.indexOf(nameEQ) === 0) {

                return new Map(JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length))));
            }
        }
        return null;
    }

    /**
     * Erase the Cookie
     */
    eraseCookieBlockCookie() {

        this.setCookieBlockCookie("", -1);
    }

    /**
     * Disable one module
     *
     * @param moduleId
     */
    disableModule(moduleId) {

        let moduleOptions = this.pluginOptions.get(moduleId);
        let moduleObject = this.pluginObjects.get(moduleId);

        moduleOptions.active = false;

        moduleObject.object.unblock();
        this.pluginOptions.set(moduleId, moduleOptions);
        this.setCookieBlockCookie(this.pluginOptions);
    }

    /**
     * Disable one module
     *
     * @param moduleId
     */
    enableModule(moduleId) {

        let moduleOptions = this.pluginOptions.get(moduleId);
        let moduleObject = this.pluginObjects.get(moduleId);

        moduleOptions.active = true;

        moduleObject.object.block();
        this.pluginOptions.set(moduleId, moduleObject);
        this.setCookieBlockCookie(this.pluginOptions);
    }

    /**
     * Set moduleOptions
     * @param moduleId
     * @param options
     */
    setModuleOptions(moduleId, options) {

        let moduleObject = this.pluginObjects.get(moduleId);
        moduleObject.object.setClassOptions(options);

        let moduleOptions = this.pluginOptions.get(moduleId);
        moduleOptions.options = options;
        this.pluginOptions.set(moduleId, moduleOptions);
        this.setCookieBlockCookie(this.pluginOptions);
    }

    /**
     * Manage single cookie
     * @param moduleId
     */
    manageCookie(moduleId) {

        let moduleOptions = this.pluginOptions.get(moduleId);
        let moduleObject = this.pluginObjects.get(moduleId);

        if (moduleOptions.active) {

            console.log("Block Module: " + moduleId);

            moduleObject.object.block();
        }
        else {

            console.log("Unblock Module: " + moduleId);

            moduleObject.object.unblock();
        }
    }

    /**
     * Manage the DNT flag in browsers
     * @returns {boolean}
     */
    manageDoNotTrack() {

        if (this.appOptions.get("respectDoNotTrack")) {

            let hasDNT = false;
            let ie9DNT = false;
            let ie10DNT = false;

            if(window.navigator.doNotTrack !== undefined && window.navigator.doNotTrack !== null) {

                hasDNT = window.navigator.doNotTrack;

                console.log(hasDNT);
            }

            if ('external' in window) {

                let ie9DNT = (window.external.InPrivateFilteringEnabled !== undefined) ? window.external.InPrivateFilteringEnabled() : false;
                let ie10DNT = (window.external.msTrackingProtectionEnabled !== undefined) ? window.external.msTrackingProtectionEnabled() : false;

                console.log(ie9DNT + ie10DNT);
            }

            if (hasDNT || ie9DNT || ie10DNT) {

                console.log("DNT is enabled");

                // Activate all modules initially
                this.pluginOptions.forEach((options, moduleId) => {

                    options.active = true;

                    //this.manageCookie(moduleId)
                });

                return true;
            }

        }

        console.log("DNT is false");
        return false;
    }

    /**
     * Set app option
     * @param optionKey
     * @param optionValue
     */
    setAppOption(optionKey, optionValue) {

        this.appOptions.set(optionKey, optionValue);
    }

    /**
     * Call a function based on a string literal without use of eval
     * @param name
     * @param params
     * @deprecated
     */
    callFunction(name, params = []) {

        // find object
        let fn = window[name];

        // is object a function?
        if (typeof fn === "function") fn.apply(null, params);
    }
}