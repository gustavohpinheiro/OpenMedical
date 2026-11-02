import React from 'react';
import { BlocoPrescricao, PerfilMedico, Paciente } from '../types.ts';
import { OPENCLINICAL_LOGO_BASE64 } from './OpenClinicalLogo.tsx';
import { ShieldCheck, QrCode } from 'lucide-react';

interface PrescriptionSheetRendererProps {
  blocos: BlocoPrescricao[];
  perfilMedico: PerfilMedico;
  pacienteAtivo: Paciente | null;
  dataEmissao?: string;
  className?: string;
}

// Helper para evitar duplicação "Dr(a). Dr."
const formatarNomeMedico = (nome?: string) => {
  if (!nome || !nome.trim()) return 'Dr(a). Médico Prescritor';
  const limpo = nome.trim();
  if (/^dr(a)?\.?\s+/i.test(limpo)) {
    return limpo;
  }
  return `Dr(a). ${limpo}`;
};

export const PrescriptionSheetRenderer: React.FC<PrescriptionSheetRendererProps> = ({
  blocos,
  perfilMedico,
  pacienteAtivo,
  dataEmissao,
  className = '',
}) => {
  const dataHoje = dataEmissao || new Date().toLocaleDateString('pt-BR');
  const formatoPapel = (perfilMedico.tamanho_papel_receita || 'A4').toUpperCase() as 'A4' | 'A5';
  const estilo = perfilMedico.estilo_receita || 'moderno';

  // 1. Particionamento Regulatório Estrito dos Blocos
  const blocosControlados = blocos.filter(
    (b) =>
      b.tipo === 'medicamento' &&
      (b.medicamento_detalhe?.tipo_receituario === 'controle_especial_c1' ||
        b.medicamento_detalhe?.tipo_receituario === 'notificacao_b_azul' ||
        b.medicamento_detalhe?.tipo_receituario === 'notificacao_a_amarela')
  );

  const blocosAntimicrobianos = blocos.filter(
    (b) =>
      b.tipo === 'medicamento' &&
      b.medicamento_detalhe?.tipo_receituario === 'antimicrobiano'
  );

  const blocosSimples = blocos.filter(
    (b) =>
      b.tipo === 'medicamento' &&
      b.medicamento_detalhe?.tipo_receituario !== 'controle_especial_c1' &&
      b.medicamento_detalhe?.tipo_receituario !== 'notificacao_b_azul' &&
      b.medicamento_detalhe?.tipo_receituario !== 'notificacao_a_amarela' &&
      b.medicamento_detalhe?.tipo_receituario !== 'antimicrobiano'
  );

  const blocosExames = blocos.filter((b) => b.tipo === 'exame');

  const blocosOrientacoes = blocos.filter(
    (b) => b.tipo === 'orientacao' || b.tipo === 'dieta'
  );

  // Paginação: Máximo 3 substâncias por folha para Controle Especial (Portaria 344/98)
  const paginasControlados: BlocoPrescricao[][] = [];
  for (let i = 0; i < blocosControlados.length; i += 3) {
    paginasControlados.push(blocosControlados.slice(i, i + 3));
  }

  // Paginação: Máximo 3 antimicrobianos por folha (RDC 471/2021)
  const paginasAntimicrobianos: BlocoPrescricao[][] = [];
  for (let i = 0; i < blocosAntimicrobianos.length; i += 3) {
    paginasAntimicrobianos.push(blocosAntimicrobianos.slice(i, i + 3));
  }

  // Paginação: Máximo 4 medicamentos por folha para Receita Simples
  const paginasSimples: BlocoPrescricao[][] = [];
  for (let i = 0; i < blocosSimples.length; i += 4) {
    paginasSimples.push(blocosSimples.slice(i, i + 4));
  }

  // Paginação: Máximo 6 exames por folha de Solicitação de Exames
  const paginasExames: BlocoPrescricao[][] = [];
  for (let i = 0; i < blocosExames.length; i += 6) {
    paginasExames.push(blocosExames.slice(i, i + 6));
  }

  // Paginação: Máximo 4 orientações por folha de Orientações Gerais
  const paginasOrientacoes: BlocoPrescricao[][] = [];
  for (let i = 0; i < blocosOrientacoes.length; i += 4) {
    paginasOrientacoes.push(blocosOrientacoes.slice(i, i + 4));
  }

  // Se a cesta estiver 100% vazia, renderiza 1 folha em branco de modelo
  if (
    paginasControlados.length === 0 &&
    paginasAntimicrobianos.length === 0 &&
    paginasSimples.length === 0 &&
    paginasExames.length === 0 &&
    paginasOrientacoes.length === 0
  ) {
    paginasSimples.push([]);
  }

  // Identidade Visual (Logotipo)
  const logoSrc = perfilMedico.logo_base64
    ? perfilMedico.logo_base64
    : !perfilMedico.ocultar_logo_padrao
    ? OPENCLINICAL_LOGO_BASE64
    : null;

  // Papel Timbrado / Marca d'água
  const temPapelTimbradoProprio =
    perfilMedico.usar_papel_timbrado_proprio && Boolean(perfilMedico.papel_timbrado_base64);
  const temMarcaDaguaPadrao = !perfilMedico.ocultar_papel_timbrado_padrao && !temPapelTimbradoProprio;

  const dimensoesFolha =
    formatoPapel === 'A5'
      ? 'w-full max-w-[148mm] min-h-[210mm] p-6 text-[10px]'
      : 'w-full max-w-[210mm] min-h-[297mm] p-10 text-xs';

  // Subcomponente de Cabeçalho da Folha (sem corte do nome da clínica e sem 'Dr(a). Dr.')
  const renderCabecalho = () => (
    <div className="relative z-10 border-b pb-4 mb-4 flex items-center justify-between border-slate-300">
      <div className="flex items-center space-x-3 flex-1 min-w-0 pr-4">
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Logotipo Clínico"
            className={`${formatoPapel === 'A5' ? 'h-10' : 'h-14'} max-w-[160px] object-contain flex-shrink-0 drop-shadow-sm`}
          />
        )}
        <div className="min-w-0 flex-1">
          <h1
            className={`font-black uppercase tracking-wider ${
              formatoPapel === 'A5' ? 'text-xs' : 'text-sm'
            } ${estilo === 'classico' ? 'font-serif text-slate-900' : 'text-teal-900'} leading-tight`}
          >
            {perfilMedico.nome_clinica || 'CONSULTÓRIO MÉDICO'}
          </h1>
          <p className="text-[10px] text-slate-600 font-medium leading-tight mt-0.5">
            {perfilMedico.endereco_consultorio || 'Atendimento Médico Especializado'}
          </p>
          {perfilMedico.telefone_consultorio && (
            <p className="text-[9px] text-slate-500 mt-0.5">Tel: {perfilMedico.telefone_consultorio}</p>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-slate-900 ${formatoPapel === 'A5' ? 'text-xs' : 'text-sm'} leading-tight`}>
          {formatarNomeMedico(perfilMedico.nome_completo)}
        </p>
        <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
          CRM/{perfilMedico.uf_crm || 'BR'} {perfilMedico.crm || '000000'}
          {perfilMedico.rqe ? ` • RQE ${perfilMedico.rqe}` : ''}
        </p>
        <p className="text-[10px] text-teal-800 font-medium mt-0.5">
          {perfilMedico.especialidade || 'Clínica Médica'}
        </p>
      </div>
    </div>
  );

  // Subcomponente de Identificação do Paciente
  const renderPaciente = (paginaAtual: number, totalPaginas: number, destacarIdadeSexo = false) => (
    <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-5 space-y-1 text-slate-800">
      <div className="flex justify-between items-baseline font-bold">
        <span>PACIENTE: {pacienteAtivo ? pacienteAtivo.nome_completo : 'Paciente Geral'}</span>
        <span className="text-[10px] font-normal text-slate-600">DATA: {dataHoje}</span>
      </div>
      <div className="flex justify-between items-baseline text-[10px] text-slate-600">
        <span>
          {pacienteAtivo?.cpf ? `CPF: ${pacienteAtivo.cpf}` : 'Documento: Não informado'}{' '}
          {pacienteAtivo?.cns ? `• CNS: ${pacienteAtivo.cns}` : ''}
        </span>
        <span>
          {destacarIdadeSexo && (
            <span className="font-semibold text-teal-900 bg-teal-100/60 px-1.5 py-0.5 rounded mr-2">
              Idade: {pacienteAtivo?.idade_anos ? `${pacienteAtivo.idade_anos} anos` : 'Não informada'} • Sexo: {pacienteAtivo?.sexo || 'Não informado'}
            </span>
          )}
          Folha {paginaAtual} de {totalPaginas}
        </span>
      </div>
    </div>
  );

  // Subcomponente de Rodapé e Assinatura Eletrônica
  const renderRodape = () => (
    <div className="relative z-10 pt-6 mt-auto text-center space-y-2">
      {perfilMedico.usar_assinatura_eletronica !== false && perfilMedico.assinatura_base64 ? (
        <div className="w-80 mx-auto space-y-1">
          <div className="h-12 flex items-end justify-center">
            <img
              src={perfilMedico.assinatura_base64}
              alt="Assinatura Eletrônica do Médico"
              className="max-h-12 max-w-[200px] object-contain drop-shadow-sm"
            />
          </div>
          <div className="border-t border-slate-400 pt-1">
            <p className="font-bold text-xs text-slate-900">{formatarNomeMedico(perfilMedico.nome_completo)}</p>
            <p className="text-[10px] text-slate-600">
              CRM/{perfilMedico.uf_crm} {perfilMedico.crm}
              {perfilMedico.rqe ? ` • RQE ${perfilMedico.rqe}` : ''}
            </p>
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded text-[8px] text-teal-950 font-mono">
            <ShieldCheck className="w-3 h-3 text-teal-600 flex-shrink-0" />
            <span>Assinatura Eletrônica Avançada &bull; MP 2.200-2/01 &bull; {perfilMedico.hash_assinatura_eletronica || 'OC-SIG-8F4C2E'}</span>
          </div>
        </div>
      ) : perfilMedico.mostrar_linha_assinatura !== false ? (
        <div className="w-72 mx-auto border-t border-slate-400 pt-1.5">
          <p className="font-bold text-xs text-slate-900">{formatarNomeMedico(perfilMedico.nome_completo)}</p>
          <p className="text-[10px] text-slate-600">
            Médico Prescritor &bull; CRM/{perfilMedico.uf_crm} {perfilMedico.crm}
          </p>
        </div>
      ) : null}

      {/* QR Code de Autenticidade */}
      {perfilMedico.mostrar_qr_code !== false && (
        <div className="flex items-center justify-center gap-1 text-[8px] text-slate-500 font-mono pt-1">
          <QrCode className="w-3 h-3 text-slate-600" />
          <span>Autenticidade verificável em: openclinical.app/validar/{perfilMedico.hash_assinatura_eletronica || 'OC-SIG-8F4C2E'}</span>
        </div>
      )}

      {/* Rodapé Customizado do Médico */}
      {perfilMedico.texto_rodape_customizado && (
        <p className="text-[9px] text-slate-500 italic max-w-lg mx-auto">
          {perfilMedico.texto_rodape_customizado}
        </p>
      )}
    </div>
  );

  // Subcomponente de Marca d'água / Papel Timbrado
  const renderMarcaDagua = () => (
    <>
      {temPapelTimbradoProprio && (
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none opacity-90 z-0"
          style={{ backgroundImage: `url(${perfilMedico.papel_timbrado_base64})` }}
        />
      )}
      {temMarcaDaguaPadrao && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.035] select-none z-0">
          <img src={OPENCLINICAL_LOGO_BASE64} alt="" className="w-80 h-80 object-contain" />
          <span className="text-4xl font-black uppercase tracking-[0.3em] text-slate-900 mt-2">
            OpenClinical
          </span>
        </div>
      )}
    </>
  );

  return (
    <div className={`space-y-8 flex flex-col items-center ${className}`}>
      {/* =====================================================================
          1. RECEITAS DE CONTROLE ESPECIAL (PORTARIA SVS/MS 344/98 - 2 VIAS)
         ===================================================================== */}
      {paginasControlados.map((itensPagina, idxPagina) => {
        const totalPag = paginasControlados.length;
        const vias: { rotulo: string; subtitulo: string; isFarmacia: boolean }[] = [
          { rotulo: '1ª VIA — RETENÇÃO DA FARMÁCIA', subtitulo: 'Controle Sanitário SVS/MS', isFarmacia: true },
          { rotulo: '2ª VIA — ORIENTAÇÃO DO PACIENTE', subtitulo: 'Uso do Paciente', isFarmacia: false },
        ];

        return vias.map((via, idxVia) => (
          <div
            key={`ctrl_pag_${idxPagina}_via_${idxVia}`}
            id={`folha-controlado-p${idxPagina + 1}-v${idxVia + 1}`}
            className={`folha-receita-exportavel relative bg-white text-slate-900 shadow-xl border border-slate-300 rounded-lg flex flex-col justify-between ${dimensoesFolha}`}
          >
            {renderMarcaDagua()}

            <div>
              {renderCabecalho()}

              {/* Faixa Regulamentar Portaria 344/98 */}
              <div className="relative z-10 bg-amber-500/10 border border-amber-500/30 rounded p-1.5 mb-3 flex items-center justify-between text-amber-900 font-bold text-[10px]">
                <span>RECEITUÁRIO DE CONTROLE ESPECIAL (PORTARIA SVS/MS Nº 344/98)</span>
                <span className="font-mono uppercase">{via.rotulo}</span>
              </div>

              {renderPaciente(idxPagina + 1, totalPag)}

              {/* Lista de Substâncias Controladas (Máximo 3) */}
              <div className="relative z-10 space-y-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-0.5 inline-block">
                  Medicamentos sob Controle Especial:
                </span>
                {itensPagina.map((bloco, idxMed) => {
                  const num = idxPagina * 3 + idxMed + 1;
                  const med = bloco.medicamento_detalhe;
                  return (
                    <div key={bloco.id} className="border-b border-slate-100 pb-2.5 last:border-none">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{num}. {bloco.titulo}</span>
                        {med && (
                          <span className="font-medium text-slate-600 text-[10px]">
                            Quantidade: {med.quantidade_embalagens} cx/fr
                          </span>
                        )}
                      </div>
                      {med && <p className="text-[9px] text-slate-500 italic">{med.apresentacao}</p>}
                      <p className="mt-1 pl-3 text-slate-800 font-medium bg-slate-50/60 p-1.5 rounded text-[10px]">
                        {bloco.conteudo}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quadros Regulamentares de Farmácia (Apenas 1ª Via) */}
              {via.isFarmacia && (
                <div className="relative z-10 grid grid-cols-2 gap-2 border border-slate-300 rounded p-2 text-[8px] text-slate-700 mb-3 bg-slate-50/50">
                  <div className="border-r border-slate-300 pr-2 space-y-1">
                    <p className="font-bold text-slate-900 uppercase">IDENTIFICAÇÃO DO COMPRADOR</p>
                    <p>Nome: _________________________________________________</p>
                    <p>RG/Órgão: __________________ CPF: ____________________</p>
                    <p>Endereço: _____________________________________________</p>
                    <p>Cidade/UF: __________________ Tel: ___________________</p>
                  </div>
                  <div className="pl-1 space-y-1">
                    <p className="font-bold text-slate-900 uppercase">IDENTIFICAÇÃO DO FORNECEDOR</p>
                    <p>Data de Atendimento: ___/___/______</p>
                    <p>Lote / Registro Farmácia: ______________________________</p>
                    <p className="pt-2">Assinatura Farmacêutico: ________________________</p>
                  </div>
                </div>
              )}
            </div>

            {renderRodape()}
          </div>
        ));
      })}

      {/* =====================================================================
          2. RECEITUÁRIO DE ANTIMICROBIANOS (RDC ANVISA Nº 471/2021 - 2 VIAS)
         ===================================================================== */}
      {paginasAntimicrobianos.map((itensPagina, idxPagina) => {
        const totalPag = paginasAntimicrobianos.length;
        const vias: { rotulo: string; subtitulo: string; isFarmacia: boolean }[] = [
          { rotulo: '1ª VIA — RETENÇÃO DA FARMÁCIA', subtitulo: 'Validade: 10 dias', isFarmacia: true },
          { rotulo: '2ª VIA — ORIENTAÇÃO DO PACIENTE', subtitulo: 'Uso do Paciente', isFarmacia: false },
        ];

        return vias.map((via, idxVia) => (
          <div
            key={`atb_pag_${idxPagina}_via_${idxVia}`}
            id={`folha-antimicrobiano-p${idxPagina + 1}-v${idxVia + 1}`}
            className={`folha-receita-exportavel relative bg-white text-slate-900 shadow-xl border border-slate-300 rounded-lg flex flex-col justify-between ${dimensoesFolha}`}
          >
            {renderMarcaDagua()}

            <div>
              {renderCabecalho()}

              {/* Faixa Regulamentar RDC 471/2021 */}
              <div className="relative z-10 bg-teal-500/10 border border-teal-500/30 rounded p-1.5 mb-3 flex items-center justify-between text-teal-900 font-bold text-[10px]">
                <span>RECEITUÁRIO DE ANTIMICROBIANOS (RDC ANVISA Nº 471/2021 &bull; VALIDADE: 10 DIAS)</span>
                <span className="font-mono uppercase">{via.rotulo}</span>
              </div>

              {renderPaciente(idxPagina + 1, totalPag, true)}

              {/* Lista de Antimicrobianos */}
              <div className="relative z-10 space-y-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-0.5 inline-block">
                  Antimicrobianos Prescritos:
                </span>
                {itensPagina.map((bloco, idxMed) => {
                  const num = idxPagina * 3 + idxMed + 1;
                  const med = bloco.medicamento_detalhe;
                  return (
                    <div key={bloco.id} className="border-b border-slate-100 pb-2.5 last:border-none">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{num}. {bloco.titulo}</span>
                        {med && (
                          <span className="font-medium text-slate-600 text-[10px]">
                            Quantidade: {med.quantidade_embalagens} cx/fr
                          </span>
                        )}
                      </div>
                      {med && <p className="text-[9px] text-slate-500 italic">{med.apresentacao}</p>}
                      <p className="mt-1 pl-3 text-slate-800 font-medium bg-slate-50/60 p-1.5 rounded text-[10px]">
                        {bloco.conteudo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {renderRodape()}
          </div>
        ));
      })}

      {/* =====================================================================
          3. RECEITUÁRIO SIMPLES & ORIENTAÇÕES / EXAMES (VIA ÚNICA)
         ===================================================================== */}
      {paginasSimples.map((itensPagina, idxPagina) => {
        const totalPag = paginasSimples.length;

        return (
          <div
            key={`simples_pag_${idxPagina}`}
            id={`folha-simples-p${idxPagina + 1}`}
            className={`folha-receita-exportavel relative bg-white text-slate-900 shadow-xl border border-slate-300 rounded-lg flex flex-col justify-between ${dimensoesFolha}`}
          >
            {renderMarcaDagua()}

            <div>
              {renderCabecalho()}

              {/* Faixa de Cabeçalho Simples */}
              <div className="relative z-10 bg-slate-100 border border-slate-200 rounded p-1.5 mb-3 flex items-center justify-between text-slate-800 font-bold text-[10px]">
                <span>RECEITUÁRIO MÉDICO &bull; PRESCRIÇÃO CLÍNICA</span>
                <span className="font-normal text-slate-600">Validade: 30 dias</span>
              </div>

              {renderPaciente(idxPagina + 1, totalPag)}

              {/* Conteúdo da Folha (Apenas Medicamentos Simples) */}
              <div className="relative z-10 space-y-4 mb-4">
                {itensPagina.map((bloco, idxItem) => {
                  const num = idxPagina * 4 + idxItem + 1;
                  const med = bloco.medicamento_detalhe;

                  return (
                    <div key={bloco.id} className="border-b border-slate-100 pb-2.5 last:border-none">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>
                          {num}. {bloco.titulo}
                        </span>
                        {med && (
                          <span className="font-medium text-slate-600 text-[10px]">
                            Quantidade: {med.quantidade_embalagens} cx/fr
                          </span>
                        )}
                      </div>
                      {med && (
                        <p className="text-[9px] text-slate-500 italic">{med.apresentacao}</p>
                      )}
                      <p className="mt-1 pl-3 text-slate-800 font-medium bg-slate-50/60 p-1.5 rounded text-[10px] leading-relaxed whitespace-pre-wrap">
                        {bloco.conteudo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {renderRodape()}
          </div>
        );
      })}

      {/* =====================================================================
          4. SOLICITAÇÃO DE EXAMES COMPLEMENTARES (FOLHA DEDICADA)
         ===================================================================== */}
      {paginasExames.map((itensPagina, idxPagina) => {
        const totalPag = paginasExames.length;

        return (
          <div
            key={`exame_pag_${idxPagina}`}
            id={`folha-exame-p${idxPagina + 1}`}
            className={`folha-receita-exportavel relative bg-white text-slate-900 shadow-xl border border-slate-300 rounded-lg flex flex-col justify-between ${dimensoesFolha}`}
          >
            {renderMarcaDagua()}

            <div>
              {renderCabecalho()}

              {/* Faixa de Cabeçalho de Exames */}
              <div className="relative z-10 bg-indigo-50 border border-indigo-200 rounded p-1.5 mb-3 flex items-center justify-between text-indigo-950 font-bold text-[10px]">
                <span>SOLICITAÇÃO DE EXAMES COMPLEMENTARES &bull; PROPAGATÓRIA DIAGNÓSTICA</span>
                <span className="font-mono text-[9px] uppercase bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded border border-indigo-300">
                  Folha de Procedimentos
                </span>
              </div>

              {renderPaciente(idxPagina + 1, totalPag)}

              {/* Caixa de Indicação Clínica / Justificativa Diagnóstica */}
              <div className="relative z-10 p-2.5 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-[10px] space-y-1">
                <span className="font-bold text-slate-900 uppercase tracking-wide text-[9px]">
                  Indicação Clínica / Hipótese Diagnóstica:
                </span>
                <p className="text-slate-700 italic">
                  Avaliação clínica propedêutica, estratificação de risco metabólico/cardiovascular e monitoramento terapêutico.
                </p>
              </div>

              {/* Lista Estruturada de Exames com Checkboxes e Instruções */}
              <div className="relative z-10 space-y-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-0.5 inline-block">
                  Procedimentos e Exames Solicitados:
                </span>
                {itensPagina.map((bloco, idxItem) => {
                  const num = idxPagina * 6 + idxItem + 1;
                  return (
                    <div
                      key={bloco.id}
                      className="border border-slate-200 bg-slate-50/50 rounded-lg p-2.5 flex items-start space-x-3"
                    >
                      <div className="mt-0.5 w-4 h-4 border-2 border-indigo-600 rounded flex-shrink-0 flex items-center justify-center font-mono text-[9px] text-indigo-600 font-bold">
                        {num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-slate-900 text-[11px]">{bloco.titulo}</h4>
                          <span className="text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-100/70 text-indigo-800 border border-indigo-200">
                            Exame Complementar
                          </span>
                        </div>
                        {bloco.conteudo && (
                          <p className="mt-1 text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                            {bloco.conteudo}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {renderRodape()}
          </div>
        );
      })}

      {/* =====================================================================
          5. ORIENTAÇÕES E RECOMENDAÇÕES AO PACIENTE (FOLHA DEDICADA)
         ===================================================================== */}
      {paginasOrientacoes.map((itensPagina, idxPagina) => {
        const totalPag = paginasOrientacoes.length;

        return (
          <div
            key={`orientacao_pag_${idxPagina}`}
            id={`folha-orientacao-p${idxPagina + 1}`}
            className={`folha-receita-exportavel relative bg-white text-slate-900 shadow-xl border border-slate-300 rounded-lg flex flex-col justify-between ${dimensoesFolha}`}
          >
            {renderMarcaDagua()}

            <div>
              {renderCabecalho()}

              {/* Faixa de Cabeçalho de Orientações */}
              <div className="relative z-10 bg-emerald-50 border border-emerald-200 rounded p-1.5 mb-3 flex items-center justify-between text-emerald-950 font-bold text-[10px]">
                <span>ORIENTAÇÕES NÃO-FARMACOLÓGICAS &bull; CUIDADOS AO PACIENTE</span>
                <span className="font-mono text-[9px] uppercase bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300">
                  Uso do Paciente
                </span>
              </div>

              {renderPaciente(idxPagina + 1, totalPag)}

              {/* Lista de Orientações Clínicas */}
              <div className="relative z-10 space-y-4 mb-4">
                {itensPagina.map((bloco, idxItem) => {
                  const num = idxPagina * 4 + idxItem + 1;
                  return (
                    <div key={bloco.id} className="border-b border-slate-100 pb-3 last:border-none">
                      <div className="flex justify-between items-baseline font-bold text-slate-900 mb-1">
                        <span className="text-teal-950">{num}. {bloco.titulo}</span>
                        <span className="text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                          {bloco.tipo === 'dieta' ? 'Nutrição & Dieta' : 'Estilo de Vida'}
                        </span>
                      </div>
                      <p className="pl-3 text-slate-800 font-medium bg-emerald-50/40 p-2 rounded-lg text-[10px] leading-relaxed whitespace-pre-wrap border-l-2 border-emerald-500">
                        {bloco.conteudo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {renderRodape()}
          </div>
        );
      })}
    </div>
  );
};
