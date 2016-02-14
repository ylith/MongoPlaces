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
Routes::any('favourite', 'favourite', 'Map@setFavourite');
Routes::any('readFavourites', 'readFavourites', 'Home@getFavourites');
Routes::any('myPlaces', 'myPlaces', 'Home@myPlaces');
Routes::any('filter', 'filterMap', 'Map@filter');
Routes::any('addNewObject', 'newObject', 'Map@create');
Routes::any('editObject', 'editObject', 'Map@edit');
Routes::any('mapList', 'mapList', 'Home@mapList');
