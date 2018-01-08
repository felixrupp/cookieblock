'use strict';

import AbstractBlockModule from "../AbstractBlockModule";

/**
 * Google Analytics module
 *
 * @author Felix Rupp <kontakt@felixrupp.com>
 * @copyright Felix Rupp
 * @license MIT
 *
 * @since 1.0.0
 */
export default class GoogleAnalytics extends AbstractBlockModule {

    constructor(options = {}) {

        super(options);

        console.log("GA Module initialized.");
        //this.classOptions = options;
    }

    block() {

        console.log("Attempt to Block Google Analytics with Options:");
        console.log(this.classOptions);

        if (this.classOptions instanceof Object && this.classOptions.propertyId !== undefined) {

            console.log("Blocking Google Analytics");
            window['ga-disable-UA-' + this.classOptions.propertyId] = true;
        }
        else {

            console.log("Not Blocking Google Analytics, no propertyId.");
        }
    }

    unblock() {

        if (this.classOptions instanceof Array && this.classOptions.propertyId !== undefined) {
            console.log("Unblocking Google Analytics");
            window['ga-disable-UA-' + this.classOptions.propertyId] = false;
        }
        else {

            console.log("Not Unblocking Google Analytics, no propertyId.");
        }
    }
}