import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { livreurAxios } from '../../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { FaMoneyBillWave, FaClock, FaChartLine, FaHistory } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EarningsDashboard = () => {
    const { user } = useAuth();
    const [earnings, setEarnings] = useState([]);
    const [summary, setSummary] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState({
        earnings: true,
        summary: true,
        reports: true
    });
    const [filters, setFilters] = useState({
        status: '',
        startDate: null,
        endDate: null,
        reportType: 'month',
        searchQuery: ''
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchEarnings();
        fetchSummary();
        fetchReports();
    }, [filters, page, activeTab]);

    const fetchEarnings = async () => {
        try {
            setLoading(prev => ({...prev, earnings: true}));
            const params = {
                page,
                status: activeTab === 'all' ? '' : activeTab,
                start_date: filters.startDate?.toISOString().split('T')[0],
                end_date: filters.endDate?.toISOString().split('T')[0],
                search: filters.searchQuery
            };
            
            const response = await livreurAxios.get('/earnings', { params });
            setEarnings(response.data.data);
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(prev => ({...prev, earnings: false}));
        }
    };

    const fetchSummary = async () => {
        try {
            setLoading(prev => ({...prev, summary: true}));
            const response = await livreurAxios.get('/earnings/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(prev => ({...prev, summary: false}));
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(prev => ({...prev, reports: true}));
            const response = await livreurAxios.get('/earnings/reports', {
                params: { group_by: filters.reportType }
            });
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(prev => ({...prev, reports: false}));
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1);
    };

    const handleRefresh = () => {
        fetchEarnings();
        fetchSummary();
        fetchReports();
    };

    const handleExport = async () => {
        try {
            const response = await axios.post('/api/distributor/earnings/export', filters, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `earnings_report_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount || 0);
    };

    const formatReportData = () => {
        return reports.map(item => ({
            name: filters.reportType === 'month' 
                ? `${item.year}-${item.month.toString().padStart(2, '0')}`
                : filters.reportType === 'week'
                ? `Week ${item.week}, ${item.year}`
                : item.year.toString(),
            earnings: item.total_earnings,
            deliveries: item.delivery_count
        }));
    };

    const getStatusDistribution = () => {
        if (!summary) return [];
        return [
            { name: 'Paid', value: summary.paid_count },
            { name: 'Pending', value: summary.pending_count }
        ];
    };

    const renderLoadingSkeleton = () => (
        <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Earnings Dashboard</h1>
                <button 
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-md border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                    <FiRefreshCw className={`${loading.earnings || loading.summary || loading.reports ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>
            
            {/* Summary Cards with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm font-medium opacity-80">Total Earnings</div>
                            <div className="text-2xl font-bold mt-2">
                                {loading.summary ? '--' : formatCurrency(summary?.total_earnings)}
                            </div>
                        </div>
                        <FaMoneyBillWave className="text-2xl opacity-70" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg shadow-md p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm font-medium opacity-80">Pending Payments</div>
                            <div className="text-2xl font-bold mt-2">
                                {loading.summary ? '--' : formatCurrency(summary?.pending_earnings)}
                            </div>
                        </div>
                        <FaClock className="text-2xl opacity-70" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-md p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm font-medium opacity-80">This Month</div>
                            <div className="text-2xl font-bold mt-2">
                                {loading.summary ? '--' : formatCurrency(summary?.current_month_earnings)}
                            </div>
                            <div className={`text-xs mt-1 font-medium ${
                                summary?.change_percentage >= 0 ? 'text-green-100' : 'text-red-100'
                            }`}>
                                {loading.summary ? '--' : `${summary?.change_percentage?.toFixed(1) || 0}%`} from last month
                            </div>
                        </div>
                        <FaChartLine className="text-2xl opacity-70" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg shadow-md p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm font-medium opacity-80">Total Deliveries</div>
                            <div className="text-2xl font-bold mt-2">
                                {loading.summary ? '--' : summary?.total_deliveries || 0}
                            </div>
                        </div>
                        <FaHistory className="text-2xl opacity-70" />
                    </div>
                </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Earnings Trend Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Earnings Trend</h2>
                        <div className="flex items-center space-x-2">
                            <select
                                value={filters.reportType}
                                onChange={(e) => handleFilterChange('reportType', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                                <option value="year">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-80">
                        {loading.reports ? renderLoadingSkeleton() : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formatReportData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fill: '#666' }} />
                                    <YAxis tick={{ fill: '#666' }} />
                                    <Tooltip 
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{
                                            background: '#fff',
                                            borderRadius: '6px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            border: 'none'
                                        }}
                                    />
                                    <Legend />
                                    <Bar 
                                        dataKey="earnings" 
                                        name="Earnings" 
                                        fill="#8884d8" 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
                
                {/* Status Distribution Pie Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Status</h2>
                    <div className="h-80">
                        {loading.summary ? renderLoadingSkeleton() : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={getStatusDistribution()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {getStatusDistribution().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `${value} deliveries`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Earnings Table with Enhanced Filters */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Delivery Earnings</h2>
                        
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <FiFilter className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            
                            <button 
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <FiDownload /> Export CSV
                            </button>
                        </div>
                    </div>
                    
                    {/* Date Range Picker */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <div className="flex items-center space-x-2">
                                <DatePicker
                                    selected={filters.startDate}
                                    onChange={(date) => handleFilterChange('startDate', date)}
                                    selectsStart
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    placeholderText="Start Date"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="text-gray-500">to</span>
                                <DatePicker
                                    selected={filters.endDate}
                                    onChange={(date) => handleFilterChange('endDate', date)}
                                    selectsEnd
                                    startDate={filters.startDate}
                                    endDate={filters.endDate}
                                    minDate={filters.startDate}
                                    placeholderText="End Date"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                                {['all', 'paid', 'pending'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1 text-sm rounded-md flex-1 ${
                                            activeTab === tab 
                                                ? 'bg-white shadow-sm text-purple-600 font-medium' 
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading.earnings ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4">
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : earnings.length > 0 ? (
                                earnings.map((earning) => (
                                    <tr key={earning.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(earning.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(earning.created_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                #{earning.order.order_number}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {earning.order.customer_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(earning.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {earning.commission_rate}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(earning.commission_amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                earning.status === 'paid' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {earning.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-purple-600 hover:text-purple-900 mr-3">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No earnings records found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Enhanced Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex-1 flex justify-between items-center sm:hidden">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page}
                        </span>
                        <button 
                            onClick={() => setPage(p => p + 1)}
                            disabled={earnings.length < rowsPerPage}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(page * rowsPerPage, earnings.length + (page - 1) * rowsPerPage)}</span> of{' '}
                                <span className="font-medium">{summary?.total_earnings_count || 0}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">First</span>
                                    «
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {[...Array(3)].map((_, i) => {
                                    const pageNum = page + i - 1;
                                    if (pageNum > 0 && pageNum <= Math.ceil((summary?.total_earnings_count || 0) / rowsPerPage)) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === pageNum
                                                        ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={earnings.length < rowsPerPage}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setPage(Math.ceil((summary?.total_earnings_count || 0) / rowsPerPage))}
                                    disabled={page === Math.ceil((summary?.total_earnings_count || 0) / rowsPerPage)}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Last</span>
                                    »
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsDashboard;