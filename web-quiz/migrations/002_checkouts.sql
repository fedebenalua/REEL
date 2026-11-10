alter table users add column if not exists reserved_by text;
alter table users add column if not exists reserved_at timestamptz;

create table if not exists checkouts (
  id text primary key,
  user_id integer,
  created_account boolean not null default false,
  plan_id text not null,
  amount_cents integer not null,
  currency text not null,
  status text not null default 'pending',
  square_payment_id text,
  error_message text,
  created_at timestamptz not null default now(),
  attempt_at timestamptz not null default now()
);
create index if not exists checkouts_status_idx on checkouts (status, created_at);
