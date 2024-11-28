import React, { useState } from 'react';
import { BarChart, FileText, UserCheck, BadgeCheck, Key, Users, UserPlus } from 'lucide-react';
import UserReports from './UserReports';
import AccessReports from './AccessReports';
import AuditLogs from './AuditLogs';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reportTypes = [
    {
      id: 'users',
      title: 'User Reports',
      description: 'User activity and registration statistics',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'access',
      title: 'Access Reports',
      description: 'Access control and permission analytics',
      icon: Key,
      color: 'emerald'
    },
    {
      id: 'audit',
      title: 'Audit Logs',
      description: 'System-wide audit trail and activity logs',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'background',
      title: 'Background Check Reports',
      description: 'Background verification statistics',
      icon: UserCheck,
      color: 'orange'
    },
    {
      id: 'badge',
      title: 'Badge Reports',
      description: 'Badge issuance and status analytics',
      icon: BadgeCheck,
      color: 'indigo'
    },
    {
      id: 'visitors',
      title: 'Visitor Reports',
      description: 'Visitor management statistics',
      icon: UserPlus,
      color: 'red'
    }
  ];

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'users':
        return <UserReports />;
      case 'access':
        return <AccessReports />;
      case 'audit':
        return <AuditLogs />;
      default:
        return (
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report Type</h3>
            <p className="text-gray-500">Choose a report type from the options above</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {!selectedReport ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const IconComponent = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 bg-${report.color}-50 rounded-lg`}>
                    <IconComponent className={`h-6 w-6 text-${report.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {reportTypes.find(r => r.id === selectedReport)?.title}
            </h2>
            <button
              onClick={() => setSelectedReport(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Back to Reports
            </button>
          </div>
          {renderReportContent()}
        </div>
      )}
    </div>
  );
};

export default Reports;
