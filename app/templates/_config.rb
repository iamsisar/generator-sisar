require 'rubygems'
require 'bundler/setup'
require 'sass'
require 'compass'
<% if(multipleGridsSupport){ %> require 'sassy-fractions' <% } %>

preferred_syntax = :scss
http_path = '/'
css_dir = 'css/parts'
sass_dir = 'sass'
images_dir = 'images'
javascripts_dir = 'js/src'
relative_assets = true
line_comments = true
output_style = :compact
sourcemap = true
