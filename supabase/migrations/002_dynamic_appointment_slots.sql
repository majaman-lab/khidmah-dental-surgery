create table if not exists public.appointment_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time text not null,
  is_enabled boolean not null default true,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

create table if not exists public.appointment_unavailable_days (
  id uuid primary key default gen_random_uuid(),
  unavailable_date date not null unique,
  reason text not null default '',
  created_at timestamptz not null default now()
);

alter table public.appointments
add column if not exists appointment_slot_id uuid references public.appointment_slots(id) on delete set null;

create unique index if not exists appointments_active_slot_unique
on public.appointments (appointment_slot_id)
where appointment_slot_id is not null and status <> 'Cancelled';

alter table public.appointment_slots enable row level security;
alter table public.appointment_unavailable_days enable row level security;

drop policy if exists "public create appointments" on public.appointments;

create policy "public read available appointment slots" on public.appointment_slots
for select using (
  is_enabled = true
  and slot_date >= current_date
  and not exists (
    select 1
    from public.appointment_unavailable_days unavailable
    where unavailable.unavailable_date = appointment_slots.slot_date
  )
  and not exists (
    select 1
    from public.appointments appointment
    where appointment.appointment_slot_id = appointment_slots.id
    and appointment.status <> 'Cancelled'
  )
);

create policy "admins manage appointment slots" on public.appointment_slots
for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage unavailable days" on public.appointment_unavailable_days
for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.book_appointment(
  p_patient_name text,
  p_mobile_number text,
  p_service_needed text,
  p_appointment_slot_id uuid,
  p_message text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_slot public.appointment_slots%rowtype;
  appointment_id uuid;
begin
  select *
  into selected_slot
  from public.appointment_slots
  where id = p_appointment_slot_id
  and is_enabled = true
  and slot_date >= current_date;

  if selected_slot.id is null then
    raise exception 'This appointment slot is no longer available.';
  end if;

  if exists (
    select 1
    from public.appointment_unavailable_days unavailable
    where unavailable.unavailable_date = selected_slot.slot_date
  ) then
    raise exception 'This date is unavailable for appointments.';
  end if;

  if exists (
    select 1
    from public.appointments appointment
    where appointment.appointment_slot_id = selected_slot.id
    and appointment.status <> 'Cancelled'
  ) then
    raise exception 'This appointment slot has already been booked.';
  end if;

  insert into public.appointments (
    patient_name,
    mobile_number,
    service_needed,
    preferred_date,
    preferred_time,
    message,
    status,
    appointment_slot_id
  )
  values (
    p_patient_name,
    p_mobile_number,
    p_service_needed,
    selected_slot.slot_date,
    selected_slot.slot_time,
    coalesce(p_message, ''),
    'Pending',
    selected_slot.id
  )
  returning id into appointment_id;

  return appointment_id;
exception
  when unique_violation then
    raise exception 'This appointment slot has already been booked.';
end;
$$;

grant execute on function public.book_appointment(text, text, text, uuid, text) to anon, authenticated;
