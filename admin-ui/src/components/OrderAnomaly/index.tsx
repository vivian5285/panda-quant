import React from 'react';
import { Card, Tag, Timeline, Button, Modal, Form, Input } from 'antd';
import { OrderAnomaly as OrderAnomalyType } from '@/api/order';

interface OrderAnomalyProps {
  anomalies: OrderAnomalyType[];
  onMarkAbnormal: (reason: string) => void;
}

const OrderAnomaly: React.FC<OrderAnomalyProps> = ({ anomalies, onMarkAbnormal }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = React.useState(false);

  const anomalyTypeText = {
    continuous_loss: '连续亏损',
    unusual_volume: '异常交易量',
    price_deviation: '价格偏离',
  };

  const severityColor = {
    warning: 'orange',
    critical: 'red',
  };

  const handleMarkAbnormal = () => {
    form.validateFields().then(values => {
      onMarkAbnormal(values.reason);
      setModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Card
      title="异常检测"
      bordered={false}
      extra={
        <Button type="primary" onClick={() => setModalVisible(true)}>
          标记异常
        </Button>
      }
    >
      <Timeline>
        {anomalies.map((anomaly, index) => (
          <Timeline.Item
            key={index}
            color={severityColor[anomaly.severity]}
          >
            <p>
              <Tag color={severityColor[anomaly.severity]}>
                {anomaly.severity === 'warning' ? '警告' : '严重'}
              </Tag>
              {anomalyTypeText[anomaly.type]}
            </p>
            <p>{anomaly.description}</p>
            <p>建议操作: {anomaly.suggestedAction}</p>
            <p>时间: {new Date(anomaly.timestamp).toLocaleString()}</p>
          </Timeline.Item>
        ))}
      </Timeline>

      <Modal
        title="标记异常"
        open={modalVisible}
        onOk={handleMarkAbnormal}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="异常原因"
            rules={[{ required: true, message: '请输入异常原因' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OrderAnomaly; 