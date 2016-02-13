<?php
namespace Framework\Persistence;

use Framework\Factory\AdapterFactory;
/**
 
 */
abstract class AbstractMongoRepository
{
	/**
	 * @var MongoAdapter
	 */
	protected $adapter;

	protected
			$collectionName = '',
			$dbHost = '',
			$dbName = '',
			$collectionObject,
			$dbObject;

	/**
	 * Acceptable options: dbHost, dbName, user, pass
	 *
	*/
	abstract public function setOptions();

	public function __construct()
	{
		$options = $this->setOptions();
		$options['driver'] = 'mongo';

		$this->adapter = AdapterFactory::create($options);
		$this->dbName = $this->adapter->getDbName();
		$this->dbHost= $this->adapter->getDbHost();
		$this->collectionName = (isset($options['collectionName']) ? $options['collectionName'] : '');
		
		//doesn't work anymore with the new driver
// 		$this->collectionObject = $this->adapter->getMongo()->{$this->dbName}->{$this->collectionName};
// 		$this->dbObject = $this->adapter->getMongo()->selectDB($this->dbName);
	}
	
	public function getDbNamespace()
	{
		return $this->dbName . '.' . $this->collectionName;
	}

	/**
	* @param array $conditions
	 * @return \MongoCursor
	 */
	public function findBy(array $conditions = array(), array $options = array(), $asCursor = false)
	{
		$manager = $this->adapter->getMongo();
		$query = new \MongoDB\Driver\Query($conditions, $options);
		$cursor = $manager->executeQuery($this->getDbNamespace(), $query);

		return $asCursor ? $cursor : iterator_to_array($cursor);
	}

	/**
	* @param array $conditions
	 * @return \MongoCursor
	 */
	public function findOneBy(array $conditions = array(), array $options = array(), $asCursor = false)
	{
		$options['limit'] = 1;
		
		return $this->findBy($conditions, $options, $asCursor);
	}

	/** Insert element in current collection
	 *
	 * @param array $params
	 */
	public function insertElement(array $params)
	{
		$manager = $this->adapter->getMongo();
		$bulk = new \MongoDB\Driver\BulkWrite();
		$bulk->insert($params);

		$result = $manager->executeBulkWrite($this->getDbNamespace(), $bulk);
	}

	/** Insert element in current collection
	 *
	 * @param array $params
	 */
	public function distinct($key, array $params)
	{
		return $this->collectionObject->distinct($key, $params);
	}

	public function aggregate(array $params)
	{
		return $this->collectionObject->aggregate($params);
	}

	public function removeElement($elementId)
	{
		$this->collectionObject->remove(array('_id' => new \MongoId($elementId)), array('justOne' => true));
	}
}
