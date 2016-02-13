<?php
namespace Controller;

use Framework\Factory\ServiceFactory;
use Framework\Controller\AbstractController;
use Framework\Support\View;
use Framework\Support\Input;

class SystemController extends AbstractController
{
	public function login()
	{
		$email = Input::post('email');
		$password = Input::post('password');
	
		return ServiceFactory::create('login')->authenticateUser($email, $password);
	}
	
	public function logout()
	{
		return ServiceFactory::create('login')->logout();
	}
	
	public function doRegistration()
	{
		$email = Input::post('email');
		$password = Input::post('password');
	
		return ServiceFactory::create('Register')->register($email, $password);
	}
}
