export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real application, this would call an actual LLM API
    // For demo purposes, we'll simulate a delay and return a predefined response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract world, character, gift, ability, and companion from the prompt
    // This is a simple extraction based on the prompt format we're using
    const worldMatch = prompt.match(/которая (.*?) будет жить/);
    const characterMatch = prompt.match(/будет жить (.*?),/);
    const giftMatch = prompt.match(/жить .*?, (.*?),/);
    const abilityMatch = prompt.match(/, (.*?), (?:в компании|рядом|с маленьким|окруженная|в сопровождении)/);
    const companionMatch = prompt.match(/, ((?:в компании|рядом|с маленьким|окруженная|в сопровождении).*?)\./) || 
                          prompt.match(/, ((?:в компании|рядом|с маленьким|окруженная|в сопровождении).*?)$/);
    
    const world = worldMatch ? worldMatch[1] : '';
    const character = characterMatch ? characterMatch[1] : '';
    const gift = giftMatch ? giftMatch[1] : '';
    const ability = abilityMatch ? abilityMatch[1] : '';
    const companion = companionMatch ? companionMatch[1] : '';
    
    // Generate a personalized prediction based on the extracted elements
    const prediction = `В этот весенний праздник 8 марта, твоя судьба раскрывается ${world}. ${character}, ты обретешь невероятную силу ${gift}. С ${ability} ты сможешь преодолеть любые преграды, а ${companion} будет твоим верным другом. 

Пусть этот год принесет тебе радость, любовь и исполнение самых заветных желаний! Твоя внутренняя сила расцветет подобно весенним цветам, а удача будет сопровождать тебя на каждом шагу.

Помни, что ты особенная и заслуживаешь всего самого лучшего. С праздником весны!`;
    
    return new Response(
      JSON.stringify({ prediction }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating prediction:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate prediction' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
