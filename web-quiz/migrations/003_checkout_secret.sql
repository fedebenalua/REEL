alter table checkouts add column if not exists secret_hash text;
alter table checkouts add column if not exists email text;
alter table checkouts add column if not exists session_issued boolean not null default false;
create index if not exists checkouts_email_idx on checkouts (email, created_at);
