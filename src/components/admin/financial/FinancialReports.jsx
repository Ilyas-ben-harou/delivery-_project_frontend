import React, { useState } from 'react';
import { adminAxios } from '../../../api/axios';
import { Card, Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const FinancialReports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const response = await adminAxios.post('/financial/reports', {
        start_date: startDate,
        end_date: endDate,
        report_type: reportType
      });
      
      if (response.data.status === 'success') {
        setReportData(response.data.data);
        setSuccessMessage('Report generated successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.report_data || reportData.report_data.length === 0) {
      setError('No report data available to export');
      return;
    }
    
    // Create CSV content
    const headers = ['Period', 'Total Revenue', 'Order Count', 'Delivered Count', 'Failed Count'];
    const rows = reportData.report_data.map(item => [
      item.period,
      item.total_revenue,
      item.order_count,
      item.delivered_count,
      item.failed_count
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-report-${reportData.report_type}-${reportData.start_date}-${reportData.end_date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPeriodLabel = (period) => {
    if (reportType === 'daily') {
      return format(new Date(period), 'MMM dd');
    } else if (reportType === 'weekly') {
      const [year, week] = period.split('-');
      return `Week ${week}, ${year}`;
    } else if (reportType === 'monthly') {
      const [year, month] = period.split('-');
      return format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMM yyyy');
    }
    return period;
  };

  const chartData = reportData?.report_data?.map(item => ({
    ...item,
    formattedPeriod: formatPeriodLabel(item.period)
  })) || [];

  return (
    <Container fluid className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h2 className="mb-4">Financial Reports</h2>
          
          {/* Success/Error Messages */}
          {successMessage && (
            <Alert variant="success" className="mb-4">{successMessage}</Alert>
          )}
          {error && (
            <Alert variant="danger" className="mb-4">{error}</Alert>
          )}
          
          {/* Report Form */}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex">
              <Button type="submit" disabled={loading} className="me-2">
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              {reportData && (
                <Button variant="outline-secondary" onClick={handleExportCSV}>
                  Export as CSV
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Report Results */}
      {reportData && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Report Summary</h4>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <strong>Report Type:</strong> {reportData.report_type.charAt(0).toUpperCase() + reportData.report_type.slice(1)}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <strong>Period:</strong> {reportData.start_date} to {reportData.end_date}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <strong>Total Periods:</strong> {reportData.report_data.length}
                  </div>
                </Col>
              </Row>
              
              {/* Chart */}
              {chartData.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-3">Revenue Visualization</h5>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formattedPeriod" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value?.toFixed(2) || '0.00'}`} />
                      <Legend />
                      <Bar dataKey="total_revenue" name="Revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <h4 className="mb-3">Detailed Report Data</h4>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Total Revenue</th>
                      <th>Order Count</th>
                      <th>Delivered</th>
                      <th>Failed</th>
                      <th>Success Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.report_data.length > 0 ? (
                      reportData.report_data.map((item, index) => {
                        const successRate = item.order_count > 0 
                          ? ((item.delivered_count / item.order_count) * 100).toFixed(1)
                          : 0;
                          
                        return (
                          <tr key={index}>
                            <td>{formatPeriodLabel(item.period)}</td>
                            <td>${parseFloat(item.total_revenue).toFixed(2)}</td>
                            <td>{item.order_count}</td>
                            <td>{item.delivered_count}</td>
                            <td>{item.failed_count}</td>
                            <td>{successRate}%</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No report data available</td>
                      </tr>
                    )}
                  </tbody>
                  {reportData.report_data.length > 0 && (
                    <tfoot>
                      <tr className="table-active fw-bold">
                        <td>Total</td>
                        <td>
                          ${reportData.report_data.reduce((sum, item) => sum + parseFloat(item.total_revenue), 0).toFixed(2)}
                        </td>
                        <td>
                          {reportData.report_data.reduce((sum, item) => sum + parseInt(item.order_count), 0)}
                        </td>
                        <td>
                          {reportData.report_data.reduce((sum, item) => sum + parseInt(item.delivered_count), 0)}
                        </td>
                        <td>
                          {reportData.report_data.reduce((sum, item) => sum + parseInt(item.failed_count), 0)}
                        </td>
                        <td>
                          {(() => {
                            const totalOrders = reportData.report_data.reduce((sum, item) => sum + parseInt(item.order_count), 0);
                            const totalDelivered = reportData.report_data.reduce((sum, item) => sum + parseInt(item.delivered_count), 0);
                            return totalOrders > 0 ? ((totalDelivered / totalOrders) * 100).toFixed(1) + '%' : '0%';
                          })()}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default FinancialReports;