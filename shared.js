const GROQ_API_KEY = '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';

// Starfield
function initStars(count = 90) {
  const el = document.getElementById('stars');
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*5}s;--bright:${0.3+Math.random()*0.7};width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;`;
    el.appendChild(s);
  }
}

// Numerology
function numerologyValue(name) {
  const map = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
  let sum = name.toLowerCase().replace(/[^a-z]/g,'').split('').reduce((a,c)=>a+(map[c]||0),0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33)
    sum = String(sum).split('').reduce((a,c)=>a+Number(c),0);
  return sum;
}

const numDescriptions = {
  1:'Leadership and independence — a pioneer who forges their own path.',
  2:'Harmony and diplomacy — a natural mediator and loving soul.',
  3:'Creativity and expression — joy and artistic gifts flow naturally.',
  4:'Stability and diligence — a builder of lasting foundations.',
  5:'Freedom and adventure — restless, curious, and magnetic.',
  6:'Nurturing and responsibility — a healer at heart.',
  7:'Wisdom and introspection — a seeker of deeper truths.',
  8:'Power and ambition — material success and strong will.',
  9:'Compassion and idealism — a humanitarian spirit.',
  11:'Master Intuition — heightened sensitivity and spiritual insight.',
  22:'Master Builder — transforming vision into reality at scale.',
  33:'Master Teacher — devoted to uplifting all of humanity.'
};

// Groq API call
async function lookupName(name) {
  const prompt = `You are an expert in name etymology, world religions, and cultural history.
The user wants to know everything about the name "${name}".
Respond ONLY with a valid JSON object (no markdown, no backticks, no extra text) with these exact keys:
{
  "pronunciation": "phonetic guide e.g. ah-REE-yah",
  "meaning": "2-3 sentence rich description of what this name means",
  "origin": "2-3 sentence description of the linguistic and geographic origin",
  "religions": ["religions this name is associated with"],
  "countries": ["countries or regions this name is common in"],
  "gender": "Male / Female / Unisex",
  "language_root": "e.g. Sanskrit, Arabic, Hebrew, Latin, Greek",
  "religious_significance": "2-3 sentences about significance in religion or mythology",
  "cultural_symbolism": "2-3 sentences about cultural meaning, traits, or symbolism",
  "famous_people": [
    {"name": "Full Name", "description": "short description"},
    {"name": "Full Name", "description": "short description"}
  ],
  "variations": ["at least 5 similar or variant names"]
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1200,
      messages: [
        { role: 'system', content: 'You are an expert in name etymology. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.choices[0].message.content.replace(/```json|```/g,'').trim());
}

// Nav active state
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
