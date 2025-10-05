import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = language === "hi" 
      ? `आप सेहतसाथी हैं - ग्रामीण भारत के लिए एक मित्रवत AI स्वास्थ्य साथी। आप बुनियादी स्वास्थ्य मार्गदर्शन, प्राथमिक चिकित्सा सुझाव प्रदान करते हैं और उपयोगकर्ताओं को टेली-परामर्श और नजदीकी अस्पतालों से जोड़ने में मदद करते हैं। 

नियम:
- सरल, स्पष्ट हिंदी भाषा का उपयोग करें
- संक्षिप्त और व्यावहारिक सलाह दें
- गंभीर लक्षणों के लिए हमेशा डॉक्टर से परामर्श की सिफारिश करें
- सहानुभूतिपूर्ण और सहायक रहें
- चिकित्सा निदान न दें, केवल सामान्य मार्गदर्शन दें`
      : `You are SehatSaathi - a friendly AI health companion for rural India. You provide basic health guidance, first-aid tips, and help users connect with tele-consultations and nearby hospitals.

Guidelines:
- Use simple, clear language accessible to rural users
- Provide concise, actionable advice
- Always recommend consulting a doctor for serious symptoms
- Be empathetic and supportive
- Don't diagnose - only provide general guidance
- Keep responses under 100 words for readability`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
