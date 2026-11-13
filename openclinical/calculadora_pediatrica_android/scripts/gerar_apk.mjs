// Gera o APK com a versão atual do app principal: build web (lê ../frontend_ui/src),
// cap sync e Gradle. Uso: npm run apk  (APK de debug, instalável direto no celular)
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WINDOWS = process.platform === 'win32';

// Gradle 8.2 do Capacitor 6 precisa de JDK 17 (nem o 8, nem versões novas demais como a 26)
function versaoJava(home) {
  try {
    const saida = execSync(`"${path.join(home, 'bin', 'java')}" -version 2>&1`, { encoding: 'utf8' });
    const casado = saida.match(/version "(\d+)(?:\.(\d+))?/);
    return casado ? (casado[1] === '1' ? Number(casado[2]) : Number(casado[1])) : null;
  } catch {
    return null;
  }
}

function localizarJdk() {
  const candidatos = [process.env.JAVA_HOME_17, process.env.JAVA_HOME];
  if (WINDOWS) {
    const programas = process.env.ProgramFiles ?? 'C:/Program Files';
    for (const pasta of ['Eclipse Adoptium', 'Java', 'Microsoft']) {
      const raiz = path.join(programas, pasta);
      if (existsSync(raiz)) candidatos.push(...readdirSync(raiz).filter((d) => /^jdk-?(17|21)/.test(d)).map((d) => path.join(raiz, d)));
    }
    candidatos.push(path.join(programas, 'Android', 'Android Studio', 'jbr'));
  }
  const jdk = candidatos.filter(Boolean).find((home) => {
    const versao = versaoJava(home);
    return versao !== null && versao >= 17 && versao <= 21;
  });
  if (!jdk) throw new Error('JDK 17 não encontrado. Instale o Temurin 17 ou defina JAVA_HOME_17.');
  return jdk;
}

const rodar = (comando, opcoes = {}) => execSync(comando, { stdio: 'inherit', cwd: APP, ...opcoes });

rodar('npm run build');
rodar('npx cap sync android');

const JAVA_HOME = localizarJdk();
console.log(`Gradle com JDK em ${JAVA_HOME}`);
const ANDROID = path.join(APP, 'android');
rodar(`"${path.join(ANDROID, WINDOWS ? 'gradlew.bat' : 'gradlew')}" assembleDebug`, {
  cwd: ANDROID,
  env: { ...process.env, JAVA_HOME },
});

const gerado = path.join(APP, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
mkdirSync(path.join(APP, 'apk'), { recursive: true });
const destino = path.join(APP, 'apk', 'OpenClinical-DosePediatrica.apk');
copyFileSync(gerado, destino);
console.log(`\nAPK pronto: ${destino}`);
