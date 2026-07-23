import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = data || [];
  const headers = [
    "Patient Name",
    "Mobile Number",
    "Service Needed",
    "Preferred Date",
    "Preferred Time",
    "Slot ID",
    "Message",
    "Status",
    "Created At",
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.patient_name,
        row.mobile_number,
        row.service_needed,
        row.preferred_date,
        row.preferred_time,
        row.appointment_slot_id,
        row.message,
        row.status,
        row.created_at,
      ]
        .map(csvCell)
        .join(","),
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="khidmah-appointments.csv"',
    },
  });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}
