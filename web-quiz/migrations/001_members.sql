create table if not exists users (
  id serial primary key,
  email text not null unique,
  name text not null default '',
  answers jsonb not null default '{}'::jsonb,
  access_code_hash text,
  created_at timestamptz not null default now()
);

create table if not exists purchases (
  id serial primary key,
  user_id integer not null references users(id),
  plan_id text not null,
  amount_cents integer not null,
  currency text not null,
  square_payment_id text unique,
  status text not null,
  environment text not null,
  receipt_url text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists purchases_user_idx on purchases (user_id, expires_at);

create table if not exists sessions (
  token_hash text primary key,
  user_id integer not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists progress (
  user_id integer not null references users(id),
  item text not null,
  done_at timestamptz not null default now(),
  primary key (user_id, item)
);

create table if not exists weights (
  user_id integer not null references users(id),
  logged_on date not null,
  kg numeric(5, 1) not null,
  primary key (user_id, logged_on)
);

create table if not exists login_attempts (
  id serial primary key,
  email text not null,
  ok boolean not null,
  at timestamptz not null default now()
);
create index if not exists login_attempts_email_idx on login_attempts (email, at);
