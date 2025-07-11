'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: { location: string; type: string }) => void;
}

export default function FilterBar({ onSearch, onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    onSearch?.(search);
    onFilterChange?.({ location, type });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 border rounded-2xl shadow-sm">
      <Input
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1"
      />
      <div className="relative flex-1">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 p-2 pr-10 text-sm text-gray-700"
        >
          <option value="">Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      </div>
      <Button onClick={handleSearch} className="shrink-0">
        Filter
      </Button>
    </div>
  );
}
