import { ProtocoloClinico } from './types';
import {
  PROTOCOLOS_GERADOS,
  FARMACOS_POR_PROTOCOLO,
  CATEGORIAS_POR_PROTOCOLO,
} from './data/protocolos_gerados';

// Catálogo derivado da mesma fonte dos arquivos Markdown (etl_pipeline/gerador_receitas_completas.py)
export const CATALOGO_PROTOCOLOS: ProtocoloClinico[] = PROTOCOLOS_GERADOS;
export { FARMACOS_POR_PROTOCOLO, CATEGORIAS_POR_PROTOCOLO };
