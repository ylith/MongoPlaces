<?php
namespace Repository\Mongo;

use Framework\Persistence\AbstractMongoRepository;

class MapRepository extends AbstractMongoRepository
{

	public function setOptions()
	{
		return array(
			'collectionName' => 'map',
		);
	}
}