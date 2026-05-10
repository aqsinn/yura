-- Prevent duplicate offers for the same project + receiver.
create unique index if not exists uq_offers_project_receiver
  on public.offers(project_id, receiver_id);
