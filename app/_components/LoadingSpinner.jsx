"use client";
import React from "react";
import { SpinnerLoading } from './LoadingAnimation';

export default function LoadingSpinner({ size = "md", className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <SpinnerLoading />
    </div>
  );
} 