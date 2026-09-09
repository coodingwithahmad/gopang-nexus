-- Enable realtime for ticket messages
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.ticket_messages;
alter publication supabase_realtime add table public.tickets;
