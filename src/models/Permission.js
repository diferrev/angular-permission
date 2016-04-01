(function () {
  'use strict';

  angular
    .module('permission')
    .factory('Permission',
      /**
       * Permission definition factory
       * @class PermissionFactory
       * @memberOf permission
       *
       * @param $q {$q} Angular promise implementation
       * @param TransitionProperties {permission.TransitionProperties} Helper storing ui-router transition parameters
       *
       * @return {permission.Permission}
       */
      function ($q, TransitionProperties) {

        /**
         * Permission definition object constructor
         * @constructor Permission
         * @memberOf permission
         *
         * @param permissionName {String} Name repressing permission
         * @param validationFunction {Function} Function used to check if permission is valid
         */
        function Permission(permissionName, validationFunction) {
          validateConstructor(permissionName, validationFunction);

          this.permissionName = permissionName;
          this.validationFunction = validationFunction;
        }

        /**
         * Checks if permission is still valid
         * @method
         *
         * @returns {Promise}
         */
        Permission.prototype.validatePermission = function () {
          var transitionProperties = TransitionProperties.get();
          var validationResult = this.validationFunction.call(null, this.permissionName, transitionProperties);

          if (!angular.isFunction(validationResult.then)) {
            validationResult = wrapInPromise(validationResult, this.permissionName);
          }

          return validationResult;
        };

        /**
         * Converts a value into a promise, if the value is truthy it resolves it, otherwise it rejects it
         * @method
         * @private
         *
         * @param result {Boolean} Function to be wrapped into promise
         * @param permissionName {String} Returned value in promise
         * @return {Promise}
         */
        function wrapInPromise(result, permissionName) {
          var dfd = $q.defer();

          if (result) {
            dfd.resolve(permissionName);
          } else {
            dfd.reject(permissionName);
          }

          return dfd.promise;
        }

        /**
         * Checks if provided permission has accepted parameter types
         * @method
         * @private
         * @throws {TypeError}
         */
        function validateConstructor(permissionName, validationFunction) {
          if (!angular.isString(permissionName)) {
            throw new TypeError('Parameter "permissionName" name must be String');
          }
          if (!angular.isFunction(validationFunction)) {
            throw new TypeError('Parameter "validationFunction" must be Function');
          }
        }

        return Permission;
      });
}());