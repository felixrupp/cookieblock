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
            ["googleAnalytics", {active: false, options: {propertyId: ''}}],
            ["piwik", {active: false, options: {url: ''}}],
            ["facebook", {active: false, options: {}}],
            ["twitter", {active: false, options: {}}],
            ["instagram", {active: false, options: {}}],
            ["pinterest", {active: false, options: {}}]
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

        console.log("Initial Plugin Options:");
        console.log(this.pluginOptions);

        let cookieValue = this.getCookieBlockCookie();

        console.log("Initial Cookie Values:");
        console.log(this.getCookieBlockCookie());

        // Init the cookie values with default options
        if (cookieValue === null) {

            console.log("Manage DNT before Cookie:");
            let dntActive = this.manageDoNotTrack();
            console.log(dntActive);

            console.log("Set Default Plugin Options to Cookie:");
            console.log(this.pluginOptions);

            this.setCookieBlockCookie(this.pluginOptions);
        }
        else {

            this.pluginOptions = cookieValue;

            console.log("Plugin Values before DNT Manage:");
            console.log(this.pluginOptions);

            console.log("Manage DNT after Cookie:");
            /*let dntActive = */this.manageDoNotTrack();
            //console.log(dntActive);

            console.log("Plugin Values after DNT Manage:");
            console.log(this.pluginOptions);

            // Overwrite the pluginOptions with disabled values:
            /*if (dntActive) {

                // Block all active modules initially
                this.pluginOptions.forEach((options, moduleId) => {

                    this.manageCookie(moduleId)
                });
                this.setCookieBlockCookie(this.pluginOptions);
            }
            */

            this.setCookieBlockCookie(this.pluginOptions);
        }

        console.log("Cookie Values:");
        console.log(this.getCookieBlockCookie());
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

        // Save options for cookie
        let moduleOptions = this.pluginOptions.get(moduleId);
        moduleOptions.active = false;
        this.pluginOptions.set(moduleId, moduleOptions);
        this.setCookieBlockCookie(this.pluginOptions);

        // Set the object settings and disable blocking
        let moduleObject = this.pluginObjects.get(moduleId);
        moduleObject.object.unblock();
    }

    /**
     * Disable one module
     *
     * @param moduleId
     * @param classOptions
     */
    enableModule(moduleId, classOptions = {}) {

        // Save options for cookie
        let moduleOptions = this.pluginOptions.get(moduleId);
        moduleOptions.active = true;
        moduleOptions.options = classOptions;
        this.pluginOptions.set(moduleId, moduleOptions);
        this.setCookieBlockCookie(this.pluginOptions);

        // Set the object settings and enable blocking
        let moduleObject = this.pluginObjects.get(moduleId);
        moduleObject.object.setClassOptions(classOptions);
        moduleObject.object.block();
        this.pluginObjects.set(moduleId, moduleObject);
    }

    /**
     * Set moduleOptions
     * @param moduleId
     * @param classOptions
     */
    setModuleOptions(moduleId, classOptions) {

        // Save options for cookie
        let moduleOptions = this.pluginOptions.get(moduleId);
        moduleOptions.options = classOptions;
        this.pluginOptions.set(moduleId, moduleOptions);
        this.setCookieBlockCookie(this.pluginOptions);

        // Set the object settings
        let moduleObject = this.pluginObjects.get(moduleId);
        moduleObject.object.setClassOptions(classOptions);
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

            if (window.navigator.doNotTrack) {

                hasDNT = window.navigator.doNotTrack;

                console.log(hasDNT);
            }

            if ('external' in window) {

                let ie9DNT = (window.external.InPrivateFilteringEnabled !== undefined) ? window.external.InPrivateFilteringEnabled() : false;
                let ie10DNT = (window.external.msTrackingProtectionEnabled !== undefined) ? window.external.msTrackingProtectionEnabled() : false;

                console.log(ie9DNT + ie10DNT);
            }

            if (hasDNT || ie9DNT || ie10DNT) {

                let alreadyActive = false;

                // Activate all modules initially
                this.pluginOptions.forEach((options, moduleId) => {

                    if (options.active) alreadyActive = true;
                });

                if (!alreadyActive) {

                    this.pluginOptions.forEach((options, moduleId) => {

                        options.active = true;
                    });
                }

                // also set a Content Security Policy meta tag to prevent the loading of external js sources
                let meta = document.createElement('meta');
                meta.httpEquiv = "Content-Security-Policy";
                meta.content = "script-src 'self'";
                document.getElementsByTagName('head')[0].insertBefore(meta, document.getElementsByTagName('head')[0].firstChild);

                console.log("DNT is being respected and active.");
                return true;
            }
            else {
                console.log("DNT is being respected, but not active.");
            }
        }
        else {
            console.log("DNT is not being respected.");
        }

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
     * Get app option
     * @param optionKey
     */
    getAppOption(optionKey) {

        return this.appOptions.get(optionKey);
    }

    /**
     * Get all app options
     * @returns {Map}
     */
    getAppOptions() {

        return this.appOptions;
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