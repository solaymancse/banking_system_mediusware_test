<?php

namespace App\Contracts;

// Create an interface for the authentication service
interface AuthenticatorInterface
{
    public function authenticate(array $credentials, string $guard);
}
