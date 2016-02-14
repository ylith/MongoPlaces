<?php
namespace Controller;

use Framework\Controller\AbstractController;
use Framework\Support\View;

class HomeController extends AbstractController
{	
	public function index()
	{
		highlightNav('home');
		return View::make('home.index', array(
			'hasLoggedIn' => hasLoggedIn()
		));
	}
}
