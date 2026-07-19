const API_BASE_URL = 'http://localhost:5037/api';

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[ForgeTwin API] ${endpoint}:`, error);
    return null;
  }
}

// Dashboard
export const fetchDashboardStats = () => apiRequest('Dashboard');

// Machines
export const fetchMachines = async () => {
  const data = await apiRequest('Machines');
  return data || [];
};

export const fetchMachine = (id) => apiRequest(`Machines/${id}`);

export const createMachine = (machine) =>
  apiRequest('Machines', {
    method: 'POST',
    body: JSON.stringify(machine),
  });

export const updateMachine = (id, machine) =>
  apiRequest(`Machines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(machine),
  });

export const deleteMachine = (id) =>
  apiRequest(`Machines/${id}`, {
    method: 'DELETE',
  });
