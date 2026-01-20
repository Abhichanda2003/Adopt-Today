exports.explain = async (req, res) => {
  try {
    const { userProfile, pet } = req.body || {};

    if (!userProfile || !pet) {
      return res.status(400).json({ success: false, message: "Missing userProfile or pet" });
    }

    const prompt = `You are an adoption counselor. Write a short, friendly explanation (2-4 sentences) for why this pet matches the user. Be practical and mention 1-2 considerations.

User profile: ${JSON.stringify(userProfile)}
Pet: ${JSON.stringify(pet)}

Return only the explanation text.`;

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return a deterministic explanation so the UI remains smooth.
    if (!apiKey) {
      const petName = pet?.pName || "this pet";
      const age = pet?.pPrice != null ? `${pet.pPrice}` : "unknown";
      const petType = pet?.pCategory?.cName || "pet";
      const home = userProfile?.homeType || "your home";
      const time = userProfile?.timeAvailability || "your schedule";
      const kids = userProfile?.kidsOrFamily === "Kids" ? "kids" : "family";
      return res.json({
        success: true,
        explanation: `${petName} looks like a solid match for ${home} because its profile aligns well with ${time}. With an age of ${age}, this ${petType} can be a great fit for a ${kids}-friendly environment. Consider doing a short meet-and-greet and asking about daily activity needs before finalizing adoption.`,
        provider: "template",
      });
    }

    // Uses Node's global fetch (Node 18+). If your Node version is older, we can switch to https.
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You write concise, helpful adoption match explanations." },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 120,
      }),
    });

    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(500).json({
        success: false,
        message: data?.error?.message || "AI explanation failed",
      });
    }

    const explanation = data?.choices?.[0]?.message?.content?.trim() || "";
    return res.json({ success: true, explanation, provider: "openai" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error });
  }
};
