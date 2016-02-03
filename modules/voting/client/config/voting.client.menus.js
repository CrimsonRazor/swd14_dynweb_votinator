'use strict';

// Configuring the User module
angular.module('voting').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Scripts',
            state: 'voting',
            type: 'dropdown',
            roles: ['admin']
        });
        Menus.addSubMenuItem('topbar', 'voting', {
            title: 'Unapproved',
            state: 'voting.scripts',
            roles: ['admin']
        });
    }
]);
