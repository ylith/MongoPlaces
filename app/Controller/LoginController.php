<?php
namespace Controller;

use Framework\Support\Session;
use Framework\Factory\ServiceFactory;
use Framework\Controller\AbstractController;
use Framework\Support\View;
use Framework\Support\Input;

class LoginController extends AbstractController
{
	public function showLogin()
	{
		return View::make('', array(), 'login');
	}

	public function doLogin()
	{
		$params = Input::all('post');

		if (empty($params['username']) || empty($params['password'])) {
			return json_encode(array(
				'code' => 0,
				'message' => 'Empty username or password!'
			));
		}

		$user = ServiceFactory::create('login')->authenticateUser($params['username'], $params['password']);

		if (! $user) {
			return json_encode(array(
				'code' => 0,
				'message' => 'Invalid username or password!'
			));
		}

		if (! in_array('cn=ih2 cms,ou=Services,dc=imperiaonline,dc=org', $user['memberOf'])) {
			return json_encode(array(
				'code' => 0,
				'message' => 'Access denied!'
			));
		}

		$projectAccess = json_decode($user['projectAccess'][0], true);
		$projectAccess = $projectAccess['ih2 cms'];
		$langs = array();
		$isAdmin = false;
		$isRtl = false;
		$menus = array(
			'Home' => array('*'),
			'Login' => array('*'),
		);

		foreach ($projectAccess as $module) {
			if (! empty($module['langs'])) {
				$langs = array_merge($langs, $module['langs']);
				$isRtl = (! empty($module['isRtl'])) ? $module['isRtl'] : false;
			}

			$menus[$module['name']] = $module['routes'];
		}

		foreach ($projectAccess as $module) {
			$isAdmin = (! empty($module['isAdmin'])) ? $module['isAdmin'] : false;
			if ($isAdmin) {
				break;
			}
		}

		Session::getInstance()->set('user', array(
			'name' => $user['uid'][0],
			'langs' => $langs,
			'menus' => $menus,
			'isAdmin' => $isAdmin,
			'isRtl' => $isRtl,
		));
		$url = Session::getInstance()->get('requestedUrl');

		return json_encode(array(
			'code' => 1,
			'url' => (! empty($url)) ? $url : './',
		));
	}

	public function logout()
	{
		Session::getInstance()->clear('user');
		Session::getInstance()->clear('realm');
		return View::make('', array(), 'login');
	}
}
