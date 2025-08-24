
export enum Course {
  MESTRADO = 'Mestrado',
  DOUTORADO = 'Doutorado',
}

export enum Status {
  DEFENDIDO = 'Defendido',
  CURSANDO = 'Cursando',
}

export interface Graduate {
  id: string;
  nome: string;
  anoIngresso: number;
  anoDefesa?: number;
  orientador: string;
  tituloDefesa: string;
  curso: Course;
  status: Status;
  cursandoDoutorado: boolean;
  trabalhando?: string; // Company name or place
  trabalhandoOutroEstado: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Viewer';
}

export interface Docente {
  id: string;
  nome: string; // Coluna "Docente"
  categoria: string; // Coluna "Categoria"
  ano: number; // Coluna "Ano"
}

export interface Projeto {
  id: string;
  titulo: string;
  natureza: string;
  coordenador: string;
  financiador: string;
  colaboracaoNaoAcademica: string;
  resumo: string;
  valorFinanciado: number;
  atuacao: 'Coordenador' | 'Membro';
  alunosMestradoEnvolvidos: number;
  alunosDoutoradoEnvolvidos: number;
  anoInicio: number;
  anoFim?: number;
}
