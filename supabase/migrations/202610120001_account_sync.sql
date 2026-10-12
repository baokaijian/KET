-- Run in Supabase SQL Editor. No service-role key is required by the frontend.
begin;

create table if not exists public.learning_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null default 0 check (revision >= 0),
  snapshot jsonb not null default '{"values":{},"conflicts":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 4194304)
);
create table if not exists public.learning_operations (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id text not null check (length(operation_id) between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, operation_id)
);
alter table public.learning_accounts enable row level security;
alter table public.learning_operations enable row level security;
drop policy if exists own_learning_account on public.learning_accounts;
create policy own_learning_account on public.learning_accounts for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists own_learning_operations on public.learning_operations;
create policy own_learning_operations on public.learning_operations for select to authenticated using (user_id = (select auth.uid()));
-- Writes must pass through the transaction below, including deduplication.
revoke all on public.learning_accounts, public.learning_operations from anon, authenticated;
grant select on public.learning_accounts, public.learning_operations to authenticated;

create or replace function public.read_learning(p_operation_ids text[] default '{}')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := auth.uid();
  account public.learning_accounts%rowtype;
  acknowledged jsonb;
begin
  if caller is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if p_operation_ids is null or cardinality(p_operation_ids) > 100 then raise exception 'Invalid operation batch'; end if;
  insert into public.learning_accounts(user_id) values(caller) on conflict do nothing;
  select * into account from public.learning_accounts where user_id = caller for share;
  select coalesce(jsonb_agg(operation_id order by operation_id), '[]'::jsonb) into acknowledged
    from public.learning_operations where user_id = caller and operation_id = any(p_operation_ids);
  return jsonb_build_object('revision', account.revision, 'snapshot', account.snapshot, 'acknowledged', acknowledged);
end;
$$;

create or replace function public.commit_learning(p_revision bigint, p_snapshot jsonb, p_operation_ids text[])
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  caller uuid := auth.uid();
  account public.learning_accounts%rowtype;
begin
  if caller is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if p_revision is null or p_revision < 0 or p_operation_ids is null or cardinality(p_operation_ids) not between 1 and 100
    or exists(select 1 from unnest(p_operation_ids) x where x is null or length(x) not between 1 and 120)
    or (select count(distinct x) from unnest(p_operation_ids) x) <> cardinality(p_operation_ids)
    or p_snapshot is null or jsonb_typeof(p_snapshot) <> 'object'
    or coalesce(jsonb_typeof(p_snapshot->'values'), '') <> 'object'
    or coalesce(jsonb_typeof(p_snapshot->'conflicts'), '') <> 'array'
    or octet_length(p_snapshot::text) > 4194304 then
    raise exception 'Invalid sync payload';
  end if;
  insert into public.learning_accounts(user_id) values(caller) on conflict do nothing;
  select * into account from public.learning_accounts where user_id = caller for update;
  -- Row lock + revision check serialize commits from independent browsers.
  if account.revision <> p_revision or exists(
    select 1 from public.learning_operations where user_id = caller and operation_id = any(p_operation_ids)
  ) then return jsonb_build_object('ok', false); end if;
  update public.learning_accounts set snapshot = p_snapshot, revision = revision + 1, updated_at = now()
    where user_id = caller returning * into account;
  insert into public.learning_operations(user_id, operation_id) select caller, x from unnest(p_operation_ids) x;
  return jsonb_build_object('ok', true, 'revision', account.revision, 'snapshot', account.snapshot);
end;
$$;
revoke all on function public.read_learning(text[]) from public, anon;
revoke all on function public.commit_learning(bigint, jsonb, text[]) from public, anon;
grant execute on function public.read_learning(text[]) to authenticated;
grant execute on function public.commit_learning(bigint, jsonb, text[]) to authenticated;
commit;
