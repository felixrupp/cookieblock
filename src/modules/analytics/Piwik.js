'use strict';

import AbstractBlockModule from "../AbstractBlockModule";

/**
 * Piwik module
 *
 * @author Felix Rupp <kontakt@felixrupp.com>
 * @copyright Felix Rupp
 * @license MIT
 *
 * @since 1.0.0
 */
export default class Piwik extends AbstractBlockModule {


    constructor(options = {}) {

        super(options);

        console.log("Piwik Module initialized.");
    }

    block() {

        console.log("Attempt to Block Piwik with Options:");
        console.log(this.classOptions);

        if (this.classOptions instanceof Object && this.classOptions.url !== undefined) {

            console.log("Blocking Piwik");

            let url = this.classOptions.url;

            let script = document.createElement('script');
            script.src = url+'/index.php?module=API&method=AjaxOptOut.doIgnore&format=json';

            document.getElementsByTagName('head')[0].appendChild(script);
            // or document.head.appendChild(script) in modern browsers


            /*let iframe = '<iframe class="cookieBlock-piwikOptOut" style="border: 0; height: 200px; width: 600px;" src="' + this.classOptions[0] + '/index.php?module=CoreAdminHome&action=optOut&language=de"> </iframe>'

            let iframeNode = this.setHtmlToElement(iframe);

            console.log(iframeNode);

            window.addEventListener("DOMContentLoaded", function() {

                document.body.appendChild(iframeNode);
            }, false);
               */
        }
        else {

            console.log("Not Blocking Piwik, no URL.");
        }
    }

    unblock() {

        if (this.classOptions instanceof Array && this.classOptions.url !== undefined) {

            console.log("Unblocking Piwik");

            let url = this.classOptions.url;

            let script = document.createElement('script');
            script.src = url+'/index.php?module=API&method=AjaxOptOut.doTrack&format=json';

            document.getElementsByTagName('head')[0].appendChild(script);
            // or document.head.appendChild(script) in modern browsers

            /*let iFrames = document.getElementsByClassName("cookieBlock-piwikOptOut");

            for (let iFrame of iFrames) {

                document.body.removeChild(iFrame);
            }*/
        }
        else {

            console.log("Not Unblocking Piwik, no URL.");
        }
    }

    /**
     * Creates a Node element from simple html string
     * DO NOT USE THIS METHOD. IT IS DEPRECATED.
     * @param {String} html representing a single element
     * @return {*}
     * @deprecated
     */
    setHtmlToElement(html) {

        let template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
}
