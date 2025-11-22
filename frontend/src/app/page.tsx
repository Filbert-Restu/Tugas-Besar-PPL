'use client';

import React from 'react';

import { AnnouncementBar } from '@/components/homepage/AnnouncementBar';
import { HeroSection } from '@/components/homepage/HeroSection';
import { NewArrivals } from '@/components/homepage/NewArrivals'; 
import { FeaturedCategories } from '@/components/homepage/FeaturedCategories';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <AnnouncementBar />
      
      <main className="grow">
        <HeroSection />
        
        <NewArrivals />
        
        <FeaturedCategories />
      </main>
    </div>
  );
}