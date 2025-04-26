import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface MobileFormProps {
  steps: FormField[][];
  onSubmit: (formData: Record<string, string>) => void;
  title: string;
}

const MobileForm: React.FC<MobileFormProps> = ({ steps, onSubmit, title }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: FormField[]) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.forEach(field => {
      const value = formData[field.name] || '';
      
      if (field.required && !value) {
        newErrors[field.name] = t('form.validation.required');
        isValid = false;
      } else if (field.validation) {
        const validationError = field.validation(value);
        if (validationError) {
          newErrors[field.name] = validationError;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(steps[activeStep])) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field: FormField) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (validateStep(steps[activeStep])) {
      onSubmit(formData);
    }
  };

  const renderStepContent = (step: FormField[]) => {
    return step.map((field) => (
      <TextField
        key={field.name}
        fullWidth
        margin="normal"
        name={field.name}
        label={field.label}
        type={field.type}
        value={formData[field.name] || ''}
        onChange={handleChange(field)}
        error={!!errors[field.name]}
        helperText={errors[field.name]}
        required={field.required}
      />
    ));
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {title}
        </Typography>

        {!isMobile && (
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((_, index) => (
              <Step key={index}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        )}

        <Box sx={{ mb: 3 }}>
          {renderStepContent(steps[activeStep])}
        </Box>

        {isMobile ? (
          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1, mb: 2 }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                {t('form.next')}
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
                {t('form.back')}
              </Button>
            }
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<KeyboardArrowLeft />}
            >
              {t('form.back')}
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              endIcon={activeStep === steps.length - 1 ? undefined : <KeyboardArrowRight />}
            >
              {activeStep === steps.length - 1 ? t('form.submit') : t('form.next')}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MobileForm; 