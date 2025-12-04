<?php

namespace App\Http\Controllers;

use App\Models\ProdukReviews;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Store a new review for a product
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:produk,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create the review (no authentication required)
            $review = ProdukReviews::create([
                'product_id' => $request->product_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            return response()->json([
                'message' => 'Ulasan berhasil ditambahkan',
                'data' => $review
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menambahkan ulasan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reviews for a specific product
     */
    public function getProductReviews($productId)
    {
        try {
            $reviews = ProdukReviews::where('product_id', $productId)
                ->orderBy('created_at', 'desc')
                ->get();

            $totalReviews = $reviews->count();
            $ratingBreakdown = [
                5 => $reviews->where('rating', 5)->count(),
                4 => $reviews->where('rating', 4)->count(),
                3 => $reviews->where('rating', 3)->count(),
                2 => $reviews->where('rating', 2)->count(),
                1 => $reviews->where('rating', 1)->count(),
            ];

            return response()->json([
                'message' => 'Reviews retrieved successfully',
                'data' => [
                    'reviews' => $reviews,
                    'total_reviews' => $totalReviews,
                    'rating_breakdown' => $ratingBreakdown,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil ulasan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review (only by owner or admin)
     */
    public function destroy($reviewId)
    {
        try {
            $review = ProdukReviews::findOrFail($reviewId);

            $review->delete();

            return response()->json([
                'message' => 'Ulasan berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menghapus ulasan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
