<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MiddlewareTest extends TestCase
{
    /**
     * Test that public routes are accessible without authentication.
     */
    public function test_public_routes_are_accessible(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $response = $this->get('/about');
        $response->assertStatus(200);

        $response = $this->get('/api/public');
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Public API endpoint',
                     'version' => '1.0',
                     'status' => 'active',
                 ]);
    }

    /**
     * Test that protected routes require authentication.
     */
    public function test_protected_routes_require_authentication(): void
    {
        // Test protected route without authentication
        $response = $this->get('/protected');
        $response->assertStatus(401)
                 ->assertJson([
                     'error' => 'Unauthorized',
                 ]);

        // Test admin route without authentication
        $response = $this->get('/admin');
        $response->assertStatus(401);

        // Test dashboard route without authentication
        $response = $this->get('/dashboard');
        $response->assertStatus(401);
    }

    /**
     * Test that protected routes are accessible with valid authentication.
     */
    public function test_protected_routes_with_valid_authentication(): void
    {
        // Test with Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer valid-token',
        ])->get('/protected');
        
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'This is a protected route!',
                 ]);

        // Test with query parameter
        $response = $this->get('/protected?token=valid-token');
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'This is a protected route!',
                 ]);

        // Test admin route with authentication
        $response = $this->withHeaders([
            'Authorization' => 'Bearer valid-token',
        ])->get('/admin');
        
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Admin Dashboard',
                     'user' => 'admin',
                 ]);

        // Test dashboard route with authentication
        $response = $this->get('/dashboard?token=valid-token');
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'User Dashboard',
                     'status' => 'authenticated',
                 ]);
    }

    /**
     * Test that invalid authentication tokens are rejected.
     */
    public function test_invalid_authentication_tokens_are_rejected(): void
    {
        // Test with invalid Authorization header
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
        ])->get('/protected');
        
        $response->assertStatus(401);

        // Test with invalid query parameter
        $response = $this->get('/protected?token=invalid-token');
        $response->assertStatus(401);
    }
}