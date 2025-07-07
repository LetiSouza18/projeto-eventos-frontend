export interface Tema {
  id: number;
  nome: string;
}

export interface Tipo {
  id: number;
  nome: string;
}

export interface Instituicao {
  id: number;
  nome: string;
}

export interface PublicoAlvo {
  id: number;
  descricao: string;
}

export interface Responsavel {
  id: number;
  nome: string;
}

export interface Atividade {
  id: number;
  nome: string;
  data?: Date | string;
  descricao?: string;
  horario_inicio?: string;
  horario_fim?: string;
  detalhe_local?: string;
  // Campos de relacionamento
  idEvento?: number;
  idTipo?: number;
  idInstituicao?: number;
  idPublicoAlvo?: number;
  idResponsavel?: number;
  // Objetos relacionados (para exibição)
  tipo?: Tipo;
  instituicao?: Instituicao;
  publicoAlvo?: PublicoAlvo;
  responsavel?: Responsavel;
  temas?: Tema[];
}

export interface AtividadeUnica {
  id: number;
  horario_inicio?: string;
  horario_fim?: string;
  detalhe_local?: string;
  // Campos de relacionamento
  idEvento?: number;
  idInstituicao?: number;
  idPublicoAlvo?: number;
  idResponsavel?: number;
  // Objetos relacionados (para exibição)
  instituicao?: Instituicao;
  publicoAlvo?: PublicoAlvo;
  responsavel?: Responsavel;
  temas?: Tema[];
}

export interface Evento {
  id: number;
  titulo: string;
  data_inicio?: Date | string;
  data_fim?: Date | string;
  descricao?: string;
  valor?: string;
  modalidade?: string;
  link_inscricao?: string;
  imagem_url?: string;
  data_limite_inscricoes?: Date | string;
  atividades?: Atividade[];
  atividadesUnicas?: AtividadeUnica[];
}