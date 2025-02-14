import React from 'react';

interface LegalSectionProps {
  title: string;
  items: {
    id: number;
    content: string;
  }[];
}

export default function LegalSection({ title, items }: LegalSectionProps) {
  return (
    <div className="mb-10">
      <h3 className="text-xl font-medium mb-4 text-blue-600">{title}</h3>
      <div className="space-y-3 text-gray-700">
        {items.map((item) => (
          <p key={item.id}>{item.content}</p>
        ))}
      </div>
    </div>
  );
} 