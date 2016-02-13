<?php
use Framework\Controller\AbstractAjaxController;
use Framework\Support\View;

class MapController extends AbstractAjaxController
{
	public function index()
	{
		return View::make('master', array(), 'master');
	}
}
