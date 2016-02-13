<?php

use Framework\Support\Session;

function hasLoggedIn()
{
	return (bool)Session::getInstance()->get('user');
}

function getUsername()
{
	if (! hasLoggedIn()) {
		return 'Guest';
	}
	
	return isset(Session::getInstance()->get('user')['email']) ? Session::getInstance()->get('user')['email'] : 'Guest';
}