import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FinancialSummaryCard = ({ title, value, icon, variant = 'primary', change = null }) => {
  const icons = {
    revenue: <FaMoneyBillWave size={24} />,
    pending: <FaClock size={24} />,
    completed: <FaCheckCircle size={24} />,
    failed: <FaTimesCircle size={24} />
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={8}>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">${value}</h3>
            {change && (
              <small className={`text-${change > 0 ? 'success' : 'danger'}`}>
                {change > 0 ? '+' : ''}{change}% from last period
              </small>
            )}
          </Col>
          <Col xs={4} className="text-end">
            <div className={`icon-shape icon-${variant} rounded`}>
              {icon && icons[icon]}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FinancialSummaryCard;