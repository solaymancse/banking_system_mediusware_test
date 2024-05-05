<?php
// need
namespace App\Http\Controllers\Api\Auth;

use App\Contracts\AuthenticatorInterface;
use App\Http\Controllers\Controller;

//
class AuthenticatorController extends Controller implements AuthenticatorInterface
{
    public function authenticate(array $credentials, string $guard): bool
    {

        $token = auth($guard)->attempt($credentials);

        return $token != null ? true : false;

    }
}