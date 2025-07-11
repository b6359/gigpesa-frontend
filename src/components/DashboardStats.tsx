'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Eye, Star } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

const defaultStats: StatItem[] = [
  {
    label: 'Total Jobs',
    value: 128,
    icon: <Briefcase className="text-blue-600 w-5 h-5" />,
  },
  {
    label: 'Applicants',
    value: 342,
    icon: <Users className="text-green-600 w-5 h-5" />,
  },
  {
    label: 'Views',
    value: '7.1k',
    icon: <Eye className="text-purple-600 w-5 h-5" />,
  },
  {
    label: 'Featured Jobs',
    value: 12,
    icon: <Star className="text-yellow-500 w-5 h-5" />,
  },
];

export default function DashboardStats({
  stats = defaultStats,
}: {
  stats?: StatItem[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="rounded-2xl shadow-sm border p-4">
          <CardContent className="flex items-center gap-4 p-0">
            <div className="bg-gray-100 p-2 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
