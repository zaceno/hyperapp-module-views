!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).moduleViews=e()}}(function(){return function e(n,r,o){function t(f,u){if(!r[f]){if(!n[f]){var d="function"==typeof require&&require;if(!u&&d)return d(f,!0);if(i)return i(f,!0);var c=new Error("Cannot find module '"+f+"'");throw c.code="MODULE_NOT_FOUND",c}var l=r[f]={exports:{}};n[f][0].call(l.exports,function(e){var r=n[f][1][e];return t(r||e)},l,l.exports,e,n,r,o)}return r[f].exports}for(var i="function"==typeof require&&require,f=0;f<o.length;f++)t(o[f]);return t}({1:[function(e,n,r){n.exports=function(e){function n(e,n,r,o){return function(t,i){return o(e,n,r,t,i)}}function r(e,o,t){var i={};for(var f in t.modules||{})i[f]=r(e[f],o[f],t.modules[f]);for(var u in t.views||{})i[u]=n(e,o,i,t.views[u]);return i}return function(n){var o=n.view;return o&&(n.view=function(e,t){return o(e,t,r(e,t,n))}),e(n)}}},{}]},{},[1])(1)});
