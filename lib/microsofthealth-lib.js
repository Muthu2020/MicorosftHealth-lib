 
// This is a Javascript library that can be used to communicate with the Microsoft Health Cloud API
// directly using CORS. This library allows you to get an access token from MSA and then query the API

/// options supports the following parameters:
///     clientId - your client id as registered in https://account.live.com/developers/applications/index
///     scope - a space separated list of permissions to request to the user, the supported values are
///             mshealth.ReadProfile mshealth.ReadDevices mshealth.ReadActivityHistory mshealth.ReadActivityLocation
///             for an updated list of scopes please visit http://developer.microsofthealth.com
///     redirectUri - the redirect uri registered in MSA

(function (global) {
  'use strict';

  var loginUrl, clientId, scope, redirectUri, accessToken, authHeader, apiTemplateUrl, Promise, MicrosoftHealth,state,data;
  var request = require('request');

  loginUrl = 'https://login.live.com/oauth20_authorize.srf?client_id={client_id}&scope={scope}&response_type=code&redirect_uri={redirect_uri}&state={state}';
  accessToken = '';
  authHeader = 'Bearer {access_token}';
  apiTemplateUrl = 'https://api.microsofthealth.net/v1/me/{path}?{parameters}';

  MicrosoftHealth = function (options) {
    clientId = options.clientId;
    scope = options.scope;
    redirectUri = options.redirectUri;
    state = options.state;
  };
  
  global.MicrosoftHealth = MicrosoftHealth;
  module.exports = MicrosoftHealth;

  function getParameters(parameters) {
    var queryParameters, p;

    queryParameters = '';

    if (parameters) {
      for (p in parameters) {
        if (parameters[p]) {
          queryParameters = queryParameters.concat(encodeURI(p) + '=' + encodeURI(parameters[p]) + '&');
        }
      }
    }
    return queryParameters.substring(0, queryParameters.length - 1);
  }


  function query(options) {
    var url,queryParameters;
    if (!accessToken) {
      throw 'User is not authenticated, call login function first';
    }

    queryParameters = options.parameters;
    queryParameters = getParameters(queryParameters);
    url = apiTemplateUrl.replace('{path}', options.path).replace('{parameters}', queryParameters);

    request.get({
      url: url,
      headers:{
        Authorization : authHeader.replace('{access_token}', accessToken)
      }
    },function(err,response,body){
      if(err){
        console.log(err);
      }
      data = body;
    });
   return data;
  }


  MicrosoftHealth.prototype.login = function () {
    var url;
    url = loginUrl.replace('{client_id}', clientId).replace('{scope}', scope).replace('{redirect_uri}', encodeURIComponent(redirectUri)).replace('{state}',state);
    return url;
  };


  MicrosoftHealth.prototype.getProfile = function (options, callback) {
    accessToken = options.accessToken;
    var result = query({
      path: 'Profile',
      method: 'GET'
    });
    return callback(null, result);
  };

  MicrosoftHealth.prototype.getSummaries = function (options,callback) {
    accessToken = options.accessToken;

    if (!options || !options.period) {
      throw 'A period is required to call the summaries API';
    }

     var result = query({
      path: 'Summaries/' + options.period,
      method: "GET",
      parameters: {
        startTime: options.startTime,
        endTime: options.endTime,
        deviceIds: options.deviceIds,
        maxPageSize: options.maxPageSize
      }
    });
     return callback(null,result);
  };

  MicrosoftHealth.prototype.getActivities = function (options, callback) {
    accessToken = options.accessToken;
    var result = query({
      path: 'Activities',
      method: 'GET',
      parameters: {
        activityIds: options.activityIds,
        activityTypes: options.activityTypes,
        activityIncludes: options.activityIncludes,
        splitDistanceType: options.splitDistanceType,
        startTime: options.startTime,
        endTime: options.endTime,
        deviceIds: options.deviceIds,
        maxPageSize: options.maxPageSize
      }
    });
    return callback(null,result);
  };

  MicrosoftHealth.prototype.getDevices = function (options , callback) {
	accessToken = options.accessToken;  
    var path = options.deviceId ? 'Devices/' + encodeURIComponent(options.deviceId) : 'Devices';

    var result = query({
      path: path,
      method: "GET"
    });
    
    return callback(null, result);
  };

  MicrosoftHealth.prototype.logout = function () {
    var logoutUrl;
    logoutUrl = "https://login.live.com/oauth20_logout.srf?client_id="+ clientId + "&redirect_uri="+ redirectUri;
    return logoutUrl;
  };

  Promise = function () { };

  Promise.prototype.then = function (onResolved, onRejected) {
    this.onResolved = onResolved;
    this.onRejected = onRejected;
  };

  Promise.prototype.resolve = function (value) {
    this.onResolved(value);
  };

  Promise.prototype.reject = function (value) {
    this.onRejected(value);
  };

})(this);
