<?php
namespace Service;

use Framework\Service\AbstractService;
use Framework\Support\Session;

class LoginService extends AbstractService
{
	public function authenticateUser($username, $password)
	{

	}
	
	public function logout()
	{
		Session::getInstance()->clear('user');
	}
}
