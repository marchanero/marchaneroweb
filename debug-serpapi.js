import { config } from 'dotenv';
import { getJson } from 'serpapi';

config();

async function debugSerpApi() {
  try {
    console.log('🔍 Testing SerpAPI response structure...');
    
    const response = await getJson({
      engine: "google_scholar_author",
      author_id: "PCALePwAAAAJ", // Robert Marchand
      num: 5,
      api_key: process.env.SERPAPI_API_KEY
    });
    
    console.log('\n📊 Full API Response:');
    console.log(JSON.stringify(response, null, 2));
    
    console.log('\n🎯 Author info:');
    console.log('Name:', response.author?.name);
    console.log('Affiliations:', response.author?.affiliations);
    console.log('Email:', response.author?.email);
    console.log('Interests:', response.author?.interests);
    
    console.log('\n📈 Citations info:');
    console.log('Cited by:', response.cited_by);
    
    console.log('\n📚 Articles sample:');
    if (response.articles && response.articles.length > 0) {
      console.log('First article:', response.articles[0]);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugSerpApi();
