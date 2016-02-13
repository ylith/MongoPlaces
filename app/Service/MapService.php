<?php
namespace Service;
use Framework\Service\AbstractService;
use Framework\Factory\RepositoryFactory;

class MapService extends AbstractService
{
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
		$params['location'] = array(
			'type' => 'Point',
			'coordinates' => array(
				$params['lat'],
				$params['lng'],
			),
		);
		
		unset($params['lat'], $params['lng']);
		
		return RepositoryFactory::create('map')->insertElement($params);
	}
}