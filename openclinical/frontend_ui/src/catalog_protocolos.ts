import { ProtocoloClinico } from './types';
import {
  PROTOCOLOS_GERADOS,
  FARMACOS_POR_PROTOCOLO as FARMACOS_DOMESTICOS,
  CATEGORIAS_POR_PROTOCOLO as CATEGORIAS_DOMESTICAS,
} from './data/protocolos_gerados';
import {
  PROTOCOLOS_INTERNACIONAIS_GERADOS,
  FARMACOS_POR_PROTOCOLO_INTERNACIONAL,
  CATEGORIAS_POR_PROTOCOLO_INTERNACIONAL,
} from './data/protocolos_internacionais_gerados';

// Anota os protocolos nacionais/SUS com jurisdição oficial brasileira
const PROTOCOLOS_SUS_ENRIQUECIDOS: ProtocoloClinico[] = PROTOCOLOS_GERADOS.map((p) => ({
  ...p,
  jurisdicao: 'BR_SUS',
  pais: 'Brasil',
  agencia: 'Ministério da Saúde / CONITEC',
  tem_equivalente_sus: true,
  disponibilidade_farmacos_rename_sus: 'total',
}));

// Catálogo Completo Integrado: SUS (Soberano/Default) + Diretrizes Internacionais (NICE, CDC, OMS, etc.)
export const CATALOGO_PROTOCOLOS: ProtocoloClinico[] = [
  ...PROTOCOLOS_SUS_ENRIQUECIDOS,
  ...PROTOCOLOS_INTERNACIONAIS_GERADOS,
];

export const FARMACOS_POR_PROTOCOLO: Record<string, string[]> = {
  ...FARMACOS_DOMESTICOS,
  ...FARMACOS_POR_PROTOCOLO_INTERNACIONAL,
};

export const CATEGORIAS_POR_PROTOCOLO: Record<string, string> = {
  ...CATEGORIAS_DOMESTICAS,
  ...CATEGORIAS_POR_PROTOCOLO_INTERNACIONAL,
};
