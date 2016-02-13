<?php

use Framework\Routing\Routes;

/**
 * Application routes.
 *
 * Here you can register the routes for the application.
 */

Routes::get('/', 'home', 'Home@index');

//User
Routes::any('register', 'doRegistration', 'System@doRegistration');
Routes::any('login', 'doLogin', 'System@login');
Routes::any('logout', 'doLogout', 'System@logout');

//Map
Routes::any('map', 'readMap', 'Map@index');
Routes::any('addNewObject', 'newObject', 'Map@create');
Routes::any('editObject', 'editObject', 'Map@edit');
