#!/usr/bin/env node

/**
 * Script para verificar y configurar los secretos de Telegram necesarios para las notificaciones
 * 
 * Este script ayuda a comprobar si los secretos de Telegram están configurados.
 * Puede verificar tanto en GitHub Actions como en el archivo .env local.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const readline = require('readline');
const dotenv = require('dotenv');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔒 Verificador de configuración de Telegram para notificaciones académicas');
console.log('----------------------------------------------------------------');
console.log('Este script verificará si los secretos necesarios para las notificaciones');
console.log('por Telegram están configurados en el repositorio GitHub.\n');

// Verifica si estamos en un repositorio de git
const gitCheck = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
if (gitCheck.status !== 0) {
  console.error('❌ No estamos dentro de un repositorio Git. Este script debe ejecutarse en el directorio del proyecto.');
  process.exit(1);
}

// Verifica el acceso a GitHub CLI (gh)
const ghCheck = spawnSync('gh', ['--version'], { encoding: 'utf8' });
if (ghCheck.status !== 0) {
  console.error('❌ GitHub CLI (gh) no está instalado o no disponible. Este script requiere gh CLI.');
  console.log('Puedes instalarlo desde: https://cli.github.com/');
  process.exit(1);
}

// Verifica si el usuario tiene acceso al repositorio en GitHub
const ghAuthCheck = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
if (ghAuthCheck.status !== 0) {
  console.error('❌ No tienes autenticación activa con GitHub CLI.');
  console.log('Por favor, ejecuta "gh auth login" primero.');
  process.exit(1);
}

// Obtiene el nombre del repositorio actual
const getRepoInfo = () => {
  try {
    const remoteUrl = spawnSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).stdout.trim();
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
    throw new Error('No se pudo determinar el repositorio');
  } catch (error) {
    console.error('❌ No se pudo determinar la información del repositorio:', error.message);
    process.exit(1);
  }
};

const repoInfo = getRepoInfo();
console.log(`📁 Repositorio detectado: ${repoInfo.owner}/${repoInfo.repo}\n`);

// Comprueba si un secreto existe en GitHub
const checkSecret = async (secretName) => {
  const result = spawnSync('gh', ['secret', 'list'], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`❌ No se pudieron listar los secretos: ${result.stderr}`);
    return false;
  }

  return result.stdout.includes(secretName);
};

// Función principal
// Cargar variables de entorno desde .env
const loadEnvVars = () => {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.log('Archivo .env encontrado, cargando variables de entorno...');
    const result = dotenv.config();
    if (result.error) {
      console.error('Error al cargar el archivo .env:', result.error);
      return false;
    }
    return true;
  }
  console.log('No se encontró archivo .env local');
  return false;
};

const main = async () => {
  console.log('Verificando secretos de Telegram existentes...');
  
  // Intentar cargar variables desde .env
  const envLoaded = loadEnvVars();
  let telegramToExists = false;
  let telegramTokenExists = false;
  
  // Verificar en .env primero si se cargó correctamente
  if (envLoaded) {
    telegramToExists = !!process.env.TELEGRAM_TO;
    telegramTokenExists = !!process.env.TELEGRAM_TOKEN;
    
    if (telegramToExists && telegramTokenExists) {
      console.log('Variables de Telegram encontradas en el archivo .env local:');
      console.log(`TELEGRAM_TO: ✅ Configurado`);
      console.log(`TELEGRAM_TOKEN: ✅ Configurado`);
    } else {
      console.log('No se encontraron todas las variables de Telegram en el archivo .env local');
      // Verificar en GitHub si no están completas en .env
      telegramToExists = telegramToExists || await checkSecret('TELEGRAM_TO');
      telegramTokenExists = telegramTokenExists || await checkSecret('TELEGRAM_TOKEN');
      
      console.log(`TELEGRAM_TO: ${telegramToExists ? '✅ Configurado' : '❌ No configurado'}`);
      console.log(`TELEGRAM_TOKEN: ${telegramTokenExists ? '✅ Configurado' : '❌ No configurado'}`);
    }
  } else {
    // Verificar solo en GitHub si no hay .env
    telegramToExists = await checkSecret('TELEGRAM_TO');
    telegramTokenExists = await checkSecret('TELEGRAM_TOKEN');
    
    console.log(`TELEGRAM_TO: ${telegramToExists ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`TELEGRAM_TOKEN: ${telegramTokenExists ? '✅ Configurado' : '❌ No configurado'}`);
  }
  
  if (!telegramToExists || !telegramTokenExists) {
    console.log('\n⚠️ Faltan uno o más secretos necesarios para las notificaciones de Telegram.');
    console.log('Para configurar las notificaciones por Telegram, necesitarás:');
    console.log('1. Un bot de Telegram (usar BotFather: https://t.me/botfather)');
    console.log('2. El ID de chat donde enviar las notificaciones');
    console.log('\nPara configurar manualmente, ejecuta estos comandos:');
    console.log('gh secret set TELEGRAM_TO --body="chat_id"');
    console.log('gh secret set TELEGRAM_TOKEN --body="bot_token"\n');

    rl.question('¿Deseas configurar estos secretos ahora? (s/n): ', async (answer) => {
      if (answer.toLowerCase() === 's') {
        if (!telegramTokenExists) {
          rl.question('Token del bot de Telegram (de BotFather): ', async (token) => {
            if (token.trim()) {
              const setToken = spawnSync('gh', ['secret', 'set', 'TELEGRAM_TOKEN'], { 
                input: token.trim(),
                encoding: 'utf8'
              });
              
              if (setToken.status === 0) {
                console.log('✅ TELEGRAM_TOKEN configurado correctamente.');
              } else {
                console.error(`❌ Error al configurar TELEGRAM_TOKEN: ${setToken.stderr}`);
              }
              
              if (!telegramToExists) {
                rl.question('ID del chat de Telegram: ', async (chatId) => {
                  if (chatId.trim()) {
                    const setTo = spawnSync('gh', ['secret', 'set', 'TELEGRAM_TO'], { 
                      input: chatId.trim(),
                      encoding: 'utf8'
                    });
                    
                    if (setTo.status === 0) {
                      console.log('✅ TELEGRAM_TO configurado correctamente.');
                      finalize();
                    } else {
                      console.error(`❌ Error al configurar TELEGRAM_TO: ${setTo.stderr}`);
                      finalize();
                    }
                  } else {
                    console.log('⚠️ No se proporcionó un ID de chat válido.');
                    finalize();
                  }
                });
              } else {
                finalize();
              }
            } else {
              console.log('⚠️ No se proporcionó un token válido.');
              finalize();
            }
          });
        } else if (!telegramToExists) {
          rl.question('ID del chat de Telegram: ', async (chatId) => {
            if (chatId.trim()) {
              const setTo = spawnSync('gh', ['secret', 'set', 'TELEGRAM_TO'], { 
                input: chatId.trim(),
                encoding: 'utf8'
              });
              
              if (setTo.status === 0) {
                console.log('✅ TELEGRAM_TO configurado correctamente.');
                finalize();
              } else {
                console.error(`❌ Error al configurar TELEGRAM_TO: ${setTo.stderr}`);
                finalize();
              }
            } else {
              console.log('⚠️ No se proporcionó un ID de chat válido.');
              finalize();
            }
          });
        }
      } else {
        finalize();
      }
    });
  } else {
    console.log('\n✅ Todos los secretos necesarios para las notificaciones por Telegram están configurados.');
    finalize();
  }
};

const finalize = () => {
  console.log('\n🔔 NOTA: Si necesitas ayuda para obtener el ID de chat o crear un bot:');
  console.log('1. Crea un bot con @BotFather en Telegram');
  console.log('2. Inicia una conversación con el bot');
  console.log('3. Visita https://api.telegram.org/bot<token>/getUpdates para obtener tu chat_id');
  console.log('\n📚 Para más información, consulta la documentación:');
  console.log('https://core.telegram.org/bots#6-botfather');

  console.log('\n✅ Verificación completada.');
  rl.close();
};

main();
