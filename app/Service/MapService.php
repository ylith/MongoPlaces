<?php
namespace Service;
use Framework\Service\AbstractService;
use Framework\Factory\RepositoryFactory;
use Lib\AppConstant;
use Framework\Support\Session;

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
	
	public function readMap()
	{
		$points = RepositoryFactory::create('map')->findBy();
		
		foreach ($points as $key => $point) {
			if (isset($point->type) && isset(self::$typeToImage[$point->type])) {
				$point->image = self::$typeToImage[$point->type];
				$points[$key] = $point;
			}
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
		
		if (empty($params['name'])) {
			return array(
				'status' => AppConstant::STATUS_ERROR,
				'message' => 'Cannot add point of interest without a name!',
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
		            '$geometry' =>  array('type' => "Point",  'coordinates' => array($x, $y)),
		            '$minDistance' => self::MIN_DISTANCE,
		            '$maxDistance' => self::MAX_DISTANCE,
		          ),
		       )
		), array(
			 'limit' => $limit,
		));
	}
}