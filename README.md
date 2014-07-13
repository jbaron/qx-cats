Introduction
============

This is a small proof of concept to see if Qooxdoo could be used for CATS as a UI framework. So it 
mimics the current CATS layout and functionality using Qooxdoo widgets. Some of the things being tested:

1) Are the different Qooxdoo widgets (tree, tabview, toolbar etc) a good fit for CATS
2) How does TypeScript and Qooxdoo work together
3) Would it speed up the development of CATS


How to get started
==================

Used go to the qx-cats directory and type:

    node-webkit ./
    
(or nw ./ based on your OS)    
    

Developing
===========
All the TypeScript source files and declaration files are in the src directory. The file application.ts is where it all starts.
The output file (main.js) is located in the script directory together with the Qooxdoo file (base.js). 
Finally the resource diectory contains the icons etc for various Qooxdoo themes. 

If you use the CATS editor (https://https://github.com/jbaron/cats), everything will be setup correctly to develop and test.

