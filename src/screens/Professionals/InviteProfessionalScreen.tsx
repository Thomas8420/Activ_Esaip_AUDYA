import React from 'react';
import InviteProfessionalPage from '../../components/Professionals/InviteProfessionalPage';
import { useNavigation } from '../../context/NavigationContext';

const InviteProfessionalScreen = () => {
  const { goBack } = useNavigation();
  return <InviteProfessionalPage onBack={goBack} />;
};

export default InviteProfessionalScreen;
