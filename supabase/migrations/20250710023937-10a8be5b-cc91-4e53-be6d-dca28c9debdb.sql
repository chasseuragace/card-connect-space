-- Insert sample companies only (user profiles will be created when real users sign up)
INSERT INTO public.companies (id, name, location, logo_url, theme_settings) VALUES 
(
  '123e4567-e89b-12d3-a456-426614174000',
  'TechCorp Solutions',
  'San Francisco, CA',
  'https://example.com/techcorp-logo.png',
  '{"primary_color": "#2563eb", "logo_position": "center"}'::jsonb
),
(
  '123e4567-e89b-12d3-a456-426614174001',
  'Innovation Labs',
  'New York, NY', 
  'https://example.com/innovation-logo.png',
  '{"primary_color": "#7c3aed", "logo_position": "left"}'::jsonb
),
(
  '123e4567-e89b-12d3-a456-426614174002',
  'Global Enterprises',
  'London, UK',
  'https://example.com/global-logo.png',
  '{"primary_color": "#059669", "logo_position": "center"}'::jsonb
);

-- The user profiles, teams, calendar events, bookings, and feedback will be populated
-- when real users sign up and use the application