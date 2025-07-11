'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  paymentRange: string;
  description: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{job.company}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700">
        <p><span className="font-medium">Location:</span> {job.location}</p>
        <p><span className="font-medium">Type:</span> {job.type}</p>
        <p><span className="font-medium">Category:</span> {job.category}</p>
        <p><span className="font-medium">Payment:</span> {job.paymentRange}</p>
        <p className="text-gray-600">{job.description}</p>
      </CardContent>
    </Card>
  );
}
