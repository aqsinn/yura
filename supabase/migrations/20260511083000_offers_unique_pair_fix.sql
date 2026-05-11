-- Previous unique index on (project_id, receiver_id) blocked multiple join requests
-- to the same owner. Replace it with sender+receiver scoped uniqueness.

drop index if exists public.uq_offers_project_receiver;

create unique index if not exists uq_offers_project_sender_receiver
  on public.offers(project_id, sender_id, receiver_id);
