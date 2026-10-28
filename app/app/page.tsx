'use client';

import React from 'react';
import App from '@/app/page';

export default function AppPage() {
  // Directly render app with query param simulation or app wrapper
  return (
    <div className="w-full min-h-screen">
      <App />
    </div>
  );
}

