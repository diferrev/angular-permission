describe('permission.ui', function () {
  'use strict';
  describe('authorization', function () {

    describe('factory: StatePermissionMap', function () {

      var PermStatePermissionMap;
      var PermTransitionProperties;

      beforeEach(function () {
        module('permission.ui');

        inject(function ($injector) {
          PermStatePermissionMap = $injector.get('PermStatePermissionMap');
          PermTransitionProperties = $injector.get('PermTransitionProperties');
        });
      });

      describe('method: constructor', function () {
        it('should build map including permissions inherited from parent states', function () {
          // GIVEN
          var state = jasmine.createSpyObj('state', ['$$permissionState']);
          state.$$permissionState.and.callFake(function () {
            var parent = {permissions: {only: ['accepted'], except: ['denied']}};
            var child = Object.create(parent);
            child.permissions = {only: ['acceptedChild'], except: ['deniedChild']};

            return {
              path: [
                {data: child},
                {data: parent}
              ]
            };
          });

          // WHEN
          var map = new PermStatePermissionMap(state);

          // THEN
          expect(map.only).toEqual([['acceptedChild'], ['accepted']]);
          expect(map.except).toEqual([['deniedChild'], ['denied']]);
          expect(map.redirectTo).not.toBeDefined();
        });

        it('should not duplicate parent state inheritance if childs dont have permissions', function () {
          // GIVEN
          var state = jasmine.createSpyObj('state', ['$$permissionState']);
          state.$$permissionState.and.callFake(function () {
            var grandparent = {permissions: {only: ['accepted'], except: ['denied']}};
            var parent = Object.create(grandparent);
            parent.permissions = {
              only: ['acceptedChild'],
              except: ['deniedChild']
            };
            var child = Object.create(parent);

            return {
              path: [
                {data: child},
                {data: parent},
                {data: grandparent}
              ]
            };
          });

          // WHEN
          var map = new PermStatePermissionMap(state);

          // THEN
          expect(map.only).toEqual([['acceptedChild'], ['accepted']]);
          expect(map.except).toEqual([['deniedChild'], ['denied']]);
          expect(map.redirectTo).not.toBeDefined();
        });
      });
    });
  });
});