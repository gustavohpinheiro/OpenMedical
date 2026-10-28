import React, { createContext, useContext } from 'react';

/** Abre a bula do medicamento pelo nome (fornecido pela App; ver `abrirMedicamentoPorNome`). */
export const AbrirMedicamentoContext = createContext<((nome: string) => void) | null>(null);

interface LinkMedicamentoProps {
  nome: string;
  /** Texto exibido, quando diferente do nome usado para localizar a bula */
  children?: React.ReactNode;
  className?: string;
}

/** Nome de medicamento clicável: abre a bula estruturada, a monografia do FTN ou o produto da CMED. */
export const LinkMedicamento: React.FC<LinkMedicamentoProps> = ({ nome, children, className = '' }) => {
  const abrir = useContext(AbrirMedicamentoContext);
  if (!abrir) return <span className={className}>{children ?? nome}</span>;
  return (
    <button
      type="button"
      onClick={(evento) => {
        // Dentro de cartões clicáveis (protocolo, item de lista) o clique abre só a bula
        evento.stopPropagation();
        abrir(nome);
      }}
      title={`Abrir a bula de ${nome}`}
      className={`underline decoration-dotted decoration-1 underline-offset-2 hover:text-white hover:decoration-solid cursor-pointer text-left ${className}`}
    >
      {children ?? nome}
    </button>
  );
};
