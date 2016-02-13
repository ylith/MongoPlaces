<?php
namespace Repository\Mongo;

use Framework\Persistence\AbstractMongoRepository;

class UserRepository extends AbstractMongoRepository
{
	public function setOptions()
	{
		return array(
			'collectionName' => 'users',
		);
	}
	
	public function userExists(array $params)
	{
		return $this->findBy($params);
	}

	public function register(array $params)
	{
		return $this->insertElement($params);
	}
}