<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use App\Http\Resources\DocumentResource;
use App\Services\TwilioService;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Administradores ven todo, Clientes solo sus documentos
        if ($request->user()->role_id == 1) { // 1 = Admin
            $documents = Document::with(['user', 'tags'])->latest()->get();
        } else {
            $documents = $request->user()->documents()->with(['user', 'tags'])->latest()->get();
        }
        
        return DocumentResource::collection($documents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, TwilioService $twilio)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:publico,privado',
            'status' => 'required|string|in:borrador,publicado',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id'
        ]);

        $document = $request->user()->documents()->create($validated);

        if ($request->has('tags')) {
            $document->tags()->attach($request->tags);
        }

        // Integración Twilio - Notificar de nuevo documento
        $mensaje = "CleverNote: Has creado un nuevo documento '{$document->title}'.";
        $twilio->sendSMS($mensaje);
        $twilio->sendWhatsApp($mensaje);

        return new DocumentResource($document->load(['user', 'tags']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Document $document)
    {
        // Validar acceso (Admin o dueño del doc, o si es público)
        if ($request->user()->role_id !== 1 && $document->user_id !== $request->user()->id && $document->type !== 'publico') {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        return new DocumentResource($document->load(['user', 'tags']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        // Validar acceso (Admin o dueño del doc)
        if ($request->user()->role_id !== 1 && $document->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:publico,privado',
            'status' => 'sometimes|required|string|in:borrador,publicado',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id'
        ]);

        $document->update($validated);

        if ($request->has('tags')) {
            $document->tags()->sync($request->tags);
        }

        return new DocumentResource($document->load(['user', 'tags']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Document $document)
    {
        if ($request->user()->role_id !== 1 && $document->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }

        $document->delete();

        return response()->json(['message' => 'Documento eliminado correctamente']);
    }
}
