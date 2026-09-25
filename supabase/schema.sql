create table if not exists users (
  id bigint generated always as identity primary key,
  name text not null,
  phone text unique not null,
  shop_name text,
  address text,
  delivery_address text,
  password text not null,
  role text default 'customer' check (role in ('customer', 'owner')),
  created_at timestamp with time zone default now()
);

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  image text,
  description text,
  price numeric not null check (price >= 0),
  wholesale_price numeric check (wholesale_price >= 0),
  category text,
  stock integer default 0 check (stock >= 0),
  created_at timestamp with time zone default now()
);

create table if not exists deals (
  id bigint generated always as identity primary key,
  title text not null,
  discount integer check (discount between 0 and 100),
  banner text,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  order_group_id text,
  user_id bigint references users(id),
  customer_name text not null,
  customer_phone text not null,
  shop_name text,
  customer_address text not null,
  delivery_address text,
  product_id bigint,
  product_name text not null,
  product_image text,
  product_price numeric not null check (product_price >= 0),
  quantity integer not null check (quantity > 0),
  total_amount numeric not null check (total_amount >= 0),
  order_status text default 'pending' check (order_status in ('pending', 'completed', 'cancelled')),
  customer_location text,
  created_at timestamp with time zone default now()
);

alter table orders add column if not exists order_group_id text;
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists customer_phone text;
alter table orders add column if not exists shop_name text;
alter table orders add column if not exists customer_address text;
alter table orders add column if not exists delivery_address text;
alter table orders add column if not exists product_id bigint;
alter table orders add column if not exists product_name text;
alter table orders add column if not exists product_image text;
alter table orders add column if not exists product_price numeric;
alter table orders add column if not exists quantity integer;
alter table orders add column if not exists order_status text default 'pending';
alter table orders add column if not exists products jsonb;
alter table orders add column if not exists status text;

alter table users enable row level security;
alter table products enable row level security;
alter table deals enable row level security;
alter table orders enable row level security;

create table if not exists store_settings (
  id boolean primary key default true check (id),
  name text not null default 'Malik Idrees Sweet Shop & U.A Trader',
  location text not null default 'Chakki Bazar, Samundri',
  phone text not null default '03104086111',
  updated_at timestamp with time zone default now()
);
alter table store_settings enable row level security;
insert into store_settings (id) values (true) on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;

create policy "public can view products" on products for select using (true);
create policy "public can view deals" on deals for select using (true);
create policy "customers can create orders" on orders for insert with check (auth.uid() is not null or user_id is null);
create policy "customers can view their orders" on orders for select using (user_id is null or user_id::text = auth.uid()::text);
create policy "owners can update orders" on orders for update using (auth.jwt() ->> 'role' = 'owner');
create policy "public can view store settings" on store_settings for select using (true);
create policy "owners can update store settings" on store_settings for update using (auth.jwt() ->> 'role' = 'owner');
create policy "public can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "owners can upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.jwt() ->> 'role' = 'owner');
create policy "owners can delete product images" on storage.objects for delete using (bucket_id = 'product-images' and auth.jwt() ->> 'role' = 'owner');
create index if not exists orders_group_id_idx on orders(order_group_id);
create index if not exists orders_status_idx on orders(order_status);