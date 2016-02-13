<?php
namespace Controller;

use Framework\Controller\AbstractController;
use Framework\Support\View;
use Framework\Support\Input;
use Framework\Factory\RepositoryFactory;

class HomeController extends AbstractController
{
	public function index()
	{
		return View::make('home.index');
	}
	
	public function login()
	{

	}
	
	public function logout()
	{
		
	}
	
	public function register()
	{
		
	}
}
