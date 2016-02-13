<?php
namespace Service;
use Framework\Service\AbstractService;
use Lib\AppConstant;
use Framework\Factory\RepositoryFactory;

class RegisterService extends AbstractService
{
	const MIN_SIZE_FOR_PASSWORD = 6;
	
	public function register($email, $password)
	{
		$message = '';
		$status = AppConstant::STATUS_DONE;
		
		if (! $email || ! $password) {
			$message = 'Invalid email or password';
			$status = AppConstant::STATUS_ERROR;
			return array(
				'message' => $message,
				'status' => $status,
			);
		} elseif (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$message = 'Invalid email format';
			$status = AppConstant::STATUS_ERROR;
			return array(
				'message' => $message,
				'status' => $status,
			);
		}
		
		if (strlen($password) < self::MIN_SIZE_FOR_PASSWORD) {
			$message = 'Password has to be at least ' . self::MIN_SIZE_FOR_PASSWORD . ' characters';
			$status = AppConstant::STATUS_WAIT;
			return array(
				'message' => $message,
				'status' => $status,
			);
		}
		
		if (! preg_match('/^[a-z0-9.\-_!]+$/i', $password)) {
			$message = 'Password has to contain only numbers, letters or . _ - !';
			$status = AppConstant::STATUS_WAIT;
			return array(
				'message' => $message,
				'status' => $status,
			);
		}
		
		$repo = RepositoryFactory::create('user');
		if ($repo->userExists($email)) {
			$message = 'User with this email already exists!';
			$status = AppConstant::STATUS_ERROR;
			return array(
				'message' => $message,
				'status' => $status,
			);			
		}
		
		if ($repo->register(array(
			'email' => $email,
			'password' => password_hash($password, PASSWORD_DEFAULT),
		))) {
			$message = 'Success!';
		} else {
			$message = 'An error occurred!';
			$status = AppConstant::STATUS_ERROR;
		}
		
		return array(
			'message' => $message,
			'status' => $status,
		);
	}
}