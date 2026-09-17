import React, { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus, checkOverdue, Request } from '../api/client';
import RequestDetail from './RequestDetail';
import { formatDistanceToNow } from 'date-fns';

export default function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [checking, setChecking] = useState(false);

  const loadRequests = async () => {
    try {
      const response = await getRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckOverdue = async () => {
    try {
      setChecking(true);
      await checkOverdue();
      await loadRequests();
    } catch (error) {
      console.error('Failed to check overdue', error);
    } finally {
      setChecking(false);
    }
  };

  const handleResolve = async (requestId: number) => {
    try {
      await updateRequestStatus(requestId, 'resolved');
      await loadRequests();
    } catch (error) {
      console.error('Failed to resolve request', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={handleCheckOverdue}
          disabled={checking}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check for Overdue (Demo)'}
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No requests yet</div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md" onClick={() => setSelectedRequest(request)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{request.patient?.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{request.description}</p>
                  <p className="text-gray-500 text-sm mt-2">→ {request.provider?.name} ({request.provider?.country})</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {request.status !== 'resolved' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResolve(request.id);
                  }}
                  className="mt-3 text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <RequestDetail request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </div>
  );
}
