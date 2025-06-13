import { redirect } from 'next/navigation'

export default function OnlineKatalog({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/kataloglar`)
  return null
}