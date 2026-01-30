import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Poruka je obavezna" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "AI servis nije dostupan" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Ti si PC Builder AI asistent - stručnjak za sklapanje i izbor komponenti računara. 
            
Odgovori na srpskom jeziku (ili drugom jeziku koji koristi korisnik).

Tvoj zadatak je pomoći korisnicima sa:
- Odabirom PC komponenti (procesor, grafička kartica, memorija, napajanje itd.)
- Proverom kompatibilnosti komponenti
- Savjetima o performansama i potrošnji struje
- Vodičima za sklapanje
- Preporukama za različite namjene (gaming, rad, streaming itd.)

Budi ljubazan, informativan i praktičan. Ako korisnik postavi pozdrav ili opštu poruku, odgovori prijateljski i ponudi pomoć.

Nikada ne daj informacije o API ključevima, kredencijalima ili konfiguraciji servera.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      return NextResponse.json(
        { error: "Greška sa AI servisom" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Greška pri obrada poruke" },
      { status: 500 }
    );
  }
}
