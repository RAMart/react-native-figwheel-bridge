var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _react=_interopRequireWildcard(require("react"));var _jsxFileName="/Users/bhauman/workspace/figwheel/react-native-figwheel-bridge/figwheel-bridge.js";var ReactNative=require('react-native');var cljsBootstrap=require("./clojurescript-bootstrap.js");function assert(predVal,message){if(!predVal){throw new Error(message);}}function assertKeyType(obj,k,type){assert(typeof obj[k]==type,k+" must be a "+type);}function validateOptions(options){assertKeyType(options,"autoRefresh","boolean");assertKeyType(options,"renderFn","string");if(options.optionsUrl){assertKeyType(options,"optionsUrl","string");}else{assert(options["asset-path"],"must provide an asset-path option when no cljscOptionsUrl is provided");assert(options["main"],"must provide a main option when no cljscOptionsUrl is provided");assertKeyType(options,"asset-path","string");assertKeyType(options,"main","string");if(options.preloads){assertKeyType(options,"preloads","string");}if(options["closure-defines"]){assertKeyType(options,"closure-defines","string");}}}function provideDefaultsAndValidateConfig(options){var config=(0,_extends2.default)({renderFn:'figwheel_rn_root',autoRefresh:true},options);validateOptions(config);return config;}function cljsNamespaceToObject(ns){return ns.replace(/\-/,"_").split(/\./).reduce(function(base,arg){return base?base[arg]:base;},goog.global);}function listenForReload(cb){if(cljsNamespaceToObject("figwheel.core.event_target")){figwheel.core.event_target.addEventListener("figwheel.after-load",cb);}}function FigwheelBridge(props){var _useState=(0,_react.useState)({loaded:false,root:null}),_useState2=(0,_slicedToArray2.default)(_useState,2),state=_useState2[0],updateState=_useState2[1];var _useReducer=(0,_react.useReducer)(function(accum,data){return accum+data;},0),_useReducer2=(0,_slicedToArray2.default)(_useReducer,2),updateReload=_useReducer2[1];(0,_react.useEffect)(function(){var refresh=function refresh(e){console.log("Refreshing Figwheel Root Element");updateReload(1);};if(!state.loaded&&typeof goog==="undefined"){loadApp(props.config,function(appRoot){goog.figwheelBridgeRefresh=refresh;updateState({loaded:true,root:appRoot});if(props.config.autoRefresh){listenForReload(refresh);}});}},[]);if(!state.root){var plainStyle={flex:1,alignItems:'center',justifyContent:'center'};return _react.default.createElement(ReactNative.View,{style:plainStyle,__source:{fileName:_jsxFileName,lineNumber:76}},_react.default.createElement(ReactNative.Text,{__source:{fileName:_jsxFileName,lineNumber:77}},"Waiting for Figwheel to load files."));}return state.root();}var createBridgeComponent=function createBridgeComponent(config){var config=provideDefaultsAndValidateConfig(config);return function(){return _react.default.createElement(FigwheelBridge,{config:config});};};function isChrome(){return typeof importScripts==="function";}var hostnameRegexp=/([^:]+:\/\/)([^:]+)(:.+)/;function editHostname(url,hostname){var parts=hostnameRegexp.exec(url);return[parts[1],hostname,parts[3]].join("");}function correctUrl(url){if(isChrome()){return editHostname(url,"127.0.0.1");}else{return url;}}function loadApp(config,onLoadCb){var confProm;if(config.optionsUrl){confProm=cljsBootstrap.fetchConfig(correctUrl(config.optionsUrl)).then(function(conf){return(0,_extends2.default)(conf,config);}).catch(function(err){throw new Error("Figwheel Bridge Unable to fetch optionsUrl: "+config.optionsUrl,err);});}else{confProm=Promise.resolve(config);}if(confProm){confProm.then(cljsBootstrap.bootstrap).then(function(conf){var mainNsObject=cljsNamespaceToObject(conf.main);assert(mainNsObject,"ClojureScript Namespace "+conf.main+" not found.");assert(mainNsObject[config.renderFn],"Render function "+config.renderFn+" not found.");onLoadCb(function(){return mainNsObject[config.renderFn]();});}).catch(function(err){console.error(err);});}}function shimRequire(requireMap){var oldRequire=window.require;window.require=function(id){var ret;if(ret=requireMap[id]){return ret;}if(oldRequire){return oldRequire(id);}};}function startApp(options){assert(options.appName,"must provide an appName");assertKeyType(options,"appName","string");ReactNative.AppRegistry.registerComponent(options.appName,function(){return createBridgeComponent(options);});}module.exports={shimRequire:shimRequire,start:startApp,createBridgeComponent:createBridgeComponent};

