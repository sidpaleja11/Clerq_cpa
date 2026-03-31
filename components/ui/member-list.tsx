'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@/lib/supabase/client';

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

const statusConfig = {
  'active': { label: 'Active', color: 'bg-[#0f2820] text-[#34d399]' },
  'docs-due': { label: 'Docs due', color: 'bg-[#2a1f0e] text-[#f59e0b]' },
  'review': { label: 'Review', color: 'bg-[#1a2d4a] text-[#4f8ef7]' },
  'irs-notice': { label: 'IRS notice', color: 'bg-[#2a1010] text-[#f87171]' },
  'inactive': { label: 'Inactive', color: 'bg-[#1a1a1e] text-[#555]' },
};

function displayEntityType(raw: string): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  };
  return map[raw?.toLowerCase()] ?? raw ?? '—';
}

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
  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2);

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
  ({ className, ...props }, ref) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const supabase = createClient();
      supabase
        .from('clients')
        .select('id, name, email, entity_type, filing_status, service_level, created_at')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) {
            setClients(data.map(c => ({
              id: c.id,
              name: c.name,
              email: c.email ?? '',
              entityType: displayEntityType(c.entity_type ?? ''),
              filingStatus: c.filing_status ?? '—',
              status: 'active' as const,
              serviceLevel: c.service_level ?? '—',
              clientSince: c.created_at,
            })));
          }
          setLoading(false);
        });
    }, []);

    return (
      <div ref={ref} className={cn('w-full h-full bg-[#0d0d0f]', className)} {...props}>
        <div className="px-6 py-3 text-xs flex items-center text-[#444] border-b border-[#1e1e22] sticky top-0 bg-[#0d0d0f] z-10">
          <div className="flex-grow">Client</div>
          <div className="w-28 shrink-0">Entity</div>
          <div className="w-40 shrink-0">Services</div>
          <div className="w-32 shrink-0">Client since</div>
          <div className="w-32 shrink-0">Status</div>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-[12px] text-[#444]">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="px-6 py-10 text-center text-[12px] text-[#444]">No clients yet. Add your first client to get started.</div>
        ) : (
          <div className="w-full">
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    );
  }
);
MemberList.displayName = 'MemberList';

export default MemberList;
