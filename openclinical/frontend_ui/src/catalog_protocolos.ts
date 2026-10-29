import { ProtocoloClinico } from './types';
import {
  PROTOCOLOS_GERADOS,
  FARMACOS_POR_PROTOCOLO,
  CATEGORIAS_POR_PROTOCOLO,
} from './data/protocolos_gerados';

// Catálogo gerado a partir de clinical_content/protocolos/*.md por etl_pipeline/cadastrar_receitas.py
// (para cadastrar uma receita nova, veja clinical_content/protocolos/COMO_CADASTRAR.md)
export const CATALOGO_PROTOCOLOS: ProtocoloClinico[] = PROTOCOLOS_GERADOS;
export { FARMACOS_POR_PROTOCOLO, CATEGORIAS_POR_PROTOCOLO };
