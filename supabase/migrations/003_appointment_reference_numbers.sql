alter table public.appointments
add column if not exists reference_number text;

create unique index if not exists appointments_reference_number_unique
on public.appointments (reference_number)
where reference_number is not null;

create or replace function public.book_appointment(
  p_patient_name text,
  p_mobile_number text,
  p_service_needed text,
  p_appointment_slot_id uuid,
  p_message text default '',
  p_reference_number text default null
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
    appointment_slot_id,
    reference_number
  )
  values (
    p_patient_name,
    p_mobile_number,
    p_service_needed,
    selected_slot.slot_date,
    selected_slot.slot_time,
    coalesce(p_message, ''),
    'Pending',
    selected_slot.id,
    p_reference_number
  )
  returning id into appointment_id;

  return appointment_id;
exception
  when unique_violation then
    raise exception 'This appointment slot has already been booked.';
end;
$$;

grant execute on function public.book_appointment(text, text, text, uuid, text, text) to anon, authenticated;
