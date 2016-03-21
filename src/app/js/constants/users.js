(function(){
'use strict';

var users = [
    {
        username: 'admin',
        password: 'password123'
    },
    {
        username: 'Tesla',
        password: 'teslarocks!'
    }
];

angular.module('teslaBase')
    .constant('TESLA_USERS', users)
;

}());