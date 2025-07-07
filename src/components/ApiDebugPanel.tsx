import React, { useState } from 'react';
import { testApiConnection } from '../services/api';
import { eventoService } from '../services/eventoService';
import { lookupService } from '../services/lookupService';
import { Settings, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const ApiDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<string[]>([]);

  const runConnectionTest = async () => {
    setConnectionStatus('testing');
    setTestResults([]);
    
    const results: string[] = [];
    
    try {
      // Teste 1: Conexão básica
      results.push('🔍 Testando conexão básica...');
      const basicConnection = await testApiConnection();
      
      if (basicConnection) {
        results.push('✅ Conexão básica: OK');
        
        // Teste 2: Buscar eventos
        results.push('🔍 Testando busca de eventos...');
        const eventos = await eventoService.listarEventos();
        results.push(`✅ Eventos carregados: ${eventos.length} encontrados`);
        
        // Teste 3: Buscar dados de lookup
        results.push('🔍 Testando dados de lookup...');
        
        try {
          const temas = await lookupService.listarTemas();
          results.push(`✅ Temas carregados: ${temas.length} encontrados`);
        } catch (err) {
          results.push(`❌ Erro ao carregar temas: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
        
        try {
          const tipos = await lookupService.listarTipos();
          results.push(`✅ Tipos carregados: ${tipos.length} encontrados`);
        } catch (err) {
          results.push(`❌ Erro ao carregar tipos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
        
        try {
          const instituicoes = await lookupService.listarInstituicoes();
          results.push(`✅ Instituições carregadas: ${instituicoes.length} encontradas`);
        } catch (err) {
          results.push(`❌ Erro ao carregar instituições: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
        
        try {
          const publicosAlvo = await lookupService.listarPublicosAlvo();
          results.push(`✅ Públicos-alvo carregados: ${publicosAlvo.length} encontrados`);
        } catch (err) {
          results.push(`❌ Erro ao carregar públicos-alvo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
        
        try {
          const responsaveis = await lookupService.listarResponsaveis();
          results.push(`✅ Responsáveis carregados: ${responsaveis.length} encontrados`);
        } catch (err) {
          results.push(`❌ Erro ao carregar responsáveis: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
        
        setConnectionStatus('success');
      } else {
        results.push('❌ Conexão básica: FALHOU');
        setConnectionStatus('error');
      }
    } catch (error) {
      results.push(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setConnectionStatus('error');
    }
    
    setTestResults(results);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Debug API"
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Debug API</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm">
          <strong>URLs da API:</strong>
          <br />
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block mb-1">
            http://localhost:3000/api/eventos
          </code>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block mb-1">
            http://localhost:3000/api/temas
          </code>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block mb-1">
            http://localhost:3000/api/tipos
          </code>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block">
            http://localhost:3000/api/instituicoes
          </code>
        </div>
        
        <button
          onClick={runConnectionTest}
          disabled={connectionStatus === 'testing'}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {connectionStatus === 'testing' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>
            {connectionStatus === 'testing' ? 'Testando...' : 'Testar Todas as APIs'}
          </span>
        </button>
        
        {testResults.length > 0 && (
          <div className="bg-gray-50 p-3 rounded text-xs space-y-1 max-h-40 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-3 rounded">
            <div className="flex items-center text-red-800 text-sm">
              <XCircle className="h-4 w-4 mr-2" />
              <span>Verifique se o backend está rodando</span>
            </div>
          </div>
        )}
        
        {connectionStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <div className="flex items-center text-green-800 text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Todas as APIs funcionando!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};