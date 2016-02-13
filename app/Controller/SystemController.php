<?php
namespace Controller;

use Framework\Factory\ServiceFactory;
use Framework\Support\Input;
use Lib\AppConstant;
use Framework\Controller\AbstractAjaxController;
use Framework\Routing\Url;
use Framework\Http\Response;

class SystemController extends AbstractAjaxController
{
	public function login()
	{
		$email = Input::post('email');
		$password = Input::post('password');
	
		return ServiceFactory::create('login')->authenticateUser($email, $password);
	}
	
	public function logout()
	{
		ServiceFactory::create('login')->logout();

		Response::getInstance()->redirect(Url::generate('home'));
	}
	
	public function doRegistration()
	{
		$email = Input::post('email');
		$password = Input::post('password');
		$password2 = Input::post('password2');
		$service = ServiceFactory::create('Register');
		
		if ($password != $password2) {
			return array(
				'code' => AppConstant::STATUS_WAIT,
				'message' => 'Passwords do not match',
			);
		}
	
		$result = $service->register($email, $password);
		if ($result['status'] == AppConstant::STATUS_DONE) {
			return ServiceFactory::create('login')->authenticateUser($email, $password);
		}

		return $result;
	}
}
