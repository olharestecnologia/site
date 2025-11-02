const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');

const logoConfig = require('./logo-urls.json');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    protocol.get(url, options, (response) => {
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
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png({ quality: 90 })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.log(`    ⚠ Erro ao otimizar: ${error.message}`);
    // Tentar apenas copiar o arquivo
    try {
      fs.copyFileSync(inputPath, outputPath);
      return true;
    } catch (e) {
      return false;
    }
  }
}

async function processLogo(item, type) {
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'convenios');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `${item.slug}.png`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  ${item.name}: já existe`);
    return { success: true, manual: false };
  }
  
  if (item.url === 'manual') {
    console.log(`  📝 ${item.name}: download manual necessário`);
    console.log(`      ${item.fallback}`);
    return { success: false, manual: true, item };
  }
  
  try {
    console.log(`  📥 ${item.name}: baixando...`);
    
    const tempPath = path.join(outputDir, `${item.slug}_temp`);
    await downloadImage(item.url, tempPath);
    
    console.log(`      Otimizando...`);
    const optimized = await optimizeImage(tempPath, outputPath);
    
    // Limpar arquivo temporário
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    if (optimized) {
      console.log(`  ✅ ${item.name}: salvo com sucesso!`);
      return { success: true, manual: false };
    } else {
      console.log(`  ❌ ${item.name}: falhou na otimização`);
      return { success: false, manual: false };
    }
    
  } catch (error) {
    console.log(`  ❌ ${item.name}: erro - ${error.message}`);
    console.log(`      Fallback: ${item.fallback}`);
    return { success: false, manual: false, item };
  }
}

async function main() {
  console.log('\n🚀 Download de Logos - Clínica Olhares');
  console.log('=' .repeat(70));
  
  let stats = {
    success: 0,
    failed: 0,
    manual: 0
  };
  
  const manualList = [];
  
  console.log('\n📋 CONVÊNIOS');
  console.log('-' .repeat(70));
  
  for (const convenio of logoConfig.convenios) {
    const result = await processLogo(convenio, 'convenio');
    if (result.success) stats.success++;
    else if (result.manual) {
      stats.manual++;
      manualList.push({ ...convenio, type: 'Convênio' });
    } else stats.failed++;
  }
  
  console.log('\n🤝 PARCEIROS');
  console.log('-' .repeat(70));
  
  for (const parceiro of logoConfig.parceiros) {
    const result = await processLogo(parceiro, 'parceiro');
    if (result.success) stats.success++;
    else if (result.manual) {
      stats.manual++;
      manualList.push({ ...parceiro, type: 'Parceiro' });
    } else stats.failed++;
  }
  
  console.log('\n' + '=' .repeat(70));
  console.log('📊 RESUMO');
  console.log('=' .repeat(70));
  console.log(`✅ Baixados com sucesso: ${stats.success}`);
  console.log(`❌ Falharam: ${stats.failed}`);
  console.log(`📝 Requerem download manual: ${stats.manual}`);
  
  if (manualList.length > 0) {
    console.log('\n' + '=' .repeat(70));
    console.log('📝 LISTA PARA DOWNLOAD MANUAL');
    console.log('=' .repeat(70));
    console.log('\nPara cada item abaixo:');
    console.log('1. Acesse o link indicado');
    console.log('2. Baixe o logo em boa qualidade');
    console.log('3. Renomeie para o nome do arquivo indicado');
    console.log('4. Salve em: public/images/convenios/\n');
    
    manualList.forEach((item, index) => {
      console.log(`${index + 1}. ${item.type}: ${item.name}`);
      console.log(`   Arquivo: ${item.slug}.png`);
      console.log(`   ${item.fallback}\n`);
    });
    
    // Salvar lista em arquivo
    const manualListPath = path.join(__dirname, 'logos-manual-download.txt');
    const manualContent = manualList.map((item, index) => 
      `${index + 1}. ${item.type}: ${item.name}\n` +
      `   Arquivo: ${item.slug}.png\n` +
      `   ${item.fallback}\n`
    ).join('\n');
    
    fs.writeFileSync(manualListPath, manualContent);
    console.log(`\n💾 Lista salva em: ${manualListPath}`);
  }
  
  console.log('\n✨ Processo concluído!');
  console.log('=' .repeat(70));
  console.log('\nPróximos passos:');
  console.log('1. Revise as imagens em public/images/convenios/');
  console.log('2. Faça o download manual dos logos pendentes');
  console.log('3. O site já está configurado para exibir os logos automaticamente\n');
}

main().catch(console.error);

