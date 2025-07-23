"use client"
import React, { useEffect } from 'react'
import { setGoogleTag, useGoogleTag } from '../hooks'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useGoogleTag()
  useEffect(() => {
    setGoogleTag('G-FRBDNMMBS8');
  }, []);
  return <>{children}</>
}