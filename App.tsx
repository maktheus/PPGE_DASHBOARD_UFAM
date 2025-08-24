import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import AdminPanel from './components/AdminPanel';
import { MOCK_GRADUATES } from './constants';
import { Graduate, Docente, Projeto } from './types';

type View = 'dashboard' | 'dataManagement' | 'admin';

const viewTitles: Record<View, string> = {
  dashboard: 'Dashboard PPGEE - Elétrica e Computação',
  dataManagement: 'Gerenciamento de Dados',
  admin: 'Painel Administrativo'
};

const APP_GRADUATES_STORAGE_KEY = 'ppgee-graduates-data';
const APP_DOCENTES_STORAGE_KEY = 'ppgee-docentes-data';
const APP_PROJETOS_STORAGE_KEY = 'ppgee-projetos-data';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [graduates, setGraduates] = useState<Graduate[]>(() => {
    try {
      const savedData = localStorage.getItem(APP_GRADUATES_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : MOCK_GRADUATES;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return MOCK_GRADUATES;
    }
  });
   const [docentes, setDocentes] = useState<Docente[]>(() => {
    try {
      const savedData = localStorage.getItem(APP_DOCENTES_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("Error loading docentes data from localStorage:", error);
      return [];
    }
  });
  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    try {
      const savedData = localStorage.getItem(APP_PROJETOS_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("Error loading projetos data from localStorage:", error);
      return [];
    }
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(APP_GRADUATES_STORAGE_KEY, JSON.stringify(graduates));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [graduates]);

  useEffect(() => {
    try {
      localStorage.setItem(APP_DOCENTES_STORAGE_KEY, JSON.stringify(docentes));
    } catch (error) {
      console.error("Error saving docentes data to localStorage:", error);
    }
  }, [docentes]);

  useEffect(() => {
    try {
      localStorage.setItem(APP_PROJETOS_STORAGE_KEY, JSON.stringify(projetos));
    } catch (error) {
      console.error("Error saving projetos data to localStorage:", error);
    }
  }, [projetos]);


  const handleAddGraduate = useCallback((graduate: Graduate) => {
    setGraduates(prev => [...prev, graduate]);
  }, []);

  const handleUpdateGraduate = useCallback((updatedGraduate: Graduate) => {
    setGraduates(prev => prev.map(g => g.id === updatedGraduate.id ? updatedGraduate : g));
  }, []);

  const handleDeleteGraduate = useCallback((id: string) => {
    setGraduates(prev => prev.filter(g => g.id !== id));
  }, []);
  
  const handleImportGraduates = useCallback((newGraduates: Graduate[]) => {
    setGraduates(prev => {
        const updatedGraduates = [...prev, ...newGraduates];
        try {
            localStorage.setItem(APP_GRADUATES_STORAGE_KEY, JSON.stringify(updatedGraduates));
        } catch (error) {
            console.error("Error saving imported data to localStorage:", error);
        }
        return updatedGraduates;
    });
    setActiveView('dashboard');
  }, []);

  const handleAddDocente = useCallback((docente: Docente) => {
    setDocentes(prev => [...prev, docente]);
  }, []);

  const handleImportDocentes = useCallback((newDocentes: Docente[]) => {
    setDocentes(prev => {
        const updatedDocentes = [...prev, ...newDocentes];
        try {
            localStorage.setItem(APP_DOCENTES_STORAGE_KEY, JSON.stringify(updatedDocentes));
        } catch (error) {
            console.error("Error saving imported docentes data to localStorage:", error);
        }
        return updatedDocentes;
    });
  }, []);

  const handleAddProjeto = useCallback((projeto: Projeto) => {
    setProjetos(prev => [...prev, projeto]);
  }, []);

  const handleImportProjetos = useCallback((newProjetos: Projeto[]) => {
    setProjetos(prev => {
        const updatedProjetos = [...prev, ...newProjetos];
        try {
            localStorage.setItem(APP_PROJETOS_STORAGE_KEY, JSON.stringify(updatedProjetos));
        } catch (error) {
            console.error("Error saving imported projetos data to localStorage:", error);
        }
        return updatedProjetos;
    });
  }, []);
  
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleClearAllData = useCallback(() => {
    setGraduates([]);
    setDocentes([]);
    setProjetos([]);
    alert('Todos os dados foram removidos com sucesso.');
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard graduates={graduates} onUpdate={handleUpdateGraduate} onDelete={handleDeleteGraduate} />;
      case 'dataManagement':
        return <DataManagement 
                  onAddGraduate={handleAddGraduate} 
                  onImportGraduates={handleImportGraduates}
                  onAddDocente={handleAddDocente}
                  onImportDocentes={handleImportDocentes}
                  onAddProjeto={handleAddProjeto}
                  onImportProjetos={handleImportProjetos} 
                  graduates={graduates}
                  docentes={docentes}
                  projetos={projetos}
                  onClearAllData={handleClearAllData}
                />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard graduates={graduates} onUpdate={handleUpdateGraduate} onDelete={handleDeleteGraduate}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
