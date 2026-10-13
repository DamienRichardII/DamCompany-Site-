-- Carte de fidélité — schéma initial.
-- À appliquer sur un projet Supabase de TEST d'abord. Non appliqué automatiquement.
-- Principe : un commerçant (auth.users) ne voit que ses propres données (RLS).
-- Les écritures sensibles (abonnement, événements Stripe) passent par la clé
-- service_role côté serveur uniquement.

create extension if not exists pgcrypto;

-- Commerçants et établissements ------------------------------------------------
create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create table public.establishments (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  -- Jeton public du QR du COMMERCE (lien d'inscription). Imprévisible.
  join_token text not null unique default encode(gen_random_bytes(18), 'hex'),
  created_at timestamptz not null default now()
);
create index on public.establishments (merchant_id);

-- Configuration / programme ---------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null unique references public.establishments(id) on delete cascade,
  config_version int not null default 1,
  config jsonb not null,                       -- configuration validée côté serveur (zod)
  mode text not null check (mode in ('stamps', 'points')),
  goal int not null check (goal > 0),
  active boolean not null default false,       -- passe à true UNIQUEMENT via entitlement payé
  updated_at timestamptz not null default now()
);

-- Adhérents et cartes ---------------------------------------------------------
create table public.members (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  first_name text check (char_length(first_name) <= 60),
  email text check (char_length(email) <= 120),
  created_at timestamptz not null default now()
);
create index on public.members (establishment_id);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references public.members(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  -- Jeton du QR INDIVIDUEL. Imprévisible, distinct du jeton du commerce.
  public_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  balance int not null default 0 check (balance >= 0),
  created_at timestamptz not null default now()
);
create index on public.cards (program_id);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  actor_id uuid not null references auth.users(id),   -- commerçant ayant crédité
  delta int not null check (delta <> 0),
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now()
);
create index on public.transactions (card_id);

create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  actor_id uuid not null references auth.users(id),
  cost int not null check (cost > 0),
  created_at timestamptz not null default now()
);

-- Abonnements / droits ---------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_checkout_session_id text unique,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.entitlements (
  merchant_id uuid primary key references public.merchants(id) on delete cascade,
  loyalty_active boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Idempotence du webhook Stripe: un événement n'est traité qu'une fois.
create table public.stripe_events (
  id text primary key,                      -- evt_...
  type text not null,
  received_at timestamptz not null default now()
);

-- RLS ---------------------------------------------------------------------------
alter table public.merchants          enable row level security;
alter table public.establishments     enable row level security;
alter table public.programs           enable row level security;
alter table public.members            enable row level security;
alter table public.cards              enable row level security;
alter table public.transactions       enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.entitlements       enable row level security;
alter table public.stripe_events      enable row level security;  -- aucune policy : service_role seulement

create function public.owns_merchant(m uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.merchants where id = m and owner_id = auth.uid());
$$;

create function public.owns_establishment(e uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.establishments es
    join public.merchants m on m.id = es.merchant_id
    where es.id = e and m.owner_id = auth.uid());
$$;

create function public.owns_program(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.programs pr where pr.id = p and public.owns_establishment(pr.establishment_id));
$$;

create function public.owns_card(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.cards ca where ca.id = c and public.owns_program(ca.program_id));
$$;

create policy merchants_own on public.merchants for select using (owner_id = auth.uid());
create policy merchants_insert on public.merchants for insert with check (owner_id = auth.uid());

create policy est_select on public.establishments for select using (public.owns_merchant(merchant_id));
create policy est_insert on public.establishments for insert with check (public.owns_merchant(merchant_id));
create policy est_update on public.establishments for update using (public.owns_merchant(merchant_id));

-- Un commerçant peut modifier sa configuration, mais PAS activer le programme :
-- la colonne `active` n'est modifiable que par le serveur (service_role).
create policy prog_select on public.programs for select using (public.owns_establishment(establishment_id));
create policy prog_insert on public.programs for insert with check (public.owns_establishment(establishment_id) and active = false);
create policy prog_update on public.programs for update using (public.owns_establishment(establishment_id));
revoke update (active) on public.programs from authenticated, anon;

create policy mem_select on public.members for select using (public.owns_establishment(establishment_id));
create policy card_select on public.cards for select using (public.owns_program(program_id));
create policy tx_select on public.transactions for select using (public.owns_card(card_id));
create policy red_select on public.reward_redemptions for select using (public.owns_card(card_id));
create policy sub_select on public.subscriptions for select using (public.owns_merchant(merchant_id));
create policy ent_select on public.entitlements for select using (public.owns_merchant(merchant_id));

-- Aucune écriture directe sur cartes/transactions/récompenses depuis le client :
-- tout passe par les fonctions ci-dessous qui vérifient l'identité du commerçant.
revoke insert, update, delete on public.cards, public.transactions, public.reward_redemptions, public.members from authenticated, anon;

-- Crédit d'une carte : réservé au commerçant propriétaire, programme actif.
create function public.credit_card(p_card uuid, p_delta int, p_note text default null)
returns int language plpgsql security definer set search_path = public as $$
declare new_balance int;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_delta is null or p_delta = 0 or abs(p_delta) > 10000 then raise exception 'invalid_delta'; end if;
  if not public.owns_card(p_card) then raise exception 'forbidden'; end if;
  if not exists (
    select 1 from public.cards c join public.programs p on p.id = c.program_id
    where c.id = p_card and p.active) then raise exception 'program_inactive'; end if;

  update public.cards set balance = balance + p_delta where id = p_card
    returning balance into new_balance;   -- check (balance >= 0) refuse un solde négatif
  insert into public.transactions (card_id, actor_id, delta, note) values (p_card, auth.uid(), p_delta, p_note);
  return new_balance;
end $$;

-- Validation d'une récompense : décrémente le solde du coût et l'historise.
create function public.redeem_reward(p_card uuid, p_cost int)
returns int language plpgsql security definer set search_path = public as $$
declare new_balance int;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_cost is null or p_cost <= 0 then raise exception 'invalid_cost'; end if;
  if not public.owns_card(p_card) then raise exception 'forbidden'; end if;
  update public.cards set balance = balance - p_cost where id = p_card
    returning balance into new_balance;   -- échoue si solde insuffisant
  insert into public.reward_redemptions (card_id, actor_id, cost) values (p_card, auth.uid(), p_cost);
  return new_balance;
end $$;

revoke all on function public.credit_card(uuid, int, text), public.redeem_reward(uuid, int) from public, anon;
grant execute on function public.credit_card(uuid, int, text), public.redeem_reward(uuid, int) to authenticated;
