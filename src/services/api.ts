const API_BASE_URL = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Configuração base para fetch
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error Response:`, errorText);
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`❌ Response não é JSON:`, text);
      throw new Error('Resposta do servidor não é um JSON válido');
    }
    
    const data = await response.json();
    console.log(`✅ API Response Data:`, data);
    return data;
  } catch (error) {
    console.error('❌ API request failed:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Check if the current page is accessed via HTTPS
      const isHttps = window.location.protocol === 'https:';
      const httpsMessage = isHttps 
        ? ' IMPORTANTE: Você está acessando via HTTPS. Acesse http://localhost:5173 (HTTP) em vez de https://localhost:5173.' 
        : '';
      
      throw new Error(`Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3000.${httpsMessage}`);
    }
    
    throw error;
  }
};

export const api = {
  // Métodos auxiliares
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Função para testar a conexão com a API
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testando conexão com a API...');
    await fetch(`${API_BASE_URL}/eventos`, { 
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    console.log('✅ Conexão com API estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão com API:', error);
    
    // Check if the current page is accessed via HTTPS
    const isHttps = window.location.protocol === 'https:';
    if (isHttps) {
      console.error('⚠️  PROTOCOLO INCORRETO: Você está acessando via HTTPS. Use http://localhost:5173 em vez de https://localhost:5173');
    }
    
    return false;
  }
};