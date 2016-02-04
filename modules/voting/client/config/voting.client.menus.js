'use strict';

// Configuring the User module
angular.module('voting').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Scripts',
            state: 'voting.scripts',
            roles: ['admin']
        });
    }
]);
