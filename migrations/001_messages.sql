create table if not exists messages (
  id bigserial primary key,
  sender_name text not null,
  sender_email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on messages (created_at desc);
