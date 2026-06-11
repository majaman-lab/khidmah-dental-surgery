import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@khidmahdental.com";
const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error && !error.message.toLowerCase().includes("already")) {
  console.error(error.message);
  process.exit(1);
}

let userId = data.user?.id;

if (!userId) {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error(listError.message);
    process.exit(1);
  }
  userId = users.users.find((user) => user.email === email)?.id;
}

if (!userId) {
  console.error(`Could not find admin user ${email}`);
  process.exit(1);
}

const { error: profileError } = await supabase.from("admin_profiles").upsert({
  id: userId,
  email,
  role: "admin",
});

if (profileError) {
  console.error(profileError.message);
  process.exit(1);
}

console.log(`Admin ready: ${email}`);
