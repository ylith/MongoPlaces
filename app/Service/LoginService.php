<?php
namespace Service;

use Framework\Service\AbstractService;
use Framework\Support\Session;
use Lib\AppConstant;
use Framework\Factory\RepositoryFactory;

class LoginService extends AbstractService
{
	public function authenticateUser($email, $password)
	{
		$result = array(
			'message' => 'Logged in successfully!',
			'status' => AppConstant::STATUS_DONE,
		);
		$user = current(RepositoryFactory::create('user')->findOneBy(array(
			'email' => $email,
		)));

		if (! $user) {
			$result = array(
				'message' => 'Password and email don\'t match!',
				'status' => AppConstant::STATUS_ERROR,
			);
		} elseif (! password_verify($password, $user->password)) {
			$result = array(
				'message' => 'Password and email don\'t match!',
				'status' => AppConstant::STATUS_ERROR,
			);
		} else {
			Session::getInstance()->set('user', array(
				'email' => $email,
				'id' => (string)$user->_id,
			));
		}
		
		return $result;
	}
	
	public function logout()
	{
		Session::getInstance()->clearSession();
	}
}
