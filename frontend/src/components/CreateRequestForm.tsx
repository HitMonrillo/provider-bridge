import React, { useEffect, useState } from 'react';
import { getPatients, getProviders, createRequest, createPatient, createProvider, Patient, Provider } from '../api/client';

interface CreateRequestFormProps {
  onRequestCreated: () => void;
}

export default function CreateRequestForm({ onRequestCreated }: CreateRequestFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showNewProvider, setShowNewProvider] = useState(false);
  const [loading, setLoading] = useState(false);

  const [patientId, setPatientId] = useState('');
  const [providerId, setProviderId] = useState('');
  const [description, setDescription] = useState('');

  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientDob, setNewPatientDob] = useState('');
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderOrg, setNewProviderOrg] = useState('');
  const [newProviderCountry, setNewProviderCountry] = useState('');
  const [newProviderEmail, setNewProviderEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, providersRes] = await Promise.all([
        getPatients(),
        getProviders()
      ]);
      setPatients(patientsRes.data);
      setProviders(providersRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !providerId || !description.trim()) return;

    try {
      setLoading(true);
      await createRequest({
        patientId: parseInt(patientId),
        providerId: parseInt(providerId),
        description
      });

      // Reset form
      setPatientId('');
      setProviderId('');
      setDescription('');

      // Reload data and notify parent
      await loadData();
      onRequestCreated();
    } catch (error) {
      console.error('Failed to create request', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientDob) return;

    try {
      const res = await createPatient({
        name: newPatientName,
        dateOfBirth: newPatientDob,
        preferredLanguage: 'en'
      });
      setPatients([...patients, res.data]);
      setPatientId(res.data.id.toString());
      setNewPatientName('');
      setNewPatientDob('');
      setShowNewPatient(false);
    } catch (error) {
      console.error('Failed to create patient', error);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderName.trim() || !newProviderEmail.trim()) return;

    try {
      const res = await createProvider({
        name: newProviderName,
        organization: newProviderOrg,
        country: newProviderCountry,
        email: newProviderEmail,
        timezone: 'UTC'
      });
      setProviders([...providers, res.data]);
      setProviderId(res.data.id.toString());
      setNewProviderName('');
      setNewProviderOrg('');
      setNewProviderCountry('');
      setNewProviderEmail('');
      setShowNewProvider(false);
    } catch (error) {
      console.error('Failed to create provider', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Create New Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient</label>
            <div className="flex gap-2">
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewPatient(!showNewPatient)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                + New
              </button>
            </div>

            {showNewPatient && (
              <form onSubmit={handleAddPatient} className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  required
                />
                <input
                  type="date"
                  value={newPatientDob}
                  onChange={(e) => setNewPatientDob(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Patient
                </button>
              </form>
            )}
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
            <div className="flex gap-2">
              <select
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.country})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewProvider(!showNewProvider)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                + New
              </button>
            </div>

            {showNewProvider && (
              <form onSubmit={handleAddProvider} className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={newProviderOrg}
                  onChange={(e) => setNewProviderOrg(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newProviderCountry}
                  onChange={(e) => setNewProviderCountry(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newProviderEmail}
                  onChange={(e) => setNewProviderEmail(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Provider
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What's Needed</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Surgical history for PT clearance"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !patientId || !providerId || !description.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Creating...' : 'Create Request'}
        </button>
      </form>
    </div>
  );
}
