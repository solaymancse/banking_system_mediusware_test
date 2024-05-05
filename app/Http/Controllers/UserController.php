<?php

namespace App\Http\Controllers;


use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use AuthenticatorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function userRegister(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'account_type' => 'required|in:individual,business',
        ]);

        // Create a new user with default balance
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']), // Hash the password
            'account_type' => $validatedData['account_type'],
            'balance' => 0, // Default balance
        ]);

    

        // Redirect to a success page or any other page as needed
        return redirect()->route('login')->with('success', 'Registration successful!');
    }

    public function login(Request $request)
    {
        // Validate the login request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate the user
        if (Auth::attempt($credentials)) {
            // Authentication successful, redirect to the dashboard or any other route
            return redirect()->intended('/dashboard');
        }

        // Authentication failed, redirect back with error message
        return redirect()->back()->withInput()->withErrors(['email' => 'Invalid credentials']);
    }


    public function users()
    {
        $users = User::get();



        // Authentication failed, redirect back with error message
        return response()->json($users);
    }
}
