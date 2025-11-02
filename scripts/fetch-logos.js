const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { chromium } = require('playwright');
const sharp = require('sharp');

// Lista de convênios e parceiros
const convenios = [
  'AMAGIS',
  'Bradesco Saúde',
  'Cassi',
  'Cemig Saúde',
  'IPSEMG',
  'Libertas',
  'Polícia Militar IPSM',
  'Postal Saúde',
  'Saúde Caixa',
  'Sulamérica',
  'Unimed',
  'Vale Saúde',
];

const parceiros = [
  'AFFAB',
  'Cartão de Todos',
  'CDL Divinópolis',
  'Divicard',
  'Divimédicos',
  'Estrututura do Viver',
  'Farmax',
  'Medprev',
  'NASS',
  'Poupa Medic',
  'SAAE',
  'SIMETRAL',
];

// Função para normalizar o nome para o arquivo
function normalizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

// Função para baixar imagem
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Função para otimizar imagem com sharp
async function optimizeImage(filepath) {
  try {
    await sharp(filepath)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(filepath.replace(/\.[^.]+$/, '.png'));
    
    // Remove arquivo original se for diferente
    if (!filepath.endsWith('.png')) {
      fs.unlinkSync(filepath);
    }
    
    console.log(`  ✓ Imagem otimizada`);
  } catch (error) {
    console.log(`  ⚠ Erro ao otimizar: ${error.message}`);
  }
}

// Função principal para buscar logo
async function fetchLogo(page, name, type = 'convenio') {
  console.log(`\n🔍 Buscando logo para: ${name}`);
  
  const searchQuery = `${name} logo`;
  const filename = normalizeFilename(name);
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'convenios');
  
  // Criar diretório se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${filename}.png`);
  
  // Verificar se já existe
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭ Logo já existe: ${filename}.png`);
    return;
  }
  
  try {
    // Navegar para o Google Images
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    // Aguardar um pouco para a página carregar
    await page.waitForTimeout(2000);
    
    // Tentar encontrar as imagens usando diferentes estratégias
    let imageUrl = null;
    
    // Estratégia 1: Pegar imagens do grid principal
    try {
      const images = await page.$$eval('img', imgs => 
        imgs
          .map(img => ({
            src: img.src,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          }))
          .filter(img => 
            img.src && 
            img.src.startsWith('http') && 
            !img.src.includes('google') && 
            !img.src.includes('gstatic') &&
            img.width > 100 && 
            img.height > 100
          )
          .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      );
      
      if (images.length > 0) {
        imageUrl = images[0].src;
      }
    } catch (e) {
      console.log(`  ⚠ Estratégia 1 falhou: ${e.message}`);
    }
    
    // Estratégia 2: Clicar na primeira imagem e pegar do preview
    if (!imageUrl) {
      try {
        const imageElements = await page.$$('img[jsname]');
        if (imageElements.length > 0) {
          await imageElements[0].click();
          await page.waitForTimeout(2000);
          
          const previewImg = await page.$('img.sFlh5c, img.iPVvYb');
          if (previewImg) {
            imageUrl = await previewImg.getAttribute('src');
          }
        }
      } catch (e) {
        console.log(`  ⚠ Estratégia 2 falhou: ${e.message}`);
      }
    }
    
    // Estratégia 3: Pegar qualquer imagem grande
    if (!imageUrl) {
      try {
        const allImages = await page.$$eval('img', imgs => 
          imgs
            .map(img => img.src)
            .filter(src => src && src.startsWith('http') && src.length > 100)
        );
        
        if (allImages.length > 0) {
          imageUrl = allImages[0];
        }
      } catch (e) {
        console.log(`  ⚠ Estratégia 3 falhou: ${e.message}`);
      }
    }
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
      console.log(`  ✗ URL da imagem não encontrada ou inválida`);
      return;
    }
    
    console.log(`  📥 Baixando de: ${imageUrl.substring(0, 80)}...`);
    
    // Baixar a imagem
    const tempPath = path.join(outputDir, `${filename}_temp`);
    await downloadImage(imageUrl, tempPath);
    
    console.log(`  ✓ Download concluído`);
    
    // Otimizar a imagem
    await optimizeImage(tempPath);
    
    // Renomear para o nome final
    const finalTempPath = tempPath.replace(/\.[^.]+$/, '.png');
    if (fs.existsSync(finalTempPath)) {
      fs.renameSync(finalTempPath, outputPath);
    } else if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, outputPath);
    }
    
    console.log(`  ✅ Logo salvo: ${filename}.png`);
    
  } catch (error) {
    console.log(`  ✗ Erro: ${error.message}`);
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando busca de logos...\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({
    headless: false
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  console.log('\n📋 CONVÊNIOS');
  console.log('=' .repeat(60));
  
  for (const convenio of convenios) {
    await fetchLogo(page, convenio, 'convenio');
    await page.waitForTimeout(3000); // Aguardar 3 segundos entre requests
  }
  
  console.log('\n\n🤝 PARCEIROS');
  console.log('=' .repeat(60));
  
  for (const parceiro of parceiros) {
    await fetchLogo(page, parceiro, 'parceiro');
    await page.waitForTimeout(3000); // Aguardar 3 segundos entre requests
  }
  
  await browser.close();
  
  console.log('\n' + '=' .repeat(60));
  console.log('✨ Processo concluído!');
  console.log('=' .repeat(60));
  console.log('\nPróximos passos:');
  console.log('1. Revise as imagens em /public/images/convenios/');
  console.log('2. Substitua manualmente as que não ficaram adequadas');
  console.log('3. O componente ConveniosSection.tsx já está atualizado\n');
}

main().catch(console.error);

