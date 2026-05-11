import CreateProjectForm from './CreateProjectForm'

export default async function CreateProject({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <CreateProjectForm initialError={error} />
}