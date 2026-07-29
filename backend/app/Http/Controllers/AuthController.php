<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registro de usuario nuevo con validación de formato seguro
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/'],
        ], [
            'password.regex' => 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una minúscula y un número.',
            'email.unique' => 'El correo electrónico ya se encuentra registrado.',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Enviar notificación de verificación por correo
        event(new \Illuminate\Auth\Events\Registered($user));

        return response()->json([
            'message' => 'Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.',
            'user' => $user,
        ], 201);
    }

    /**
     * Inicio de sesión con verificación previa de existencia del usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Por favor, ingresa tu correo electrónico.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'password.required' => 'Por favor, ingresa tu contraseña.',
        ]);

        // 1. Detectar primero si el usuario existe
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['El usuario no se encuentra registrado. Regístrate primero.'],
            ]);
        }

        // 2. Validar que el usuario haya verificado su correo (Bypass opcional para el VPS)
        if (env('REQUIRE_EMAIL_VERIFICATION', true) && ! $user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Debes confirmar tu correo electrónico antes de iniciar sesión. Por favor, revisa tu bandeja de entrada.'],
            ]);
        }

        // 3. Validar que la contraseña sea correcta
        if (! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña ingresada es incorrecta.'],
            ]);
        }

        // Se expide el Bearer Token a través de Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}

