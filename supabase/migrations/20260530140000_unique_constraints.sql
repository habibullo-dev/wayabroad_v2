-- Guard against duplicate rows under concurrent submits.
-- One document version per (application, type, version); one application per (student, program).
create unique index if not exists uniq_documents_app_type_version
  on public.documents (application_id, type, version);

create unique index if not exists uniq_applications_student_program
  on public.applications (student_id, program_id);
