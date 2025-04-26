import React from 'react';
import { Card, Progress, Row, Col, Statistic } from 'antd';
import { StrategyRating as StrategyRatingType } from '@/api/strategy';

interface StrategyRatingProps {
  rating: StrategyRatingType;
}

const StrategyRating: React.FC<StrategyRatingProps> = ({ rating }) => {
  const {
    performance,
    risk,
    stability,
    userSatisfaction,
    totalUsers,
    averageReturn,
    successRate,
  } = rating;

  return (
    <Card title="策略评分" bordered={false}>
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" title="性能评分">
            <Progress
              type="circle"
              percent={Math.round(performance * 100)}
              status={performance >= 0.8 ? 'success' : performance >= 0.6 ? 'normal' : 'exception'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="风险评分">
            <Progress
              type="circle"
              percent={Math.round(risk * 100)}
              status={risk <= 0.3 ? 'success' : risk <= 0.6 ? 'normal' : 'exception'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="稳定性">
            <Progress
              type="circle"
              percent={Math.round(stability * 100)}
              status={stability >= 0.8 ? 'success' : stability >= 0.6 ? 'normal' : 'exception'}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="用户满意度">
            <Progress
              type="circle"
              percent={Math.round(userSatisfaction * 100)}
              status={userSatisfaction >= 0.8 ? 'success' : userSatisfaction >= 0.6 ? 'normal' : 'exception'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Statistic title="使用人数" value={totalUsers} />
        </Col>
        <Col span={8}>
          <Statistic
            title="平均收益率"
            value={averageReturn}
            precision={2}
            suffix="%"
            valueStyle={{ color: averageReturn >= 0 ? '#3f8600' : '#cf1322' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="成功率"
            value={successRate}
            precision={2}
            suffix="%"
            valueStyle={{ color: successRate >= 0.7 ? '#3f8600' : successRate >= 0.5 ? '#faad14' : '#cf1322' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default StrategyRating; 