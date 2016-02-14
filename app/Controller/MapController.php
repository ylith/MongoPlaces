<?php
namespace Controller;

use Framework\Controller\AbstractAjaxController;
use Framework\Factory\ServiceFactory;
use Framework\Support\Input;
use Framework\Factory\RepositoryFactory;

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
	
	public function filter()
	{
		$params = array_filter(Input::all('post'));
		$id = $params['_id'];
		$mapObject = current(ServiceFactory::create('map')->getObject($id));
		array_walk_recursive($params, 'castNumericInPlace');
		
		if (isset($params['type'])) {
			return ServiceFactory::create('map')->readMap(array(
				'type' => $params['type'],
				'_id' => array('$ne' => new \MongoDB\BSON\ObjectID($id)),
			), array(
				'limit' => 10,
			));
		} elseif (isset($params['like'])) {
			if (isset($mapObject->priceRange)) {
				$min = isset($mapObject->priceRange->min) ? $mapObject->priceRange->min : 0;
				$max = isset($mapObject->priceRange->max) ? $mapObject->priceRange->max : 0;
				return ServiceFactory::create('map')->readMap(array(
						'priceRange.min' => array('$gte' => $min),
						'priceRange.max' => array('$lte' => $max),
						'_id' => array('$ne' => new \MongoDB\BSON\ObjectID($id)),
					), array(
						'limit' => 10,
					));
			} else if (isset($mapObject->opened)) {
				$min = isset($mapObject->opened->from) ? $mapObject->opened->from : 0;
				$max = isset($mapObject->opened->until) ? $mapObject->opened->until : 23.59;
				return ServiceFactory::create('map')->readMap(array(
					'opened.from' => array('$gte' => $min),
					'opened.until' => array('$lte' => $max),
					'_id' => array('$ne' => new \MongoDB\BSON\ObjectID($id)),
				), array(
					'limit' => 10,
				));
			}

		} elseif (isset($params['nearest'])) {
			return ServiceFactory::create('map')->getPointsNear($mapObject->location->coordinates[0], $mapObject->location->coordinates[1]);
		}
	}
	
	public function setFavourite()
	{
		$id = Input::post('_id');
		if (! $id) {
			return;
		}
		
		return RepositoryFactory::create('user')->update(array(
			'_id' => new \MongoDB\BSON\ObjectID(getUserId()),
		), array('$addToSet' => array('favourites' => $id)));
	}
}
