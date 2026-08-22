import { Discipline } from '@/types/campus';

export const ALL_TADS_DISCIPLINES: Discipline[] = [
  // 1º PERÍODO
  { id: 'tec-0772', name: 'Empreendedorismo', code: 'TEC.0772', color: '#FB923C', absences: 0, workload: 30, period: 1 },
  { id: 'tec-0002', name: 'Língua Inglesa', code: 'TEC.0002', color: '#60A5FA', absences: 0, workload: 60, period: 1 },
  { id: 'tec-0006', name: 'Matemática Discreta', code: 'TEC.0006', color: '#FBBF24', absences: 0, workload: 60, period: 1 },
  { id: 'tec-1005', name: 'Programação de Computadores', code: 'TEC.1005', color: '#34D399', absences: 0, workload: 90, period: 1 },
  { id: 'tec-0031', name: 'Seminário de Integração Acadêmica', code: 'TEC.0031', color: '#F472B6', absences: 0, workload: 4, period: 1 },
  { id: 'tec-0013', name: 'Web Design', code: 'TEC.0013', color: '#A78BFA', absences: 0, workload: 60, period: 1 },

  // 2º PERÍODO
  { id: 'tec-1007', name: 'Algoritmos', code: 'TEC.1007', color: '#38BDF8', absences: 0, workload: 60, period: 2 },
  { id: 'tec-0004', name: 'Epistemologia da Ciência', code: 'TEC.0004', color: '#FACC15', absences: 0, workload: 30, period: 2 },
  { id: 'tec-1006', name: 'Inglês para Informática', code: 'TEC.1006', color: '#818CF8', absences: 0, workload: 60, period: 2 },
  { id: 'tec-0001', name: 'Língua Portuguesa', code: 'TEC.0001', color: '#E879F9', absences: 0, workload: 60, period: 2 },
  { id: 'tec-1008', name: 'Programação Orientada a Objetos', code: 'TEC.1008', color: '#4ADE80', absences: 0, workload: 90, period: 2 },

  // 3º PERÍODO
  { id: 'tec-0017', name: 'Arquitetura de Computadores', code: 'TEC.0017', color: '#2DD4BF', absences: 0, workload: 60, period: 3 },
  { id: 'tec-0012', name: 'Computador e Sociedade', code: 'TEC.0012', color: '#FB923C', absences: 0, workload: 30, period: 3 },
  { id: 'tec-0018', name: 'Interface Humano-Computador', code: 'TEC.0018', color: '#F472B6', absences: 0, workload: 60, period: 3 },
  { id: 'tec-0005', name: 'Metodologia do Trabalho Científico', code: 'TEC.0005', color: '#FBBF24', absences: 0, workload: 30, period: 3 },
  { id: 'tec-0016', name: 'Redes de Computadores', code: 'TEC.0016', color: '#60A5FA', absences: 0, workload: 60, period: 3 },
  { id: 'tec-0035', name: 'Seminário de Iniciação à Pesquisa e à Extensão', code: 'TEC.0035', color: '#C084FC', absences: 0, workload: 30, period: 3 },
  { id: 'tec-0710', name: 'Sistemas Digitais', code: 'TEC.0710', color: '#34D399', absences: 0, workload: 60, period: 3 },

  // 4º PERÍODO
  { id: 'tec-0021', name: 'Análise e Projeto Orientado a Objetos', code: 'TEC.0021', color: '#A78BFA', absences: 0, workload: 60, period: 4 },
  { id: 'tec-1009', name: 'Bancos de Dados', code: 'TEC.1009', color: '#38BDF8', absences: 0, workload: 60, period: 4 },
  { id: 'tec-0037', name: 'Desenvolvimento de Projetos I', code: 'TEC.0037', color: '#FB923C', absences: 0, workload: 125, period: 4 },
  { id: 'tec-0019', name: 'Desenvolvimento de Sistemas Web', code: 'TEC.0019', color: '#4ADE80', absences: 0, workload: 90, period: 4 },
  { id: 'tec-0020', name: 'Estrutura de Dados Lineares', code: 'TEC.0020', color: '#FBBF24', absences: 0, workload: 60, period: 4 },
  { id: 'tec-0032', name: 'Seminário de Orientação ao Projeto de Desenvolvimento de Sistema Web', code: 'TEC.0032', color: '#E879F9', absences: 0, workload: 30, period: 4 },

  // 5º PERÍODO
  { id: 'tec-0025', name: 'Arquitetura de Software', code: 'TEC.0025', color: '#60A5FA', absences: 0, workload: 60, period: 5 },
  { id: 'tec-0038', name: 'Desenvolvimento de Projetos II', code: 'TEC.0038', color: '#FB923C', absences: 0, workload: 125, period: 5 },
  { id: 'tec-0023', name: 'Desenvolvimento de Sistemas Distribuídos', code: 'TEC.0023', color: '#A78BFA', absences: 0, workload: 90, period: 5 },
  { id: 'tec-0024', name: 'Processo de Software', code: 'TEC.0024', color: '#34D399', absences: 0, workload: 60, period: 5 },
  { id: 'tec-0026', name: 'Programação e Administração de Banco de Dados', code: 'TEC.0026', color: '#38BDF8', absences: 0, workload: 60, period: 5 },
  { id: 'tec-0033', name: 'Seminário de Orientação ao Projeto de Desenvolvimento de Sistema Distribuído', code: 'TEC.0033', color: '#F472B6', absences: 0, workload: 30, period: 5 },

  // 6º PERÍODO
  { id: 'd1', name: 'Estrutura de Dados Não-Lineares', code: 'TEC.0027', teacher: 'Leandro Luttiane', color: '#FBBF24', absences: 0, workload: 60, period: 6 },
  { id: 'd2', name: 'Teste de Software', code: 'TEC.0030', teacher: 'Mauricio Rabello', color: '#34D399', absences: 1, workload: 60, period: 6 },
  { id: 'd3', name: 'Desenvolvimento de Sistemas Corporativos', code: 'TEC.0028', teacher: 'Eliezio Soares', color: '#60A5FA', absences: 0, workload: 80, period: 6 },
  { id: 'd4', name: 'Seminário de Orientação ao Projeto', code: 'TEC.0034', teacher: 'Eliezio Soares', color: '#F472B6', absences: 0, workload: 40, period: 6 },
  { id: 'd5', name: 'Sistemas Operacionais', code: 'TEC.1010', teacher: 'Ronaldo Junior', color: '#A78BFA', absences: 2, workload: 60, period: 6 },
  { id: 'd6', name: 'Gerência de Projetos', code: 'TEC.0029', teacher: 'Mauricio Rabello', color: '#FB923C', absences: 0, workload: 60, period: 6 },
  { id: 'tec-0039', name: 'Desenvolvimento de Projetos III', code: 'TEC.0039', color: '#FB923C', absences: 0, workload: 125, period: 6 },

  // 7º PERÍODO
  { id: 'tec-1011', name: 'Gestão de Tecnologia da Informação', code: 'TEC.1011', color: '#60A5FA', absences: 0, workload: 60, period: 7 },
  { id: 'tec-0036', name: 'Seminário de Orientação para Trabalho de Conclusão de Curso', code: 'TEC.0036', color: '#FBBF24', absences: 0, workload: 30, period: 7 },

  // OPTATIVAS
  { id: 'tec-0075', name: 'Aplicações com Interfaces Ricas', code: 'TEC.0075', color: '#A78BFA', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0071', name: 'Cálculo Diferencial e Integral', code: 'TEC.0071', color: '#38BDF8', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0077', name: 'Desenvolvimento de Jogos', code: 'TEC.0077', color: '#4ADE80', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0076', name: 'Desenvolvimento para Dispositivos Móveis', code: 'TEC.0076', color: '#F472B6', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0073', name: 'Engenharia de Requisitos', code: 'TEC.0073', color: '#34D399', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0324', name: 'Informática', code: 'TEC.0324', color: '#60A5FA', absences: 0, workload: 30, period: 0 },
  { id: 'tec-0371', name: 'LIBRAS', code: 'TEC.0371', color: '#E879F9', absences: 0, workload: 30, period: 0 },
  { id: 'tec-0042', name: 'Métodos Quantitativos', code: 'TEC.0042', color: '#FBBF24', absences: 0, workload: 60, period: 0 },
  { id: 'tec-1004', name: 'Organização de Computadores', code: 'TEC.1004', color: '#2DD4BF', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0080', name: 'Paradigmas de Linguagens de Programação', code: 'TEC.0080', color: '#A78BFA', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0069', name: 'Psicologia nas Relações do Trabalho', code: 'TEC.0069', color: '#FB923C', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0074', name: 'Qualidade de Software', code: 'TEC.0074', color: '#34D399', absences: 0, workload: 60, period: 0 },
  { id: 'tec-0372', name: 'Qualidade de Vida e Trabalho', code: 'TEC.0372', color: '#F472B6', absences: 0, workload: 30, period: 0 },
  { id: 'tec-0078', name: 'Segurança e Integridade de Dados', code: 'TEC.0078', color: '#38BDF8', absences: 0, workload: 60, period: 0 },
];
