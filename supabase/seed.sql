insert into public.skills (slug, name, category) values
  ('react', 'React', 'engineering'),
  ('nextjs', 'Next.js', 'engineering'),
  ('figma', 'Figma', 'design'),
  ('product-strategy', 'Product Strategy', 'business')
on conflict (slug) do nothing;
