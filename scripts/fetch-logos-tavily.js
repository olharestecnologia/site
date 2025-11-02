const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { chromium } = require('playwright');
const sharp = require('sharp');

// Lista de convênios e parceiros com termos de busca otimizados
const convenios = [
  { name: 'AMAGIS', search: 'AMAGIS saúde Minas Gerais' },
  { name: 'Bradesco Saúde', search: 'Bradesco Saúde plano de saúde' },
  { name: 'Cassi', search: 'Cassi Caixa Econômica Federal saúde' },
  { name: 'Cemig Saúde', search: 'Cemig Saúde plano de saúde' },
  { name: 'IPSEMG', search: 'IPSEMG Instituto de Previdência Minas Gerais' },
  { name: 'Libertas', search: 'Libertas saúde plano' },
  { name: 'Polícia Militar IPSM', search: 'IPSM Polícia Militar Minas Gerais saúde' },
  { name: 'Postal Saúde', search: 'Postal Saúde Correios plano' },
  { name: 'Saúde Caixa', search: 'Saúde Caixa plano de saúde' },
  { name: 'Sulamérica', search: 'Sulamérica Seguros Saúde' },
  { name: 'Unimed', search: 'Unimed plano de saúde' },
  { name: 'Vale Saúde', search: 'Vale Saúde plano' },
];

const parceiros = [
  { name: 'AFFAB', search: 'AFFAB Divinópolis' },
  { name: 'Cartão de Todos', search: 'Cartão de Todos Divinópolis' },
  { name: 'CDL Divinópolis', search: 'CDL Câmara Dirigentes Lojistas Divinópolis' },
  { name: 'Divicard', search: 'Divicard Divinópolis' },
  { name: 'Divimédicos', search: 'Divimédicos Divinópolis saúde' },
  { name: 'Estrututura do Viver', search: 'Estrututura do Viver Divinópolis' },
  { name: 'Farmax', search: 'Farmax farmácia Divinópolis' },
  { name: 'Medprev', search: 'Medprev planos de saúde' },
  { name: 'NASS', search: 'NASS Divinópolis saúde' },
  { name: 'Poupa Medic', search: 'Poupa Medic Divinópolis' },
  { name: 'SAAE', search: 'SAAE Divinópolis saneamento' },
  { name: 'SIMETRAL', search: 'SIMETRAL Sindicato Metalúrgicos' },
];

// URLs oficiais conhecidas (preenchidas manualmente ou através de busca)
const knownUrls = {
  'bradesco-saude': 'https://banco.bradesco/html/classic/produtos-servicos/bradesco-seguros/bradesco-saude.shtm',
  'unimed': 'https://www.unimed.coop.br',
  'sulamerica': 'https://www.sulamerica.com.br',
  'cassi': 'https://www.cassi.com.br',
  'medprev': 'https://medprev.online',
};

function normalizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

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
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function optimizeImage(filepath) {
  try {
    const outputPath = filepath.replace(/\.[^.]+$/, '.png');
    await sharp(filepath)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(outputPath);
    
    if (filepath !== outputPath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    console.log(`  ✓ Imagem otimizada`);
    return outputPath;
  } catch (error) {
    console.log(`  ⚠ Erro ao otimizar: ${error.message}`);
    return filepath;
  }
}

async function fetchLogoFromWebsite(page, item) {
  const filename = normalizeFilename(item.name);
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'convenios');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${filename}.png`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭ Logo já existe: ${filename}.png`);
    return true;
  }
  
  console.log(`\n🔍 Buscando logo para: ${item.name}`);
  
  try {
    // Tentar usar URL conhecida ou buscar
    const searchUrl = knownUrls[filename];
    
    if (searchUrl) {
      console.log(`  🌐 Acessando site oficial: ${searchUrl}`);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      // Buscar no DuckDuckGo (menos restritivo que Google)
      console.log(`  🔎 Buscando: ${item.search}`);
      await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(item.search + ' logo')}&iax=images&ia=images`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
    }
    
    await page.waitForTimeout(3000);
    
    // Procurar por imagens de logo
    let imageUrl = null;
    
    // Estratégia: procurar imagens que provavelmente são logos
    const images = await page.$$eval('img', imgs => 
      imgs
        .map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          className: img.className
        }))
        .filter(img => {
          const alt = img.alt.toLowerCase();
          const className = img.className.toLowerCase();
          const hasLogKeyword = alt.includes('logo') || className.includes('logo') || 
                                alt.includes('brand') || className.includes('brand');
          const isGoodSize = img.width >= 100 && img.height >= 50 && 
                            img.width <= 800 && img.height <= 800;
          const isValidUrl = img.src && img.src.startsWith('http') && 
                           !img.src.includes('data:') && img.src.length > 50;
          
          return isValidUrl && isGoodSize && (hasLogKeyword || img.width > 150);
        })
        .sort((a, b) => {
          // Priorizar imagens com "logo" no alt ou className
          const aScore = (a.alt.toLowerCase().includes('logo') ? 100 : 0) + 
                        (a.className.toLowerCase().includes('logo') ? 100 : 0) +
                        (a.width * a.height) / 1000;
          const bScore = (b.alt.toLowerCase().includes('logo') ? 100 : 0) + 
                        (b.className.toLowerCase().includes('logo') ? 100 : 0) +
                        (b.width * b.height) / 1000;
          return bScore - aScore;
        })
    );
    
    if (images.length > 0) {
      imageUrl = images[0].src;
      console.log(`  📸 Imagem encontrada: ${images[0].alt || 'sem descrição'}`);
    }
    
    if (!imageUrl) {
      console.log(`  ✗ Nenhuma imagem adequada encontrada`);
      return false;
    }
    
    console.log(`  📥 Baixando: ${imageUrl.substring(0, 80)}...`);
    
    const tempPath = path.join(outputDir, `${filename}_temp.jpg`);
    await downloadImage(imageUrl, tempPath);
    
    console.log(`  ✓ Download concluído`);
    
    const finalPath = await optimizeImage(tempPath);
    
    if (finalPath !== outputPath) {
      fs.renameSync(finalPath, outputPath);
    }
    
    console.log(`  ✅ Logo salvo: ${filename}.png`);
    return true;
    
  } catch (error) {
    console.log(`  ✗ Erro: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando busca de logos (nova abordagem)...\n');
  console.log('=' .repeat(60));
  
  const browser = await chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  let successCount = 0;
  let failCount = 0;
  
  console.log('\n📋 CONVÊNIOS');
  console.log('=' .repeat(60));
  
  for (const convenio of convenios) {
    const success = await fetchLogoFromWebsite(page, convenio);
    if (success) successCount++;
    else failCount++;
    await page.waitForTimeout(3000);
  }
  
  console.log('\n\n🤝 PARCEIROS');
  console.log('=' .repeat(60));
  
  for (const parceiro of parceiros) {
    const success = await fetchLogoFromWebsite(page, parceiro);
    if (success) successCount++;
    else failCount++;
    await page.waitForTimeout(3000);
  }
  
  await browser.close();
  
  console.log('\n' + '=' .repeat(60));
  console.log('✨ Processo concluído!');
  console.log('=' .repeat(60));
  console.log(`\n✅ Sucessos: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log('\nPróximos passos:');
  console.log('1. Revise as imagens em /public/images/convenios/');
  console.log('2. Para logos que falharam, baixe manualmente dos sites oficiais');
  console.log('3. O componente ConveniosSection.tsx já está configurado\n');
}

main().catch(console.error);

