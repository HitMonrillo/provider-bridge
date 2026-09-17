import React, { useEffect, useState } from 'react';
import { getOutreachAttempts, Request, OutreachAttempt } from '../api/client';
import { formatDistanceToNow } from 'date-fns';

interface RequestDetailProps {
  request: Request;
  onClose: () => void;
}

export default function RequestDetail({ request, onClose }: RequestDetailProps) {
  const [attempts, setAttempts] = useState<OutreachAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        setLoading(true);
        const response = await getOutreachAttempts(request.id);
        setAttempts(response.data);
      } catch (error) {
        console.error('Failed to load outreach attempts', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
    const interval = setInterval(loadAttempts, 3000);
    return () => clearInterval(interval);
  }, [request.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Request Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-600">Patient</label>
              <p className="text-lg">{request.patient?.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Provider</label>
              <p className="text-lg">{request.provider?.name} ({request.provider?.organization})</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Description</label>
              <p className="text-gray-700">{request.description}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <p className="text-lg font-semibold text-purple-600">{request.status}</p>
            </div>
          </div>

          {/* Bilingual Summaries */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Bilingual Summaries</h3>
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-blue-600 mb-2">English</p>
                <p className="text-sm whitespace-pre-line">{request.bilingSummaryEn}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-green-600 mb-2">Português</p>
                <p className="text-sm whitespace-pre-line">{request.bilingSummaryPt}</p>
              </div>
            </div>
          </div>

          {/* Outreach Attempts */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Outreach History</h3>
            {loading ? (
              <p className="text-gray-500">Loading attempts...</p>
            ) : attempts.length === 0 ? (
              <p className="text-gray-500">No outreach attempts</p>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{attempt.channel.toUpperCase()}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(attempt.sentAt), { addSuffix: true })}
                      </span>
                    </div>
                    {attempt.message && (
                      <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{attempt.message}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <span className={attempt.responseReceived ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                        {attempt.responseReceived ? '✓ Response received' : '✗ No response'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
