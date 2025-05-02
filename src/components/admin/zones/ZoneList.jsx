// resources/js/components/zones/ZoneList.jsx
import React, { useState } from 'react';
import { Table, Card, Input, Select, Button, Tag, Space } from 'antd';
import { SearchOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons';

const ZoneList = ({ zones, loading, onEdit, onDelete, onRefresh }) => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);

    const filteredZones = zones.filter(zone => {
        const matchesSearch = zone.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (zone.description && zone.description.toLowerCase().includes(searchText.toLowerCase()));
        const matchesStatus = statusFilter === null || zone.is_active === (statusFilter === 'active');
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: desc => desc || '-',
        },
        {
            title: 'Delivery Fee',
            dataIndex: 'delivery_fee',
            key: 'delivery_fee',
            render: fee => `$${fee.toFixed(2)}`,
            sorter: (a, b) => a.delivery_fee - b.delivery_fee,
        },
        {
            title: 'Min Order',
            dataIndex: 'min_order_amount',
            key: 'min_order_amount',
            render: amount => amount ? `$${amount.toFixed(2)}` : '-',
            sorter: (a, b) => (a.min_order_amount || 0) - (b.min_order_amount || 0),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: active => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
            onFilter: (value, record) => 
                value === 'active' ? record.is_active : !record.is_active,
        },
        {
            title: 'Distributors',
            key: 'distributors',
            render: (_, record) => (
                <span>
                    {record.distributors.length > 0 
                        ? record.distributors.map(d => d.name).join(', ')
                        : 'None assigned'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" onClick={() => onEdit(record)}>Edit</Button>
                    <Button 
                        size="small" 
                        danger 
                        onClick={() => onDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Delivery Zones"
            extra={
                <Button 
                    icon={<SyncOutlined />} 
                    onClick={onRefresh}
                />
            }
        >
            <div className="mb-3">
                <Input
                    placeholder="Search zones..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300, marginRight: 16 }}
                />
                <Select
                    placeholder="Filter by status"
                    allowClear
                    onChange={value => setStatusFilter(value)}
                    style={{ width: 150, marginRight: 16 }}
                >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
                <Button icon={<FilterOutlined />} onClick={() => {
                    setSearchText('');
                    setStatusFilter(null);
                }}>
                    Clear Filters
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredZones}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
            />
        </Card>
    );
};

export default ZoneList;