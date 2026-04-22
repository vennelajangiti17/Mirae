const { GoogleGenerativeAI } = require('@google/generative-ai'); 
async function test() { 
  try { 
    const genAI = new GoogleGenerativeAI('AIzaSyAqtZWHxZLZJ5QFOji9wT4TAeCWi-WSj9U'); 
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 
    const result = await model.generateContent('Return JSON: { "matchScore": 50 }'); 
    console.log('Result:', result.response.text()); 
  } catch (e) { 
    console.error('Error:', e); 
  } 
} 
test();
