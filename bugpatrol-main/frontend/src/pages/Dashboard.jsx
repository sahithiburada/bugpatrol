import React, { useState, useEffect } from 'react';
import { User, Bell, Moon, BarChart3, Plus, Clock, CheckCircle, TrendingUp, FileText, Filter, Download, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
const AuthorityDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const [openMenuBugId, setOpenMenuBugId] = useState(null);

const handleStatusChange = async (bugId, status) => {
  await updateBugStatus(bugId, status);
  setOpenMenuBugId(null); // Close dropdown after update
};


  const fetchDashboardData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/authority/dashboard', {
  withCredentials: true
});
     console.log(response.data);
     console.log("called http");
    const data = response.data; // ✅ axios stores response data in `response.data`
    setDashboardData(data);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


  const updateBugStatus = async (bugId, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/authority/bug/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bugId, status })
      });
      
      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to update bug status:', err);
    }
  };

  const getPriorityDisplay = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'performance':
    case 'security':
      return { label: 'Critical', className: 'text-danger' };

    case 'ui/ux':
    case 'performance':
      return { label: 'Medium', className: 'text-warning' };

    default:
      return { label: 'Basic', className: 'text-info' };
  }
};


  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-warning text-dark';
      case 'in progress':
        return 'bg-primary';
      case 'closed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <div className="bg-primary rounded p-2 me-2">
                <FileText className="text-white" size={20} />
              </div>
              <span className="fw-bold fs-5">BugPatrol</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center">
            <Bell className="text-muted me-3" size={20} />
            <Moon className="text-muted me-3" size={20} />
            <div className="d-flex align-items-center">
              <div className="bg-secondary rounded-circle me-2" style={{ width: '32px', height: '32px' }}>
                <User className="text-white m-1" size={20} />
              </div>
              <span className="fw-medium">{dashboardData?.authority?.name || 'Authority'}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">Total Reports</p>
                    <h3 className="mb-0">{dashboardData?.stats?.totalReports?.toLocaleString() || '0'}</h3>
                    <small className="text-success">
                      <TrendingUp size={12} className="me-1" />
                      8.5% from last month
                    </small>
                  </div>
                  <div className="bg-light rounded-circle p-2">
                    <BarChart3 className="text-primary" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">New Bugs</p>
                    <h3 className="mb-0">{dashboardData?.stats?.newBugs || '0'}</h3>
                    <small className="text-danger">
                      <TrendingUp size={12} className="me-1" />
                      8.5% from last month
                    </small>
                  </div>
                  <div className="bg-light rounded-circle p-2">
                    <Plus className="text-danger" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">In Progress</p>
                    <h3 className="mb-0">{dashboardData?.stats?.inProgress || '0'}</h3>
                    <small className="text-muted">Active Deployment</small>
                  </div>
                  <div className="bg-light rounded-circle p-2">
                    <Clock className="text-warning" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">Resolved</p>
                    <h3 className="mb-0">{dashboardData?.stats?.resolved?.toLocaleString() || '0'}</h3>
                    <small className="text-success">
                      {dashboardData?.stats?.successRate || '0'}% resolution rate
                    </small>
                  </div>
                  <div className="bg-light rounded-circle p-2">
                    <CheckCircle className="text-success" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Bug Trends Chart */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Bug Trends</h6>
                <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                  <option>October</option>
                </select>
              </div>
              <div className="card-body">
                {/* Static Chart Placeholder */}
                <div className="d-flex align-items-end justify-content-between" style={{ height: '200px' }}>
                  {[60, 80, 100, 70, 90, 85, 95, 75, 85, 80, 70, 85].map((height, index) => (
                    <div key={index} className="d-flex flex-column align-items-center">
                      <div 
                        className="bg-primary rounded-top" 
                        style={{ 
                          width: '20px', 
                          height: `${height}px`,
                          marginBottom: '5px'
                        }}
                      ></div>
                      <small className="text-muted">{index * 5}k</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* My Panel */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h6 className="mb-0 fw-bold">My Panel</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="text-muted small">Assigned to me</div>
                    <div className="h4 mb-0">{dashboardData?.myPanel?.assignedToMe || '12'}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="text-muted small">Avg Resolution Time</div>
                    <div className="h4 mb-0">{dashboardData?.myPanel?.avgResolutionTime || '2.5 days'}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Resolved this month</div>
                    <div className="h4 mb-0">{dashboardData?.myPanel?.resolvedThisMonth || '45'}</div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted small">Success Rate</div>
                    <div className="h4 mb-0">{dashboardData?.myPanel?.successRate || '94%'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bug Report Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Bug Report</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm">
                <Filter size={16} className="me-1" />
                Filter
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <Download size={16} className="me-1" />
                Export
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 fw-medium">Description</th>
                    <th className="border-0 fw-medium">Status</th>
                    <th className="border-0 fw-medium">Priority</th>
                    <th className="border-0 fw-medium">Reported Date</th>
                    <th className="border-0 fw-medium">Reporter Email</th>
                    <th className="border-0 fw-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.latestBugs?.map((bug, index) => {
                    const { label, className } = getPriorityDisplay(bug.priority);
                  return(
                    
                    <tr key={bug.id}>
                      <td className="border-0">
                        <div>
                          <div className="fw-medium">{bug.title}</div>
                          <small className="text-muted">{bug.description?.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td className="border-0">
                        <span className={`badge ${getStatusBadge(bug.status)}`}>
                          {bug.status}
                        </span>
                      </td>
                      <td className="border-0">
                        <span className={className}>{label}</span>
                      </td>
                      <td className="border-0">
                        {formatDate(bug.reportedDate)}
                      </td>
                      <td className="border-0">
                        <small>{bug.email}</small>
                      </td>
                      <td className="border-0 position-relative">
        <div className="d-flex gap-1">
          {/* EDIT: toggle dropdown */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() =>
              setOpenMenuBugId(openMenuBugId === bug.id ? null : bug.id)
            }
          >
            <Edit size={14} />
          </button>

          {/* Dropdown (if this row is active) */}
          {openMenuBugId === bug.id && (
            <div
              className="position-absolute bg-white border rounded shadow p-2"
              style={{
                top: '100%',
                left: 0,
                zIndex: 1000,
                minWidth: '150px'
              }}
            >
              {["active", "in progress", "closed"].map((status) => (
                <button
                  key={status}
                  className="dropdown-item"
                  onClick={() => {
  handleStatusChange(bug.id, status);
  updateBugStatus(bug.id, status);
}}

                >
                  Mark as {status}
                </button>
              ))}
            </div>
          )}

          {/* DELETE */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => updateBugStatus(bug.id, 'closed')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
                    </tr>
                  );
})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;