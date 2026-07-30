<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\TwilioService;

class AuthController extends Controller
{
    /**
     * Registro de usuario nuevo con validación de formato seguro (vía FormRequest)
     */
    public function register(RegisterUserRequest $request, TwilioService $twilio)
    {
        $otp = (string) rand(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'otp_code' => $otp,
            'role_id' => 2, // Por defecto al registrarse será "Cliente" (ID 2)
        ]);

        // Enviar notificación de verificación por correo
        event(new Registered($user));

        // Enviar OTP vía Twilio
        $mensaje = "Tu código de verificación en CleverNote es: {$otp}";
        $twilio->sendSMS($mensaje);
        $twilio->sendWhatsApp($mensaje);

        return response()->json([
            'message' => 'Usuario registrado exitosamente. Por favor, verifica tu número de teléfono.',
            'requires_phone_verification' => true,
            'email' => $user->email // Para que el frontend sepa a quién verificar
        ], 201);
    }

    /**
     * Verificar el código OTP telefónico
     */
    public function verifyPhone(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        if ($user->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'El código de verificación es incorrecto.'], 400);
        }

        // Código correcto, marcar como verificado
        $user->update([
            'phone_verified_at' => now(),
            'otp_code' => null // Limpiar el código usado
        ]);

        return response()->json([
            'message' => 'Teléfono verificado exitosamente. Ya puedes iniciar sesión.'
        ]);
    }

    /**
     * Inicio de sesión con verificación de existencia y contraseña
     */
    public function login(LoginUserRequest $request)
    {
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

    /**
     * Check if the user has verified their email (used for frontend polling)
     */
    public function checkVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['verified' => false]);
        }
        
        return response()->json(['verified' => $user->hasVerifiedEmail()]);
    }
}
