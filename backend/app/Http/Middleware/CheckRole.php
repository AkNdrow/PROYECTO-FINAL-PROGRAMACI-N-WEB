<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Obtener el nombre del rol del usuario a través de la relación
        $userRole = $request->user()->role->name ?? null;

        // Verificar si el rol del usuario está dentro de los roles permitidos
        if (! in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.'
            ], 403);
        }

        return $next($request);
    }
}
