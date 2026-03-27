'use client';

import React from 'react';
import { format } from 'date-fns';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=1a2d4a`;

export interface Client {
  id: string;
  name: string;
  email: string;
  entityType: string;
  filingStatus: string;
  status: 'active' | 'docs-due' | 'review' | 'irs-notice' | 'inactive';
  serviceLevel: string;
  clientSince: string;
}

export const clients: Client[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@chenfreelance.com', entityType: '1040', filingStatus: 'Single', status: 'active', serviceLevel: 'Tax + Advisory', clientSince: '2022-03-01' },
  { id: '2', name: 'Marcus Webb', email: 'marcus@webbsolutions.com', entityType: '1120-S', filingStatus: 'S-Corp', status: 'docs-due', serviceLevel: 'Tax Only', clientSince: '2021-11-15' },
  { id: '3', name: 'Priya Nair', email: 'priya@nairllc.com', entityType: '1065', filingStatus: 'Partnership', status: 'review', serviceLevel: 'Tax + Bookkeeping', clientSince: '2023-01-10' },
  { id: '4', name: 'David Kim', email: 'david@kimconsulting.com', entityType: '1040', filingStatus: 'MFJ', status: 'irs-notice', serviceLevel: 'Tax Only', clientSince: '2020-06-22' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@leecreative.io', entityType: '1040', filingStatus: 'Single', status: 'active', serviceLevel: 'Tax + Advisory', clientSince: '2023-04-05' },
  { id: '6', name: 'Aisha Patel', email: 'aisha@patelbakery.com', entityType: '1120-S', filingStatus: 'S-Corp', status: 'active', serviceLevel: 'Tax + Bookkeeping', clientSince: '2022-08-19' },
  { id: '7', name: 'Tom Rivera', email: 'tom@riveraproperties.com', entityType: '1065', filingStatus: 'Partnership', status: 'docs-due', serviceLevel: 'Tax Only', clientSince: '2021-02-28' },
  { id: '8', name: 'Nina Zhao', email: 'nina@zhaodesign.com', entityType: '1040', filingStatus: 'Single', status: 'active', serviceLevel: 'Tax + Advisory', clientSince: '2023-09-12' },
];

const statusConfig = {
  'active': { label: 'Active', color: 'bg-[#0f2820] text-[#34d399]' },
  'docs-due': { label: 'Docs due', color: 'bg-[#2a1f0e] text-[#f59e0b]' },
  'review': { label: 'Review', color: 'bg-[#1a2d4a] text-[#4f8ef7]' },
  'irs-notice': { label: 'IRS notice', color: 'bg-[#2a1010] text-[#f87171]' },
  'inactive': { label: 'Inactive', color: 'bg-[#1a1a1e] text-[#555]' },
};

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-[7px]', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('bg-[#1a2d4a] text-[#4f8ef7] flex size-full items-center justify-center rounded-[7px] text-[11px] font-semibold', className)}
      {...props}
    />
  );
}

function ClientRow({ client }: { client: Client }) {
  const status = statusConfig[client.status];
  const initials = client.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="w-full flex items-center py-3 px-6 border-b border-[#161618] hover:bg-[#131315] text-sm last:border-b-0 cursor-pointer transition-colors">
      <div className="flex-grow flex items-center gap-3 overflow-hidden">
        <Avatar>
          <AvatarImage src={avatarUrl(client.name)} alt={client.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium text-[#ccc] truncate">{client.name}</span>
          <span className="text-xs text-[#444] truncate">{client.email}</span>
        </div>
      </div>
      <div className="w-28 shrink-0 text-xs text-[#555]">{client.entityType}</div>
      <div className="w-40 shrink-0 text-xs text-[#555]">{client.serviceLevel}</div>
      <div className="w-32 shrink-0 text-xs text-[#555]">
        {format(new Date(client.clientSince), 'MMM yyyy')}
      </div>
      <div className="w-32 shrink-0">
        <span className={cn('text-[10.5px] font-semibold font-mono px-2 py-0.5 rounded-[5px]', status.color)}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

const MemberList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full h-full bg-[#0d0d0f]', className)} {...props}>
      <div className="px-6 py-3 text-xs flex items-center text-[#444] border-b border-[#1e1e22] sticky top-0 bg-[#0d0d0f] z-10">
        <div className="flex-grow">Client</div>
        <div className="w-28 shrink-0">Entity</div>
        <div className="w-40 shrink-0">Services</div>
        <div className="w-32 shrink-0">Client since</div>
        <div className="w-32 shrink-0">Status</div>
      </div>
      <div className="w-full">
        {clients.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
);
MemberList.displayName = 'MemberList';

export default MemberList;