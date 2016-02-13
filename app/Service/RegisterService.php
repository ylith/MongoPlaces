<?php
namespace Service;
use Framework\Service\AbstractService;

class RegisterService extends AbstractService
{
	const STATUS_DONE = 1;
	const STATUS_ERROR = 2;
	const STATUS_WAIT = 3;
	
	const MIN_SIZE_FOR_PASSWORD = 6;
	
	public function register($email, $password)
	{
		$message = '';
		$status = self::STATUS_DONE;
		
		if (! $email || $password) {
			$message = 'Invalid email or password';
			$status = self::STATUS_ERROR;
		} elseif (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$message = 'Invalid email format';
			$status = self::STATUS_ERROR;
		}
		
		if (sizeof($password) < self::MIN_SIZE_FOR_PASSWORD) {
			$message = 'Password has to be at least ' . self::MIN_SIZE_FOR_PASSWORD . ' characters';
			$status = self::STATUS_WAIT;
		}
		
		if (! preg_match('/^a-zA-Z0-9.-!_+$/', $password)) {
			$message = 'Password has to contain only numbers, letters or . _ - !';
			$status = self::STATUS_WAIT;
		}
		
		return array(
			'message' => $message,
			'status' => $status,
		);
	}
}