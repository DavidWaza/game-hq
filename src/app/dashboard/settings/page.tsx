"use client";

import {redirect} from 'next/navigation'

const SettingsPage = () => {
  return (
   redirect('/dashboard/settings/personal-account')
  );
};

export default SettingsPage;
