<?php

use Framework\Support\Session;
use Framework\Http\Request;

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

function getUserId()
{
	if (! hasLoggedIn()) {
		return;
	}
	
	return isset(Session::getInstance()->get('user')['id']) ? Session::getInstance()->get('user')['id'] : null;
}

function highlightNav($class)
{
	$js = '$("#' .$class . '").addClass("active")';
	Request::getInstance()->setParam('activeNav', $js);
}