import React, { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Graduate, Course, Status } from '../types';
import DataTable from './DataTable';

interface DashboardProps {
  graduates: Graduate[];
  onUpdate: (graduate: Graduate) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ graduates, onUpdate, onDelete }) => {
  const uniqueOrientadores = useMemo(() => {
    const orientadores = new Set(graduates.map(g => g.orientador));
    return Array.from(orientadores).sort();
  }, [graduates]);

  const [filters, setFilters] = useState(() => {
    const defenseYears = graduates
      .map(g => g.anoDefesa)
      .filter((year): year is number => typeof year === 'number');
    
    const minYear = defenseYears.length > 0 ? Math.min(...defenseYears) : '';

    return {
      startYear: minYear.toString(),
      endYear: '',
      course: 'all',
      status: 'all',
      orientador: 'all',
    };
  });

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const filteredGraduates = useMemo(() => {
    return graduates.filter(g => {
      const startYear = parseInt(filters.startYear, 10);
      const endYear = parseInt(filters.endYear, 10);

      const defenseYear = g.anoDefesa;
      if (startYear && defenseYear && defenseYear < startYear) return false;
      if (endYear && defenseYear && defenseYear > endYear) return false;
      if (filters.course !== 'all' && g.curso !== filters.course) return false;
      if (filters.status !== 'all' && g.status !== filters.status) return false;
      if (filters.orientador !== 'all' && g.orientador !== filters.orientador) return false;
      
      return true;
    });
  }, [graduates, filters]);

  const mestresFormados = useMemo(() => {
    return filteredGraduates.filter(g => g.curso === Course.MESTRADO && g.status === Status.DEFENDIDO).length;
  }, [filteredGraduates]);

  const doutoresFormados = useMemo(() => {
    return filteredGraduates.filter(g => g.curso === Course.DOUTORADO && g.status === Status.DEFENDIDO).length;
  }, [filteredGraduates]);

  const tempoMedioMestrado = useMemo(() => {
    const mestresDefendidos = filteredGraduates.filter(
      g => g.curso === Course.MESTRADO && g.status === Status.DEFENDIDO && g.anoDefesa && g.anoIngresso
    );
    if (mestresDefendidos.length === 0) return 0;

    const totalMeses = mestresDefendidos.reduce((acc, g) => {
        if (g.anoDefesa) {
            return acc + ((g.anoDefesa - g.anoIngresso) * 12);
        }
        return acc;
    }, 0);

    return totalMeses / mestresDefendidos.length;
  }, [filteredGraduates]);

  const tempoMedioDoutorado = useMemo(() => {
    const doutoresDefendidos = filteredGraduates.filter(
      g => g.curso === Course.DOUTORADO && g.status === Status.DEFENDIDO && g.anoDefesa && g.anoIngresso
    );
    if (doutoresDefendidos.length === 0) return 0;

    const totalMeses = doutoresDefendidos.reduce((acc, g) => {
        if (g.anoDefesa) {
            return acc + ((g.anoDefesa - g.anoIngresso) * 12);
        }
        return acc;
    }, 0);
    
    return totalMeses / doutoresDefendidos.length;
  }, [filteredGraduates]);


  const graduatesByYear = useMemo(() => {
    const counts: { [year: string]: { [key in Course]?: number } } = {};
    
    filteredGraduates.forEach(g => {
      // "Egressos" são os que defenderam
      if (g.anoDefesa && g.status === Status.DEFENDIDO) {
        const year = g.anoDefesa.toString();
        if (!counts[year]) {
          counts[year] = {};
        }
        counts[year][g.curso] = (counts[year][g.curso] || 0) + 1;
      }
    });

    return Object.keys(counts)
      .map(year => ({
        year,
        [Course.MESTRADO]: counts[year][Course.MESTRADO] || 0,
        [Course.DOUTORADO]: counts[year][Course.DOUTORADO] || 0,
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [filteredGraduates]);
  
  const courseDistribution = useMemo(() => {
      const counts = { [Course.MESTRADO]: 0, [Course.DOUTORADO]: 0 };
      filteredGraduates.forEach(g => {
          counts[g.curso]++;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredGraduates]);

  const statusDistribution = useMemo(() => {
      const counts = { [Status.DEFENDIDO]: 0, [Status.CURSANDO]: 0 };
      filteredGraduates.forEach(g => {
          counts[g.status]++;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredGraduates]);

  return (
    <div className="p-6 space-y-6">
      {/* Filter Panel */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano Início (Defesa)</label>
            <input type="number" name="startYear" id="startYear" value={filters.startYear} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ex: 2018" />
          </div>
          <div>
            <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano Fim (Defesa)</label>
            <input type="number" name="endYear" id="endYear" value={filters.endYear} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ex: 2022" />
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
            <select name="course" id="course" value={filters.course} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="all">Todos</option>
              <option value={Course.MESTRADO}>Mestrado</option>
              <option value={Course.DOUTORADO}>Doutorado</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="all">Todos</option>
              <option value={Status.DEFENDIDO}>Defendido</option>
              <option value={Status.CURSANDO}>Cursando</option>
            </select>
          </div>
          <div>
            <label htmlFor="orientador" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Orientador</label>
            <select name="orientador" id="orientador" value={filters.orientador} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
              <option value="all">Todos</option>
              {uniqueOrientadores.map(orientador => (
                  <option key={orientador} value={orientador}>{orientador}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow text-center transition-transform transform hover:scale-105">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">Mestres Formados</h4>
            <p className="mt-2 text-4xl font-bold text-blue-600 dark:text-blue-400">{mestresFormados}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow text-center transition-transform transform hover:scale-105">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">Doutores Formados</h4>
            <p className="mt-2 text-4xl font-bold text-green-500 dark:text-green-400">{doutoresFormados}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow text-center transition-transform transform hover:scale-105">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">Mestrado Tempo Médio</h4>
            <p className="mt-2 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {tempoMedioMestrado > 0 ? `${tempoMedioMestrado.toFixed(1)} meses` : '-'}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow text-center transition-transform transform hover:scale-105">
            <h4 className="text-base font-medium text-gray-500 dark:text-gray-400">Doutorado Tempo Médio</h4>
            <p className="mt-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
                {tempoMedioDoutorado > 0 ? `${tempoMedioDoutorado.toFixed(1)} meses` : '-'}
            </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Egressos por Ano de Defesa</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graduatesByYear} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                    <XAxis dataKey="year" />
                    <YAxis allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', border: 'none' }}/>
                    <Legend />
                    <Bar dataKey={Course.MESTRADO} fill="#3b82f6" name="Mestrado" />
                    <Bar dataKey={Course.DOUTORADO} fill="#10b981" name="Doutorado" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Distribuição por Curso</h3>
            <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={courseDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {courseDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', border: 'none' }}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,41,59,0.9)', border: 'none' }}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <DataTable data={filteredGraduates} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;