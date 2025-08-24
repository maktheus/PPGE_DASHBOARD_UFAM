import React, { useState, useCallback, useRef } from 'react';
import { Graduate, Course, Status, Docente, Projeto } from '../types';
import DataForm from './DataForm';
import DocenteForm from './DocenteForm';
import ProjetoForm from './ProjetoForm';

declare const XLSX: any;

interface DataManagementProps {
  onAddGraduate: (graduate: Graduate) => void;
  onImportGraduates: (graduates: Graduate[]) => void;
  onAddDocente: (docente: Docente) => void;
  onImportDocentes: (docentes: Docente[]) => void;
  onAddProjeto: (projeto: Projeto) => void;
  onImportProjetos: (projetos: Projeto[]) => void;
  graduates: Graduate[];
  docentes: Docente[];
  projetos: Projeto[];
  onClearAllData: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ 
  onAddGraduate, 
  onImportGraduates, 
  onAddDocente, 
  onImportDocentes,
  onAddProjeto,
  onImportProjetos,
  graduates,
  docentes,
  projetos,
  onClearAllData
}) => {
  const [isAddingGraduate, setIsAddingGraduate] = useState(false);
  const [graduateError, setGraduateError] = useState<string | null>(null);
  const graduateFileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingDocente, setIsAddingDocente] = useState(false);
  const [docenteError, setDocenteError] = useState<string | null>(null);
  const docenteFileInputRef = useRef<HTMLInputElement>(null);

  const [isAddingProjeto, setIsAddingProjeto] = useState(false);
  const [projetoError, setProjetoError] = useState<string | null>(null);
  const projetoFileInputRef = useRef<HTMLInputElement>(null);

  const handleGraduateFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setGraduateError(null);
    const reader = new FileReader();

    const parseYear = (value: any): number | undefined => {
        if (!value) return undefined;
        if (value instanceof Date) return value.getFullYear();
        if (typeof value === 'string') {
            const parts = value.split('/');
            if (parts.length === 3) {
                const year = parseInt(parts[2], 10);
                if (!isNaN(year) && year > 1900 && year < 2100) return year;
            }
            const year = parseInt(value, 10);
            if(!isNaN(year) && String(year).length === 4) return year;
        }
        if (typeof value === 'number' && value > 1900 && value < 2100) return value;
        return undefined;
    };

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const newGraduates: Graduate[] = json.reduce((acc: Graduate[], row: any) => {
            const anoIngresso = parseYear(row['ANO DE INGRESSO']);
            if (!anoIngresso) return acc;
            const anoDefesa = parseYear(row['ANO DE DEFESA']);
            acc.push({
              id: `imported-${new Date().toISOString()}-${Math.random()}`,
              nome: row['NOME DO ALUNO'] || 'N/A',
              anoIngresso,
              anoDefesa,
              orientador: row['ORIENTADOR'] || 'N/A',
              tituloDefesa: row['TÍTULO DE DEFESA'] || '',
              curso: row['CURSO'] === 'Doutorado' ? Course.DOUTORADO : Course.MESTRADO,
              status: row['Status'] === 'Defendido' ? Status.DEFENDIDO : Status.CURSANDO,
              cursandoDoutorado: String(row['Está cursando doutorado como aluno regular?'])?.toLowerCase() === 'sim',
              trabalhando: row['Encontra-se trabalhando? Se sim, onde?'] || undefined,
              trabalhandoOutroEstado: String(row['Está trabalhando em outro estado da federação?'])?.toLowerCase() === 'sim',
            });
            return acc;
        }, []);
        onImportGraduates(newGraduates);
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setGraduateError("Erro ao processar o arquivo Excel. Verifique o formato e as colunas.");
      } finally {
        if(graduateFileInputRef.current) graduateFileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onImportGraduates]);

  const handleDocenteFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocenteError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const newDocentes: Docente[] = json.reduce((acc: Docente[], row: any) => {
          const ano = parseInt(row['ANO'], 10);
          const nome = row['DOCENTE'];
          if (nome && !isNaN(ano)) {
            acc.push({
              id: `imported-${new Date().toISOString()}-${Math.random()}`,
              nome: nome,
              categoria: row['CATEGORIA'] || 'N/A',
              ano: ano,
            });
          }
          return acc;
        }, []);

        onImportDocentes(newDocentes);
        alert(`${newDocentes.length} registros de docentes importados com sucesso!`);
      } catch (err) {
        console.error("Error parsing Docente Excel file:", err);
        setDocenteError("Erro ao processar o arquivo Excel de docentes. Verifique o formato e as colunas ('DOCENTE', 'CATEGORIA', 'ANO').");
      } finally {
        if(docenteFileInputRef.current) docenteFileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onImportDocentes]);

  const handleProjetoFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProjetoError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const newProjetos: Projeto[] = json.reduce((acc: Projeto[], row: any) => {
          const anoInicio = parseInt(row['Ano de Início'], 10);
          if (row['Título do Projeto'] && !isNaN(anoInicio)) {
            const anoFim = parseInt(row['Ano de Fim'], 10);
            acc.push({
              id: `imported-${new Date().toISOString()}-${Math.random()}`,
              titulo: row['Título do Projeto'],
              natureza: row['Natureza'] || '',
              coordenador: row['Coordenador'] || 'N/A',
              financiador: row['Financiador'] || '',
              colaboracaoNaoAcademica: row['Projetos estabelecidos com instituições que NÃO sejam acadêmicas e NÃO sejam de agências de fomento, que resultem em produtos tecnológicos ou impacto na formação de recurso humanos'] || '',
              resumo: row['Resumo'] || '',
              valorFinanciado: Number(row['Valor financiado']) || 0,
              atuacao: (String(row['Atuação (ou Coordenador ou Membro)'])?.toLowerCase() === 'membro' ? 'Membro' : 'Coordenador'),
              alunosMestradoEnvolvidos: parseInt(row['Quantidade de alunos de Mestrado do PPGEE envolvidos'], 10) || 0,
              alunosDoutoradoEnvolvidos: parseInt(row['Quantidade de alunos de Doutorado do PPGEE envolvidos'], 10) || 0,
              anoInicio: anoInicio,
              anoFim: !isNaN(anoFim) ? anoFim : undefined,
            });
          }
          return acc;
        }, []);

        onImportProjetos(newProjetos);
        alert(`${newProjetos.length} registros de projetos importados com sucesso!`);
      } catch (err) {
        console.error("Error parsing Projeto Excel file:", err);
        setProjetoError("Erro ao processar o arquivo Excel de projetos. Verifique o formato e as colunas.");
      } finally {
        if(projetoFileInputRef.current) projetoFileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onImportProjetos]);

  const handleAddGraduate = (graduate: Graduate) => {
    onAddGraduate(graduate);
    setIsAddingGraduate(false);
  };
  
  const handleAddDocente = (docente: Docente) => {
    onAddDocente(docente);
    setIsAddingDocente(false);
  };

  const handleAddProjeto = (projeto: Projeto) => {
    onAddProjeto(projeto);
    setIsAddingProjeto(false);
  };

  const handleBackup = useCallback(() => {
    const backupData = {
      graduates,
      docentes,
      projetos,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    a.download = `ppgee-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [graduates, docentes, projetos]);

  const handleClearData = useCallback(() => {
    const confirmationMessage = "ATENÇÃO!\n\nEsta ação é irreversível e irá apagar TODOS os dados de egressos e docentes da aplicação.\n\nTem certeza que deseja continuar?";
    if (window.confirm(confirmationMessage)) {
      onClearAllData();
    }
  }, [onClearAllData]);
  
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Gerenciamento de Dados - Egressos</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Adicione novos egressos ou importe dados de uma planilha. Atenção: Excel v00x-EGRESSO-MESTRADO.xlsx ou v00x-EGRESSO-DOUTORADO.xlsx</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => setIsAddingGraduate(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Adicionar Egresso
            </button>
            <label className="cursor-pointer px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
              <span>Importar Excel</span>
              <input ref={graduateFileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={handleGraduateFileImport} />
            </label>
          </div>
        </div>
        {graduateError && <p className="mt-4 text-sm text-red-600">{graduateError}</p>}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Gerenciamento de Dados - Docentes</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Adicione novos docentes ou importe dados de uma planilha. Atenção: Excel v0014-DOCENTE.xlsx</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => setIsAddingDocente(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Adicionar Docente
            </button>
            <label className="cursor-pointer px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
              <span>Importar Excel</span>
              <input ref={docenteFileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={handleDocenteFileImport} />
            </label>
          </div>
        </div>
        {docenteError && <p className="mt-4 text-sm text-red-600">{docenteError}</p>}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Gerenciamento de Dados - Projetos</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Adicione novos projetos ou importe dados de uma planilha. Atenção: Excel v00x-PROJETOS.xlsx</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => setIsAddingProjeto(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Adicionar Projeto
            </button>
            <label className="cursor-pointer px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
              <span>Importar Excel</span>
              <input ref={projetoFileInputRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={handleProjetoFileImport} />
            </label>
          </div>
        </div>
        {projetoError && <p className="mt-4 text-sm text-red-600">{projetoError}</p>}
      </div>

       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Backup e Limpeza de Dados</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Exporte todos os dados para um arquivo de backup ou remova todos os registros permanentemente.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              onClick={handleBackup} 
              className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
            >
              Fazer Backup dos Dados
            </button>
            <button 
              onClick={handleClearData} 
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Limpar Todos os Dados
            </button>
          </div>
        </div>
        <p className="mt-4 text-xs text-yellow-600 dark:text-yellow-400">
          <strong>Atenção:</strong> A limpeza de dados é uma ação irreversível. Recomenda-se fazer um backup antes de prosseguir.
        </p>
      </div>
      
       {isAddingGraduate && (
        <DataForm
            onSave={handleAddGraduate}
            onClose={() => setIsAddingGraduate(false)}
        />
      )}
      {isAddingDocente && (
        <DocenteForm
            onSave={handleAddDocente}
            onClose={() => setIsAddingDocente(false)}
        />
      )}
      {isAddingProjeto && (
        <ProjetoForm
            onSave={handleAddProjeto}
            onClose={() => setIsAddingProjeto(false)}
        />
      )}
    </div>
  );
};

export default DataManagement;