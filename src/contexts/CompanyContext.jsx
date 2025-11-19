import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCompany();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCompany();
      } else {
        setCompany(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCompany = async () => {
    try {
      // First get user's company ID and role via RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_current_company');
  
      if (rpcError) throw rpcError;
  
      if (rpcData && rpcData.length > 0) {
        const companyId = rpcData[0].company_id;
        
        // Then fetch COMPLETE company details directly from companies table
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();
        
        if (companyError) throw companyError;
        
        // Set company with ALL fields
        setCompany({
          id: companyData.id,
          name: companyData.name,
          logo: companyData.logo,
          color: companyData.primary_color || '#1e40af',
          subscriptionStatus: rpcData[0].subscription_status,
          userRole: rpcData[0].user_role,
          // ✅ Add all the missing fields:
          abn: companyData.abn,
          contact_name: companyData.contact_name,
          contact_phone: companyData.contact_phone,
          prepared_by: companyData.prepared_by,
        });
      }
    } catch (error) {
      console.error('Error loading company:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName, companyName, companyAbn) => {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw authError;

    // Step 2: Create company and user profile
    if (authData.user) {
      const { data: companyData, error: companyError } = await supabase.rpc(
        'create_user_profile_and_company',
        {
          user_id: authData.user.id, // Pass the user ID explicitly
          company_name: companyName,
          owner_name: fullName,
          owner_email: email,
          company_abn: companyAbn,
        }
      );

      if (companyError) throw companyError;
    }

    return authData;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCompany(null);
    setUser(null);
  };

  const updateCompany = async (updates) => {
    if (!company) return;

    const { error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', company.id);

    if (error) throw error;

    // Reload company data
    await loadCompany();
  };

  const checkSubscription = async () => {
    const { data, error } = await supabase.rpc('check_subscription_valid');
    if (error) throw error;
    return data;
  };

  const value = {
    company,
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateCompany,
    checkSubscription,
    isAuthenticated: !!user,
    isSubscriptionActive:
      company?.subscriptionStatus === 'active' ||
      company?.subscriptionStatus === 'trial',
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};
