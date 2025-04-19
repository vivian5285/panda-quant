import React from 'react';
import { useTranslation } from 'react-i18next';
import MobileForm from '../components/MobileForm';

const ExampleForm: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    [
      {
        name: 'email',
        label: t('form.labels.email'),
        type: 'email',
        required: true,
        validation: (value: string) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return t('form.validation.email');
          }
          return null;
        }
      },
      {
        name: 'password',
        label: t('form.labels.password'),
        type: 'password',
        required: true,
        validation: (value: string) => {
          if (value.length < 8) {
            return t('form.validation.password');
          }
          return null;
        }
      }
    ],
    [
      {
        name: 'firstName',
        label: t('form.labels.firstName'),
        type: 'text',
        required: true
      },
      {
        name: 'lastName',
        label: t('form.labels.lastName'),
        type: 'text',
        required: true
      }
    ],
    [
      {
        name: 'phone',
        label: t('form.labels.phone'),
        type: 'tel',
        required: true
      },
      {
        name: 'address',
        label: t('form.labels.address'),
        type: 'text',
        required: true
      }
    ]
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    // 在这里处理表单提交逻辑
  };

  return (
    <MobileForm
      steps={steps}
      onSubmit={handleSubmit}
      title={t('form.title')}
    />
  );
};

export default ExampleForm; 