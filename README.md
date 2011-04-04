Gameroom
========================

This is the main project for all Gameroom operations software.

Installation
============

First run Bundler and ensure your gems have installed correctly:

  $ sudo bundle install

The following rake tasks should be run for the software to run properly:

  $ rake db:migrate
  $ rake db:test:prepare
  $ rake db:seed

Then when you need to rebuild the database during development run:

  $ rake db:reset
  
Javascript
==========
  
All non-framework javascript is located in the 'app/javascripts/' directory. To compile the javascript run:

  $ rake javascript:concatenate
  
or...

  $ rake javascript:minify
  
Tests
=====

To run all tests run:

  $ rake spec