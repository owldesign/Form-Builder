# TODO: Delete this file

module.exports = (grunt) ->
  grunt.initConfig

    # =============================================
    # VARIABLES
    # =============================================
    ScssDirectory: 'dev/scss'
    CoffeeDirectory: 'dev/coffee'
    ResourcesDirectory: 'formbuilder/resources'

    # =============================================
    # WATCH FOR CHANGE
    # =============================================
    watch:
      css:
        files: ['<%= ScssDirectory %>/**/*']
        tasks: ['sass']
      scripts:
        files: ['<%= CoffeeDirectory %>/*']
        tasks: ['coffee']
      options:
        livereload: false

    # =============================================
    # SASS COMPILE
    # =============================================
    # https://github.com/gruntjs/grunt-contrib-sass
    # =============================================
    sass:
      compile:
        options:
          compress: false
          sourcemap: 'none' # none, file, inline, none
          style: 'nested' # nested, compact, compressed, expanded
        files: 
          '<%= ResourcesDirectory %>/css/formbuilder.css': '<%= ScssDirectory %>/formbuilder.scss'
          '<%= ResourcesDirectory %>/css/unreadcount.css': '<%= ScssDirectory %>/unreadcount.scss'

    # =============================================
    # COFFEE COMPILING
    # =============================================
    # https://github.com/gruntjs/grunt-contrib-coffee
    # =============================================
    coffee:
      options:
        join: true
        bare: true
      compile:
        files:
          '<%= ResourcesDirectory %>/js/formbuilder.js': ['<%= CoffeeDirectory %>/formbuilder.coffee']
          '<%= ResourcesDirectory %>/js/entries.js': ['<%= CoffeeDirectory %>/entries.coffee']
          '<%= ResourcesDirectory %>/js/ajaxsubmit.js': ['<%= CoffeeDirectory %>/ajaxsubmit.coffee']
          '<%= ResourcesDirectory %>/js/forms.js': ['<%= CoffeeDirectory %>/forms.coffee']
          '<%= ResourcesDirectory %>/js/groups.js': ['<%= CoffeeDirectory %>/groups.coffee']
          '<%= ResourcesDirectory %>/js/dashboard.js': ['<%= CoffeeDirectory %>/dashboard.coffee']
          '<%= ResourcesDirectory %>/js/custom-redirect.js': ['<%= CoffeeDirectory %>/custom-redirect.coffee']
          '<%= ResourcesDirectory %>/js/option.js': ['<%= CoffeeDirectory %>/option.coffee']
          '<%= ResourcesDirectory %>/js/modal.js': ['<%= CoffeeDirectory %>/modal.coffee']
          '<%= ResourcesDirectory %>/js/field-settings.js': ['<%= CoffeeDirectory %>/field-settings.coffee']
          '<%= ResourcesDirectory %>/js/fields.js': ['<%= CoffeeDirectory %>/fields.coffee']
          '<%= ResourcesDirectory %>/js/tags.js': ['<%= CoffeeDirectory %>/tags.coffee']
          '<%= ResourcesDirectory %>/js/editabletable.js': ['<%= CoffeeDirectory %>/editabletable.coffee']

    # =============================================
    # UGLIFY JAVASCRIPT
    # =============================================
    # https://github.com/gruntjs/grunt-contrib-uglify
    # =============================================
    uglify:
      options:
        sourceMap: true
        mangle: false
        beautify: false
        compress: true
      dist:
        files:
          '<%= ResourcesDirectory %>/js/formbuilder.min.js': ['<%= ResourcesDirectory %>/js/formbuilder.js']

    # =============================================
    # LOAD PLUGINS
    # =============================================
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-uglify'

    # =============================================
    # TASKS
    # =============================================
    grunt.registerTask 'default', ['watch']
    grunt.registerTask 'minify', ['uglify']