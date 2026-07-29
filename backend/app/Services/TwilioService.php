<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioService
{
    protected $client;
    protected $twilioFrom;
    protected $whatsappFrom;
    protected $destinationPhone;

    public function __construct()
    {
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_TOKEN');
        
        // Solo inicializar si hay credenciales (para evitar errores si no están configuradas)
        if ($sid && $token) {
            $this->client = new Client($sid, $token);
        }
        
        $this->twilioFrom = env('TWILIO_FROM_NUMBER');
        $this->whatsappFrom = env('TWILIO_WHATSAPP_FROM');
        // Usamos un número de destino estático configurado en .env para proyectos universitarios / Twilio Trial
        $this->destinationPhone = env('TWILIO_DESTINATION_PHONE'); 
    }

    /**
     * Enviar SMS genérico
     */
    public function sendSMS($message)
    {
        if (!$this->client || !$this->destinationPhone || !$this->twilioFrom) {
            Log::warning('Twilio SMS: Credenciales incompletas en .env');
            return false;
        }

        try {
            $this->client->messages->create(
                $this->destinationPhone,
                [
                    'from' => $this->twilioFrom,
                    'body' => $message
                ]
            );
            return true;
        } catch (\Exception $e) {
            Log::error('Twilio SMS Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Enviar mensaje de WhatsApp genérico
     */
    public function sendWhatsApp($message)
    {
        if (!$this->client || !$this->destinationPhone || !$this->whatsappFrom) {
            Log::warning('Twilio WhatsApp: Credenciales incompletas en .env');
            return false;
        }

        try {
            $this->client->messages->create(
                "whatsapp:" . $this->destinationPhone,
                [
                    'from' => $this->whatsappFrom,
                    'body' => $message
                ]
            );
            return true;
        } catch (\Exception $e) {
            Log::error('Twilio WhatsApp Error: ' . $e->getMessage());
            return false;
        }
    }
}
