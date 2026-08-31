const https = require('https');

exports.handler = async (event, context) => {
  // Verificar que solo se permita POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verificar autenticación: sin WEBHOOK_SECRET configurada, el endpoint
    // se deniega por completo (fail-closed) en vez de quedar abierto a
    // cualquiera que descubra la URL de la función.
    const authHeader = event.headers.authorization;
    const expectedAuth = process.env.WEBHOOK_SECRET;

    if (!expectedAuth) {
      console.error('WEBHOOK_SECRET no está configurada: rechazando la petición.');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server misconfigured' })
      };
    }

    if (authHeader !== `Bearer ${expectedAuth}`) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Disparar el workflow de GitHub Actions
    const triggerWorkflow = () => {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.github.com',
          path: '/repos/rsanchezreolid/marchaneroweb/actions/workflows/update-scholar-data.yml/dispatches',
          method: 'POST',
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Netlify-Function'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 204) {
              resolve({ success: true });
            } else {
              reject(new Error(`GitHub API responded with status ${res.statusCode}: ${data}`));
            }
          });
        });

        req.on('error', reject);
        req.write(JSON.stringify({ ref: 'main' }));
        req.end();
      });
    };

    await triggerWorkflow();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Scholar data update triggered successfully',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error triggering scholar update:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
