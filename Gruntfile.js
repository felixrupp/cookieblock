/* globals module */
(function () {
    'use strict';

    const webpackConfig = require('./webpack.config');

    module.exports = function (grunt) {

        grunt.initConfig({
            dirs: {
                tmp: '.tmp',
                dest: 'dist',
                src: 'src'
            },
            webpack: {
                options: {
                    stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                },
                prod: webpackConfig,
                dev: Object.assign({watch: false}, webpackConfig)
            },
            uglify: {
                options: {
                    mangle: false,
                    beautify: true,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    preserveComments: /Copyright|MIT|License/
                },
                theme: {
                    files: {
                        '<%= dirs.dest %>/CookieBlock.min.js': [
                            '<%= dirs.tmp %>/CookieBlock.js'
                        ]
                    }
                },
                vendorjs: {
                    files: {
                        '<%= dirs.dest %>/vendor.min.js': [

                        ]
                    }
                }
            },
            clean: {
                tmp: {
                    src: ['<%= dirs.tmp %>']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-bower-main');
        grunt.loadNpmTasks('grunt-webpack');

        grunt.registerTask('default', ['build']);

        grunt.registerTask('build', [
            'transpile',
            'uglify',
            'clean:tmp'
        ]);

        grunt.registerTask('transpile', [
            'webpack'
        ]);
    };
}());
