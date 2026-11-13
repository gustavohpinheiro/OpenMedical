# Calculadora de Dose Pediátrica (APK Android)

App Android que contém só a calculadora de dose pediátrica do OpenClinical, para uso offline no celular.

## Vinculado ao app principal

Este subprojeto não copia código nem dados. Ele importa direto de `../frontend_ui/src` (alias `@openclinical`):

- `components/PediatricCalculator.tsx`: a mesma tela da seção Pediatria do app principal;
- `pediatria_ftn.ts`, `clinical_fallback.ts` e `api.ts`: leitura dos esquemas do FTN e o cálculo (versão TypeScript, sem o backend Rust);
- `data/formulario_terapeutico.ts` e `data/catalogo_cmed_nacional.ts`: monografias do FTN e apresentações comerciais da CMED;
- `index.css` e o `tailwind.config.js`: mesmo visual, inclusive o tema claro.

Qualquer mudança nesses arquivos entra no próximo APK, sem passo extra. O ícone também vem do desenho do atalho
"Dose infantil" em `core_rust/openclinical_desktop/gerar_icones.py` (rode `npm run icones` se o desenho mudar).

O GitHub Actions (`.github/workflows/calculadora-pediatrica-apk.yml`) recompila o APK a cada push na `main` que toque
em `frontend_ui/src` ou neste subprojeto, e publica o arquivo como artefato da execução.

## Gerar o APK no Windows

Requisitos: Node.js, JDK 17 (o script o encontra mesmo que o `JAVA_HOME` aponte para outra versão) e Android SDK
com a plataforma 34 (`ANDROID_HOME`). As dependências do app principal precisam estar instaladas (`npm install` em `frontend_ui`).

```bash
npm install
npm run apk
```

O APK sai em `apk/OpenClinical-DosePediatrica.apk`. É um APK de debug, instalável direto no celular
(permita "instalar apps de fontes desconhecidas").

Outros comandos:

- `npm run dev`: abre a calculadora no navegador em http://localhost:5174;
- `npm run sync`: só atualiza os arquivos web dentro de `android/` (para abrir no Android Studio).
