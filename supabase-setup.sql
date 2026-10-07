-- ============================================================
-- LUXE BOUTIQUE — Supabase setup
-- Run this ONCE in your Supabase project: SQL Editor → New query → paste → Run
-- Then: Authentication → Add user → create your admin email + password
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Tables ----------
create table if not exists products (
  id bigint primary key,
  name text not null,
  price numeric not null,
  category text not null,
  stock int not null default 10,
  image text,
  images text[] default '{}',
  rating numeric default 0,
  reviews int default 0,
  badge text default '',
  description text default ''
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  date text,
  name text not null,
  phone text not null,
  email text,
  address text not null,
  notes text,
  items jsonb not null default '[]',
  subtotal numeric default 0,
  discount numeric default 0,
  promo text,
  total numeric not null,
  status text not null default 'placed',
  payment text not null default 'COD',
  created_at timestamptz default now()
);

create table if not exists newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- ---------- Row Level Security ----------
alter table products enable row level security;
alter table orders enable row level security;
alter table newsletter enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select to anon using (true);

drop policy if exists "admin all products" on products;
create policy "admin all products" on products
  for all to authenticated using (true) with check (true);

drop policy if exists "anon insert orders" on orders;
create policy "anon insert orders" on orders
  for insert to anon with check (true);

drop policy if exists "admin all orders" on orders;
create policy "admin all orders" on orders
  for all to authenticated using (true) with check (true);

drop policy if exists "anon insert newsletter" on newsletter;
create policy "anon insert newsletter" on newsletter
  for insert to anon with check (true);

drop policy if exists "admin read newsletter" on newsletter;
create policy "admin read newsletter" on newsletter
  for select to authenticated using (true);

-- ---------- Track-order lookup (customers can fetch ONLY their own order) ----------
create or replace function get_order_by_number(p_number text)
returns setof orders
language sql
security definer
set search_path = public
as $$
  select * from orders where number = p_number limit 1;
$$;

grant execute on function get_order_by_number(text) to anon;

-- ---------- Seed products ----------
insert into products (id, name, price, category, stock, image, images, rating, reviews, badge, description) values
(1, 'Luxury Watch', 3999.99, 'watches', 4,
 'https://images.unsplash.com/photo-1670177257750-9b47927f68eb?q=80&w=800&auto=format&fit=crop',
 array['https://images.unsplash.com/photo-1670177257750-9b47927f68eb?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop'],
 4.8, 124, 'Bestseller',
 'A timeless statement piece with precision quartz movement, sapphire-coated glass and a genuine leather strap. Water-resistant and crafted to be worn for decades.'),
(2, 'Designer Handbag', 2299.99, 'bags', 7,
 'https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=500&auto=format&fit=crop&q=60',
 array['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?w=900&auto=format&fit=crop&q=60',
       'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=900&auto=format&fit=crop'],
 4.9, 89, 'New',
 'Crafted from premium vegan leather with gold-tone hardware and a suede-soft interior. Spacious, structured, and effortlessly elegant — from workdays to evenings.'),
(3, 'Premium Sunglasses', 1399.99, 'accessories', 12,
 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
 array['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=900&auto=format&fit=crop'],
 4.7, 203, '',
 'Polarized UV400 lenses set in a hand-finished acetate frame. A classic silhouette with all-day comfort and unmistakable presence.'),
(4, 'Elegant Necklace', 1799.99, 'jewelry', 2,
 'https://images.unsplash.com/photo-1721103418218-416182aca079?w=800&auto=format&fit=crop',
 array['https://images.unsplash.com/photo-1721103418218-416182aca079?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=900&auto=format&fit=crop'],
 4.9, 67, 'Limited',
 'An 18k gold-plated pendant on a delicate chain, hand-polished for a lasting shine. Arrives in our signature gift box — ready for special moments.'),
(5, 'Silk Scarf', 1199.99, 'accessories', 15,
 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=900&auto=format&fit=crop',
 array['https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop',
       'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=900&auto=format&fit=crop'],
 4.6, 158, '',
 '100% mulberry silk with hand-rolled edges and an exclusive print. Drapes beautifully and elevates any outfit, season after season.'),
(6, 'Leather Belt', 1149.99, 'accessories', 9,
 'https://images.unsplash.com/photo-1711443982852-b3df5c563448?q=80&w=900&auto=format&fit=crop',
 array['https://images.unsplash.com/photo-1711443982852-b3df5c563448?q=80&w=900&auto=format&fit=crop',
       'https://images.pexels.com/photos/31367058/pexels-photo-31367058/free-photo-of-elegant-men-s-leather-belt-with-buckles.jpeg?auto=compress&cs=tinysrgb&w=900',
       'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=900&auto=format&fit=crop'],
 4.7, 92, '',
 'Full-grain leather with a brushed metal buckle. Cut, dyed and stitched by hand for a perfect finish that ages gracefully.')
on conflict (id) do update set
  name = excluded.name, price = excluded.price, category = excluded.category,
  stock = excluded.stock, image = excluded.image, images = excluded.images,
  rating = excluded.rating, reviews = excluded.reviews, badge = excluded.badge,
  description = excluded.description;
