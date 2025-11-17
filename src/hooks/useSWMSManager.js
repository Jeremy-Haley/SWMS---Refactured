import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useCompany } from '../contexts/CompanyContext';
import { getInitialFormData } from '../utils/helpers';
import { companyDefaults } from '../data/jobStepTemplates';

export const useSWMSManager = () => {
  const { company } = useCompany(); // Get company from context
  const [swmsList, setSwmsList] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [editingSWMS, setEditingSWMS] = useState(null);
  const [viewingSWMS, setViewingSWMS] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData(companyDefaults));
  const [loading, setLoading] = useState(false);

  // Load SWMS list from Supabase on mount
  useEffect(() => {
    loadSWMSList();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('swms_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'swms_documents' },
        () => {
          loadSWMSList();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSWMSList = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('swms_documents')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our format
      const transformedData = data.map((doc) => ({
        id: doc.id,
        projectName: doc.project_name,
        location: doc.project_location, // Using project_location from your DB
        activity: doc.activity,
        date: doc.date,
        supervisor: doc.supervisor,
        company: {
          orgName: doc.company_org_name || companyDefaults.orgName,
          acnAbn: doc.company_acn_abn || companyDefaults.acnAbn,
          contactName: doc.company_contact_name || '',
          contactNumber: doc.company_contact_number || '',
          preparedBy: doc.company_prepared_by || '',
        },
        emergencyContacts: doc.emergency_contacts || {
          nearestPolice: '',
          policePhone: '',
          nearestMedical: '',
          medicalPhone: '',
        },
        jobSteps: doc.job_steps || [],
        signOffs: [], // Will be loaded separately when needed
        companyId: doc.company_id,
      }));

      setSwmsList(transformedData);
    } catch (error) {
      console.error('Error loading SWMS list:', error);
      alert('Error loading SWMS documents. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const saveSWMS = async () => {
    if (!formData.projectName || !formData.location || !formData.supervisor) {
      alert(
        'Please fill in all required fields (Project Name, Location, Supervisor)'
      );
      return false;
    }

    if (formData.jobSteps.length === 0) {
      alert('Please add at least one job step');
      return false;
    }

    setLoading(true);
    try {
      // Make sure we have a company
      if (!company || !company.id) {
        alert('No company found. Please sign out and sign in again.');
        return false;
      }

      // Transform data for Supabase (matching YOUR table structure)
      const supabaseData = {
        company_id: company.id, // Use actual company ID from context
        project_name: formData.projectName,
        project_location: formData.location, // Maps to your project_location column
        activity: formData.activity || null,
        date: formData.date,
        supervisor: formData.supervisor,
        job_steps: formData.jobSteps,
        emergency_contacts: formData.emergencyContacts || {},
        // Store company details directly for now (since company_id is null)
        company_org_name: formData.company?.orgName || null,
        company_acn_abn: formData.company?.acnAbn || null,
        company_contact_name: formData.company?.contactName || null,
        company_contact_number: formData.company?.contactNumber || null,
        company_prepared_by: formData.company?.preparedBy || null,
      };

      let savedId;

      if (editingSWMS) {
        // Update existing
        const { error } = await supabase
          .from('swms_documents')
          .update(supabaseData)
          .eq('id', editingSWMS.id);

        if (error) throw error;
        savedId = editingSWMS.id;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('swms_documents')
          .insert([supabaseData])
          .select()
          .single();

        if (error) throw error;
        savedId = data.id;
      }

      // Save sign-offs to database
      console.log('Checking sign-offs to save:', formData.signOffs);

      if (formData.signOffs && formData.signOffs.length > 0) {
        // Filter out sign-offs that are already in database (have UUID)
        const newSignOffs = formData.signOffs.filter(
          (signOff) => !signOff.id.includes('-') // UUIDs have dashes, timestamps don't
        );

        console.log('New sign-offs to insert:', newSignOffs);

        if (newSignOffs.length > 0) {
          const signOffsToInsert = newSignOffs.map((signOff) => ({
            swms_id: savedId,
            worker_name: signOff.name,
            worker_company: signOff.company || null,
            worker_position: signOff.position,
            signed_at: new Date().toISOString(),
            // sign_off_method removed - column doesn't exist
          }));

          console.log('Formatted sign-offs for database:', signOffsToInsert);

          const { error: signOffError } = await supabase
            .from('swms_signoffs')
            .insert(signOffsToInsert);

          if (signOffError) {
            console.error('Error saving sign-offs:', signOffError);
            // Don't fail the whole save if sign-offs fail
            alert('SWMS saved, but there was an error saving some sign-offs.');
          } else {
            console.log('Sign-offs saved successfully!');
          }
        }
      } else {
        console.log('No sign-offs to save');
      }

      // Update formData with the ID so QR code works
      setFormData({ ...formData, id: savedId });

      await loadSWMSList();

      // Don't navigate away immediately if we just saved for QR code generation
      if (!editingSWMS) {
        // For new documents, stay on form so user can generate QR code
        setEditingSWMS({ ...formData, id: savedId });
      }

      return true;
    } catch (error) {
      console.error('Error saving SWMS:', error);
      alert('Error saving SWMS document. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSWMS = async (id) => {
    if (!window.confirm('Are you sure you want to delete this SWMS?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('swms_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadSWMSList();
    } catch (error) {
      console.error('Error deleting SWMS:', error);
      alert('Error deleting SWMS document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startEditSWMS = async (swms) => {
    setLoading(true);
    try {
      // Load sign-offs for this SWMS (using YOUR sign_offs table)
      const { data: signoffs, error } = await supabase
        .from('swms_signoffs')
        .select('*')
        .eq('swms_id', swms.id)
        .order('signed_at', { ascending: false });

      if (error) throw error;

      const transformedSignoffs = signoffs.map((s) => ({
        id: s.id,
        name: s.worker_name,
        company: s.worker_company,
        position: s.worker_position,
        date: new Date(s.signed_at).toISOString().split('T')[0],
        signature: s.signature,
      }));

      setEditingSWMS({ ...swms, signOffs: transformedSignoffs });
      setFormData({
        ...swms,
        signOffs: transformedSignoffs,
        newSignOff: {
          name: '',
          company: '',
          position: '',
        },
      });
      setCurrentView('form');
    } catch (error) {
      console.error('Error loading SWMS for editing:', error);
      alert('Error loading SWMS document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startNewSWMS = () => {
    setEditingSWMS(null);
    setFormData(getInitialFormData(companyDefaults));
    setCurrentView('form');
  };

  const viewSWMS = (swms) => {
    setViewingSWMS(swms);
    setCurrentView('view');
  };

  const cancelForm = () => {
    setCurrentView('list');
    setFormData(getInitialFormData(companyDefaults));
    setEditingSWMS(null);
  };

  // Job Steps operations
  const addJobStepFromTemplate = (templateKey, template) => {
    const newStep = {
      id: Date.now(),
      name: template.name,
      preparation: template.preparation,
      hazards: template.hazards,
      initialRisk: template.initialRisk,
      controls: template.controls,
      residualRisk: template.residualRisk,
      responsible: template.responsible,
    };
    setFormData({
      ...formData,
      jobSteps: [...formData.jobSteps, newStep],
    });
  };

  const addMultipleJobStepsFromTemplates = (templateKeysAndTemplates) => {
    const newSteps = templateKeysAndTemplates.map((item, index) => ({
      id: Date.now() + index,
      name: item.template.name,
      preparation: item.template.preparation,
      hazards: item.template.hazards,
      initialRisk: item.template.initialRisk,
      controls: item.template.controls,
      residualRisk: item.template.residualRisk,
      responsible: item.template.responsible,
    }));

    setFormData({
      ...formData,
      jobSteps: [...formData.jobSteps, ...newSteps],
    });
  };

  const addCustomJobStep = () => {
    const newStep = {
      id: Date.now(),
      name: '',
      preparation: '',
      hazards: '',
      initialRisk: '3',
      controls: '',
      residualRisk: '3',
      responsible: '',
    };
    setFormData({
      ...formData,
      jobSteps: [...formData.jobSteps, newStep],
    });
  };

  const updateJobStep = (id, field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      jobSteps: prevFormData.jobSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    }));
  };

  const removeJobStep = (id) => {
    setFormData({
      ...formData,
      jobSteps: formData.jobSteps.filter((step) => step.id !== id),
    });
  };

  // Sign-off operations
  const addSignOff = (signOffData) => {
    console.log('addSignOff called with:', signOffData);

    const newSignOff = signOffData || {
      id: Date.now(),
      name: '',
      position: '',
      company: '',
      date: new Date().toISOString().split('T')[0],
    };

    // Use functional update to get the latest state
    setFormData((prevFormData) => {
      console.log('Previous formData in setState:', prevFormData);
      console.log('Previous signOffs:', prevFormData.signOffs);

      const currentSignOffs = Array.isArray(prevFormData.signOffs)
        ? prevFormData.signOffs
        : [];
      const updatedSignOffs = [...currentSignOffs, newSignOff];

      console.log('Updated signOffs will be:', updatedSignOffs);

      const newFormData = {
        ...prevFormData,
        signOffs: updatedSignOffs,
      };

      console.log('Returning new formData:', newFormData);

      return newFormData;
    });
  };

  const updateSignOff = (id, field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      signOffs: prevFormData.signOffs.map((signOff) =>
        signOff.id === id ? { ...signOff, [field]: value } : signOff
      ),
    }));
  };

  const removeSignOff = async (id) => {
    // If it's a real Supabase sign-off (UUID format), delete from database
    if (typeof id === 'string' && id.includes('-')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('sign_offs')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error removing sign-off:', error);
        alert('Error removing sign-off. Please try again.');
        return;
      } finally {
        setLoading(false);
      }
    }

    setFormData({
      ...formData,
      signOffs: (formData.signOffs || []).filter(
        (signOff) => signOff.id !== id
      ),
    });
  };

  // Form data updates
  const updateFormField = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const updateCompanyField = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      company: { ...prevFormData.company, [field]: value },
    }));
  };

  return {
    // State
    swmsList,
    currentView,
    editingSWMS,
    viewingSWMS,
    formData,
    loading,
    // View management
    setCurrentView,
    startNewSWMS,
    startEditSWMS,
    viewSWMS,
    cancelForm,
    // SWMS operations
    saveSWMS,
    deleteSWMS,
    // Form operations
    updateFormField,
    updateCompanyField,
    // Job steps operations
    addJobStepFromTemplate,
    addMultipleJobStepsFromTemplates,
    addCustomJobStep,
    updateJobStep,
    removeJobStep,
    // Sign-offs operations
    addSignOff,
    updateSignOff,
    removeSignOff,
  };
};
