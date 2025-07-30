<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Simple authentication check - in real application you would check session, token, etc.
        $authHeader = $request->header('Authorization');
        $authToken = $request->query('token');
        
        // Allow requests with valid authorization header or token parameter
        if ($authHeader === 'Bearer valid-token' || $authToken === 'valid-token') {
            return $next($request);
        }

        // Return 401 Unauthorized for protected routes
        return response()->json([
            'error' => 'Unauthorized',
            'message' => 'You must provide valid authentication to access this resource.'
        ], 401);
    }
}