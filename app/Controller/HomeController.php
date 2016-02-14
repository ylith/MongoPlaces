<?php
namespace Controller;

use Framework\Controller\AbstractController;
use Framework\Support\View;
use Framework\Factory\ServiceFactory;

class HomeController extends AbstractController
{	
	public function index()
	{
		highlightNav('home');
		return View::make('home.index', array(
			'hasLoggedIn' => hasLoggedIn()
		));
	}
	
	public function mapList()
	{
		highlightNav('mapList');
		return View::make('map.mapList', array(
			'objects' => ServiceFactory::create('map')->readMap(array(), array('limit' => 50, 'sort' => array('type' => 1))),
		), 'map');
	}
	
	public function getFavourites()
	{
		return View::make('map.mapList', array(
			'objects' => ServiceFactory::create('map')->getFavourites(),
		), 'map');
	}
	
	public function myPlaces()
	{
		return View::make('map.mapList', array(
			'objects' => ServiceFactory::create('map')->myPlaces(),
		), 'map');
	}
}
