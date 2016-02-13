<?php

use Framework\Routing\Routes;

/**
 * Application routes.
 *
 * Here you can register the routes for the application.
 */

Routes::get('/', 'home', 'Home@index');

//User
Routes::any('register', 'doRegistration', 'Home@doRegistration');
Routes::any('login', 'doLogin', 'Home@login');
Routes::any('logout', 'doLogout', 'Home@logout');

//Map
Routes::any('addNewObject', 'newObject', 'Map@create');
Routes::any('editObject', 'editObject', 'Map@edit');
