'use strict';

/**
 * Abstract Block Module
 *
 * @author Felix Rupp <kontakt@felixrupp.com>
 * @copyright Felix Rupp
 * @license MIT
 *
 * @since 1.0.0
 */
export default class AbstractBlockModule {

    constructor(options = []) {
        this.classOptions = options;
    }

    block() {}

    unblock() {}

    /**
     * Set Class Options
     * @param options
     */
    setClassOptions(options) {

        console.log("New Module Options for module:");
        console.log(options);
        this.classOptions = options;
        //this.block();
    }

    /**
     * Getter for classOptions
     */
    getClassOptions() {

        return this.classOptions;
    }
}