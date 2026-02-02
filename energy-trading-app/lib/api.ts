const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export async function fetchEnergyTrucks() {
    try {
        const response = await fetch(`${API_URL}/api/energy-trucks`);
        if (!response.ok) {
            throw new Error('Failed to fetch energy trucks');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}
