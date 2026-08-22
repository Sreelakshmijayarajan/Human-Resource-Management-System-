const API_BASE_URL = 'http://localhost:5000/api';

export interface HealthCheckResponse {
  status: 'online' | 'offline';
  message: string;
  database?: string;
}

export const apiService = {
  // Check if MySQL backend is online
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return {
        status: 'offline',
        message: 'Running in standalone frontend mode (MySQL server offline).',
      };
    }
  },

  // Auth login query
  async login(email: string, role: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, using local state for login.', err);
    }
    return null;
  },

  // Fetch employees
  async getEmployees() {
    try {
      const res = await fetch(`${API_BASE_URL}/employees`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, falling back to mock employees.', err);
    }
    return null;
  },

  // Fetch departments
  async getDepartments() {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/departments`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, falling back to mock departments.', err);
    }
    return null;
  },

  // Create department
  async createDepartment(data: { name: string; description: string; headName: string; headEmail: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, using local state for new department.', err);
    }
    return null;
  },

  // Delete department
  async deleteDepartment(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/departments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, using local state for department delete.', err);
    }
    return null;
  },

  // Notifications
  async getNotifications() {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend offline, falling back to mock notifications.', err);
    }
    return null;
  },
};
