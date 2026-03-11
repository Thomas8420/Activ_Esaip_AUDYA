import React from 'react';
import AddProfessionalPage from '../../components/Professionals/AddProfessionalPage';
import { useNavigation } from '../../context/NavigationContext';

const AddProfessionalScreen = () => {
  const { goBack, navigateToInvite } = useNavigation();
  return <AddProfessionalPage onBack={goBack} onInvite={navigateToInvite} />;
};

export default AddProfessionalScreen;
