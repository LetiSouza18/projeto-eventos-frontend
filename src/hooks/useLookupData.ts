import { useState, useEffect } from 'react';
import { Tema, Tipo, Instituicao, PublicoAlvo, Responsavel } from '../types/Event';
import { lookupService } from '../services/lookupService';

export const useLookupData = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [publicosAlvo, setPublicosAlvo] = useState<PublicoAlvo[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando dados de lookup...');

      const [
        temasData,
        tiposData,
        instituicoesData,
        publicosAlvoData,
        responsaveisData
      ] = await Promise.all([
        lookupService.listarTemas(),
        lookupService.listarTipos(),
        lookupService.listarInstituicoes(),
        lookupService.listarPublicosAlvo(),
        lookupService.listarResponsaveis()
      ]);

      setTemas(temasData);
      setTipos(tiposData);
      setInstituicoes(instituicoesData);
      setPublicosAlvo(publicosAlvoData);
      setResponsaveis(responsaveisData);

      console.log('✅ Dados de lookup carregados:', {
        temas: temasData.length,
        tipos: tiposData.length,
        instituicoes: instituicoesData.length,
        publicosAlvo: publicosAlvoData.length,
        responsaveis: responsaveisData.length
      });
    } catch (err) {
      console.error('❌ Erro ao carregar dados de lookup:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados de referência';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return {
    temas,
    tipos,
    instituicoes,
    publicosAlvo,
    responsaveis,
    loading,
    error,
    recarregarDados: carregarDados
  };
};