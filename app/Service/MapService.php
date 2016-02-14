<?php
namespace Service;
use Framework\Service\AbstractService;
use Framework\Factory\RepositoryFactory;
use Lib\AppConstant;

class MapService extends AbstractService
{
	const MIN_DISTANCE = 1;
	const MAX_DISTANCE = 1500;
	const MAX_OBJECTS = 5;
	
	public static $typeToImage = array(
		1 => 'assets/images/restaurant.png',
		2 => 'assets/images/grocery.png',
		3 => 'assets/images/lodging-2.png',
		4 => 'assets/images/university.png',
		5 => 'assets/images/theater.png',
		6 => 'assets/images/stadium.png',
		7 => 'assets/images/busstop.png',
		8 => 'assets/images/administration.png',
		9 => 'assets/images/tree.png',
	);
	
	public function readMap(array $params = array(), $options = array())
	{
		$points = RepositoryFactory::create('map')->findBy($params, $options);
		
		foreach ($points as $key => $point) {
			if (isset($point->type) && isset(self::$typeToImage[$point->type])) {
				$point->image = self::$typeToImage[$point->type];
				$points[$key] = $point;
			}
			$points[$key]->_id = (string)$point->_id;
		}
		
		return $points;
	}
	
	public function addNewObject($params)
	{
		$params = array_filter($params);
		
		if (! isset($params['lat']) || ! isset($params['lng'])) {
			return array(
				'status' => AppConstant::STATUS_ERROR,
				'message' => 'No coordinates!',
			);
		}
		
		if (empty($params['name']) || empty($params['type'])) {
			return array(
				'status' => AppConstant::STATUS_ERROR,
				'message' => 'Cannot add point of interest without a name or type!',
			);
		}
		array_walk_recursive($params, 'castNumericInPlace');

		$params['location'] = array(
			'type' => 'Point',
			'coordinates' => array(
				$params['lat'],
				$params['lng'],
			),
		);
		
		if ((isset($params['opened']['from']) && $params['opened']['from'] != '') ||
				(isset($params['opened']['until']) && $params['opened']['until'] != '')) {
			$from = isset($params['opened']['from']) ? max(min(castNumeric($params['opened']['from']), 23.59), 0) : 0;
			$until = isset($params['opened']['until']) ? max(min(castNumeric($params['opened']['until']), 23.59), 0) : 0;
			$params['opened']['from'] = min($from, $until);
			$params['opened']['until'] = $until;
		} else {
			unset($params['opened']);
		}
		
		if ((isset($params['priceRange']['min']) && $params['priceRange']['min'] == '') ||
				(isset($params['priceRange']['max']) && $params['priceRange']['max'] == '')) {
			unset($params['priceRange']);
		}
		
		unset($params['lat'], $params['lng']);
		
		if (hasLoggedIn()) {
			$params['addedBy'] = array(
				'$ref' => 'users',
				'$id' => getUserId(),
			);
		}
		
		$insert = RepositoryFactory::create('map')->insertElement($params);
		if ($insert) {
			$params['image'] = isset($params['type']) ? self::$typeToImage[$params['type']] : null;
			return array(
				'status' => AppConstant::STATUS_DONE,
				'message' => 'You\'ve successfully added ' . $params['name'],
				'element' => $params,
			);
		}
	}
	
	public function getPointsNear($x, $y, $maxDistance = self::MAX_DISTANCE, $minDistance = self::MIN_DISTANCE, $limit = self::MAX_OBJECTS)
	{
		return RepositoryFactory::create('map')->findBy(array(
			'location' => 
		       array('$near' =>
		          array(
		            '$geometry' =>  array('type' => "Point", 'coordinates' => array($x, $y)),
		            '$minDistance' => self::MIN_DISTANCE,
		            '$maxDistance' => self::MAX_DISTANCE,
		          ),
		       )
		), array(
			 'limit' => $limit,
		));
	}
	
	public function getObject($id)
	{
		return RepositoryFactory::create('map')->findBy(array(
			'_id' => new \MongoDB\BSON\ObjectID($id),
		));
	}
	
	public function getFavourites()
	{
		$result = array();
		$favourites = current(RepositoryFactory::create('user')->findBy(array(
			'_id' => new \MongoDB\BSON\ObjectID(getUserId()),
		)));
		$repo = RepositoryFactory::create('map');
		
		if (! isset($favourites->favourites) || empty($favourites->favourites)) {
			return $result;
		}
		$favs = array_filter($favourites->favourites);
		
		foreach ($favs as $fav) {
			$result[]= current($repo->findBy(array(
				'_id' => new \MongoDB\BSON\ObjectID($fav),
			)));
		}
		
		return $result;
	}
	
	public function myPlaces()
	{
		$places = RepositoryFactory::create('map')->findBy(array(
			'addedBy.$id' => getUserId(),
		), array('limit' => 50));
		$repo = RepositoryFactory::create('map');
		
		return $places;
	}
}