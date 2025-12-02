import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaz que representa un bloque en la blockchain
export interface Block {
  id: number;
  timestamp: string;
  data: string;
  previousHash: string;
  currentHash: string;
}

// Interfaz para el resultado de verificación de la blockchain
export interface VerificationResult {
  valid: boolean;
  totalBlocks: number;
  errors: string[];
}

export const blockchainApi = {
  // Obtiene todos los bloques de la blockchain
  getAllBlocks: async (): Promise<Block[]> => {
    const response = await api.get<Block[]>('/blocks');
    return response.data;
  },

  // Obtiene un bloque específico por su ID
  getBlockById: async (id: number): Promise<Block> => {
    const response = await api.get<Block>(`/blocks/${id}`);
    return response.data;
  },

  // Agrega un nuevo bloque (transacción) a la blockchain
  addBlock: async (data: string): Promise<Block> => {
    const response = await api.post<Block>('/blocks', { data });
    return response.data;
  },

  // Modifica un bloque sin recalcular el hash (solo para admin/demo)
  modifyBlock: async (id: number, data: string): Promise<Block> => {
    const response = await api.put<Block>(`/blocks/${id}`, { data });
    return response.data;
  },

  // Verifica la integridad completa de la blockchain
  verifyChain: async (): Promise<VerificationResult> => {
    const response = await api.get<VerificationResult>('/blocks/verify');
    return response.data;
  },
};

export default api;

