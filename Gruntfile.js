module.exports = function( grunt ) {
	'use strict';

	var remapify = require( 'remapify' ),
		pkgInfo = grunt.file.readJSON( 'package.json' );

	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("dd-mm-yyyy") %> */',

		checktextdomain: {
			standard: {
				options:{
					text_domain: 'elementor',
					correct_domain: true,
					keywords: [
						// WordPress keywords
						'__:1,2d',
						'_e:1,2d',
						'_x:1,2c,3d',
						'esc_html__:1,2d',
						'esc_html_e:1,2d',
						'esc_html_x:1,2c,3d',
						'esc_attr__:1,2d',
						'esc_attr_e:1,2d',
						'esc_attr_x:1,2c,3d',
						'_ex:1,2c,3d',
						'_n:1,2,4d',
						'_nx:1,2,4c,5d',
						'_n_noop:1,2,3d',
						'_nx_noop:1,2,3c,4d'
					]
				},
				files: [ {
					src: [
						'**/*.php',
						'!node_modules/**',
						'!build/**',
						'!tests/**',
						'!vendor/**',
						'!*~'
					],
					expand: true
				} ]
			}
		},

		sass: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'assets/dev/scss/direction',
					src: '*.scss',
					dest: 'assets/css',
					ext: '.css'
				} ]
			}
		},

		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				},
				preBundleCB: function( bundle ) {
					bundle.plugin( remapify, [
						{
							cwd: 'assets/dev/js/editor/behaviors',
							src: '**/*.js',
							expose: 'elementor-behaviors'
						},
						{
							cwd: 'assets/dev/js/editor/layouts',
							src: '**/*.js',
							expose: 'elementor-layouts'
						},
						{
							cwd: 'assets/dev/js/editor/models',
							src: '**/*.js',
							expose: 'elementor-models'
						},
						{
							cwd: 'assets/dev/js/editor/collections',
							src: '**/*.js',
							expose: 'elementor-collections'
						},
						{
							cwd: 'assets/dev/js/editor/views',
							src: '**/*.js',
							expose: 'elementor-views'
						},
						{
							cwd: 'assets/dev/js/editor/components',
							src: '**/*.js',
							expose: 'elementor-components'
						},
						{
							cwd: 'assets/dev/js/editor/utils',
							src: '**/*.js',
							expose: 'elementor-utils'
						},
						{
							cwd: 'assets/dev/js/editor/layouts/panel',
							src: '**/*.js',
							expose: 'elementor-panel'
						},
						{
							cwd: 'assets/dev/js/editor/components/template-library',
							src: '**/*.js',
							expose: 'elementor-templates'
						}
					] );
				}
			},

			dist: {
				files: {
					'assets/js/editor.js': [ 'assets/dev/js/editor/editor.js' ],
					'assets/js/admin.js': [ 'assets/dev/js/admin/admin.js' ],
					'assets/js/admin-feedback.js': [ 'assets/dev/js/admin/admin-feedback.js' ],
					'assets/js/frontend.js': [ 'assets/dev/js/frontend/frontend.js' ]
				},
				options: pkgInfo.browserify
			}

		},

		// Extract sourcemap to separate file
		exorcise: {
			bundle: {
				options: {},
				files: {
					'assets/js/editor.js.map': [ 'assets/js/editor.js' ],
					'assets/js/admin.js.map': [ 'assets/js/admin.js' ],
					'assets/js/admin-feedback.js.map': [ 'assets/js/admin-feedback.js' ],
					'assets/js/frontend.js.map': [ 'assets/js/frontend.js' ]
				}
			}
		},

		uglify: {
			//pkg: grunt.file.readJSON( 'package.json' ),
			options: {},
			dist: {
				files: {
					'assets/js/editor.min.js': [
						'assets/js/editor.js'
					],
					'assets/js/admin.min.js': [
						'assets/js/admin.js'
					],
					'assets/js/admin-feedback.min.js': [
						'assets/js/admin-feedback.js'
					],
					'assets/js/frontend.min.js': [
						'assets/js/frontend.js'
					]
				}
			}
		},

		usebanner: {
			dist: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					src: [
						'assets/admin/js/app.min.js',
						'assets/js/admin.min.js',
						'assets/js/admin-feedback.min.js',
						'assets/js/frontend.min.js'
					]
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'assets/js/dev/**/*.js'
			]
		},

		postcss: {
			dev: {
				options: {
					map: true,

					processors: [
						require( 'autoprefixer' )( {
							browsers: 'last 2 versions'
						} )
					]
				},
				files: [ {
					src: [
						'assets/css/*.css',
						'!assets/css/*.min.css'
					]
				} ]
			},
			minify: {
				options: {
					processors: [
						require( 'cssnano' )()
					]
				},
				files: [ {
					expand: true,
					src: [
						'assets/css/*.css',
						'!assets/css/*.min.css'
					],
					ext: '.min.css'
				} ]
			}
		},

		watch:  {
			styles: {
				files: [
					'assets/dev/scss/**/*.scss'
				],
				tasks: ['styles']
			},

			scripts: {
				files: [
					'assets/js/admin.js',
					'assets/js/frontend.js',
					'assets/js/dev/**/*.js',
					'assets/admin/js/dev/**/*.js'
				],
				tasks: [ 'scripts' ]
			}
		},

		wp_readme_to_markdown: {
			github: {
				options: {
					wordpressPluginSlug: 'elementor',
					travisUrlRepo: 'https://travis-ci.org/pojome/elementor',
					gruntDependencyStatusUrl: 'https://david-dm.org/pojome/elementor',
					coverallsRepo: 'pojome/elementor',
					screenshot_url: 'assets/{screenshot}.png'
				},
				files: {
					'README.md': 'readme.txt'
				}
			}
		},

		bumpup: {
			options: {
				updateProps: {
					pkg: 'package.json'
				}
			},
			file: 'package.json'
		},

		replace: {
			plugin_main: {
				src: [ 'elementor.php' ],
				overwrite: true,
				replacements: [
					{
						from: /Version: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
						to: 'Version: <%= pkg.version %>'
					},
					{
						from: /ELEMENTOR_VERSION', '.*?'/g,
						to: 'ELEMENTOR_VERSION\', \'<%= pkg.version %>\''
					}
				]
			},

			readme: {
				src: [ 'readme.txt' ],
				overwrite: true,
				replacements: [
					{
						from: /Stable tag: \d{1,1}\.\d{1,2}\.\d{1,2}/g,
						to: 'Stable tag: <%= pkg.version %>'
					}
				]
			}
		},

		shell: {
			git_add_all: {
				command: [
					'git add --all',
					'git commit -m "Bump to <%= pkg.version %>"'
				].join( '&&' )
			}
		},

		release: {
			options: {
				bump: false,
				npm: false,
				commit: false,
				tagName: 'v<%= version %>',
				commitMessage: 'released v<%= version %>',
				tagMessage: 'Tagged as v<%= version %>'
			}
		},

		copy: {
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!build/**',
					'!bin/**',
					'!.git/**',
					'!tests/**',
					'!.travis.yml',
					'!.jscsrc',
					'!.jshintignore',
					'!.jshintrc',
					'!ruleset.xml',
					'!README.md',
					'!phpunit.xml',
					'!vendor/**',
					'!Gruntfile.js',
					'!package.json',
					'!npm-debug.log',
					'!composer.json',
					'!composer.lock',
					'!.gitignore',
					'!.gitmodules',

					'!assets/admin/js/dev/**',
					'!assets/js/dev/**',
					'!assets/dev/**',
					'!assets/**/*.map',
					'!*~'
				],
				expand: true,
				dest: 'build/'
			}
		},

		clean: {
			//Clean up build folder
			main: [
				'build'
			]
		}
	} );

	// Default task(s).
	grunt.registerTask( 'default', [
		'i18n',
		'wp_readme_to_markdown',
		'scripts',
		'styles'
	] );

	grunt.registerTask( 'i18n', [
		'checktextdomain'
	] );

	grunt.registerTask( 'scripts', [
		'jshint',
		'browserify',
		'exorcise',
		'uglify',
		'usebanner'
	] );

	grunt.registerTask( 'styles', [
		'sass',
		'postcss'
	] );

	grunt.registerTask( 'build', [
		'default',
		'clean',
		'copy'
	] );

	grunt.registerTask( 'publish', [
		'default',
		'bumpup',
		'replace',
		'shell:git_add_all',
		'release'
	] );
};
