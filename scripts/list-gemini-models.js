/**
 * Script to list available Gemini models
 * Run with: node scripts/list-gemini-models.js
 */

require('dotenv').config();
const axios = require('axios');

async function listModels() {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in your environment variables');
    process.exit(1);
  }

  try {
    // Call the models.list endpoint
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    
    console.log('\n=== AVAILABLE GEMINI MODELS ===\n');
    
    if (response.data && response.data.models) {
      // Sort models by name
      const sortedModels = response.data.models.sort((a, b) => a.name.localeCompare(b.name));
      
      // Display model info
      sortedModels.forEach(model => {
        const modelName = model.name.split('/').pop();
        console.log(`Model: ${modelName}`);
        console.log(`  Display Name: ${model.displayName || 'N/A'}`);
        console.log(`  Description: ${model.description || 'N/A'}`);
        console.log(`  Version: ${model.version || 'N/A'}`);
        console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ') || 'None'}`);
        console.log('');
      });
      
      console.log(`Total models available: ${sortedModels.length}`);
    } else {
      console.log('No models found or unexpected API response format');
    }
    
  } catch (error) {
    console.error('Error fetching models:');
    if (error.response) {
      // API responded with an error
      console.error(`Status code: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response received from API');
    } else {
      // Error in request setup
      console.error('Error message:', error.message);
    }
  }
}

listModels(); 