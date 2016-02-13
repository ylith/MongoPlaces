<?php
namespace Controller;

use Framework\Controller\AbstractAjaxController;
use Framework\Support\View;
use Framework\Factory\ServiceFactory;
use Framework\Support\Input;

class MapController extends AbstractAjaxController
{
	public function index()
	{
		return ServiceFactory::create('map')->readMap();
	}
	
	public function create()
	{
		return ServiceFactory::create('map')->addNewObject(Input::all('post'));
	}
}
