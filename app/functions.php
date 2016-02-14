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
	$session = Session::getInstance()->get('user');
	
	return isset($session['email']) ? $session['email'] : 'Guest';
}

function getUserId()
{
	if (! hasLoggedIn()) {
		return;
	}
	$session = Session::getInstance()->get('user');
	
	return isset($session['id']) ? $session['id'] : null;
}

function highlightNav($class)
{
	$js = '$("#' .$class . '").addClass("active")';
	Request::getInstance()->setParam('activeNav', $js);
}