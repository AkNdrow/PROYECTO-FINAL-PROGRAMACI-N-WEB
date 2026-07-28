<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use App\Http\Resources\ItemResource;

class ItemController extends Controller
{
    /**
     * Display a listing of the user's items.
     */
    public function index(Request $request)
    {
        $items = $request->user()->items()->latest()->get();
        return ItemResource::collection($items);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item = $request->user()->items()->create($validated);

        return new ItemResource($item);
    }

    /**
     * Display the specified item.
     */
    public function show(Request $request, Item $item)
    {
        // Validar que el item pertenece al usuario autenticado
        if ($request->user()->id !== $item->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return new ItemResource($item);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, Item $item)
    {
        if ($request->user()->id !== $item->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $item->update($validated);

        return new ItemResource($item);
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(Request $request, Item $item)
    {
        if ($request->user()->id !== $item->user_id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Ítem eliminado correctamente']);
    }
}
