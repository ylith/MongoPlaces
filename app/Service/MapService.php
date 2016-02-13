<?php
namespace Service;
use Framework\Service\AbstractService;
use Framework\Factory\RepositoryFactory;

class MapService extends AbstractService
{
	const MIN_DISTANCE = 1;
	const MAX_DISTANCE = 1500;
	
	public function readMap()
	{
		return RepositoryFactory::create('map')->findBy();
	}
	
	public function addNewObject($params)
	{
		$params = array_filter($params);
		
		if (! isset($params['lat']) || ! isset($params['lng'])) {
			return;
		}
		$params = array_map(function($p) {
			return castNumeric($p);
		}, $params);
		$params['location'] = array(
			'type' => 'Point',
			'coordinates' => array(
				$params['lat'],
				$params['lng'],
			),
		);
		dd($this->getPointsNear($params['lat'], $params['lng']));
		
		unset($params['lat'], $params['lng']);
		
		if (RepositoryFactory::create('map')->insertElement($params)) {
			return array(
				'code' => 1,
				'message' => 'You\'ve successfully added ' . $params['name'],
			);
		}
	}
	
	public function getPointsNear($x, $y, $maxDistance = self::MAX_DISTANCE, $minDistance = self::MIN_DISTANCE)
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
		));
	}
}