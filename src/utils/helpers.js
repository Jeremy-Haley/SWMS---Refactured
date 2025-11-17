// Utility functions for SWMS Manager

export const getRiskColor = (risk) => {
  const riskNum = parseInt(risk);
  if (riskNum === 1) return 'bg-red-600';
  if (riskNum === 2) return 'bg-orange-500';
  if (riskNum === 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getRiskLabel = (risk) => {
  const riskNum = parseInt(risk);
  if (riskNum === 1) return 'Extreme';
  if (riskNum === 2) return 'High';
  if (riskNum === 3) return 'Medium';
  return 'Low';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getInitialFormData = (companyDefaults) => ({
  id: Date.now(),
  projectName: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  supervisor: '',
  company: companyDefaults,
  emergencyContacts: {
    nearestPolice: '',
    policePhone: '',
    nearestMedical: '',
    medicalPhone: '',
  },
  jobSteps: [],
  signOffs: [],
  newSignOff: {
    name: '',
    company: '',
    position: '',
  },
});
