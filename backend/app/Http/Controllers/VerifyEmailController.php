<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class VerifyEmailController extends Controller
{
    /**
     * Marcar el correo del usuario como verificado.
     */
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Enlace de verificación inválido.'], 403);
        }

        $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Correo Verificado</title>
    <style>
        body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #0f172a; color: white; margin: 0; }
        .card { background-color: #1e293b; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); max-width: 400px; width: 90%; }
        h1 { color: #4ade80; margin-top: 0; }
        p { color: #94a3b8; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Correo Verificado! 🎉</h1>
        <p>Tu dirección de correo electrónico ha sido confirmada exitosamente.</p>
        <p>Ya puedes cerrar esta ventana y regresar a tu computadora para iniciar sesión.</p>
    </div>
</body>
</html>';

        if ($user->hasVerifiedEmail()) {
            // Ya está verificado, devolver HTML
            return response($html);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response($html);
    }

    /**
     * Reenviar el correo de verificación.
     */
    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya está verificado.'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Enlace de verificación reenviado exitosamente.']);
    }
}
