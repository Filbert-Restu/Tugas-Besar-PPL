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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Cek apakah user sudah login
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Cek apakah user memiliki salah satu role yang diizinkan
        $userRole = $request->user()->role;

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses ke resource ini.',
                'required_role' => $roles,
                'your_role' => $userRole,
            ], 403);
        }

        return $next($request);
    }
}
