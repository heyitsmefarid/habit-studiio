import { Page } from '../components/Page'
import { Hero } from '../sections/Hero'
import { Anatomy, Collections, FlatlayBand, LookbookTeaser, Manifesto, Professions, ShadeFinder } from '../sections/HomeSections'

export default function Home() {
  return (
    <Page title="Home">
      <Hero />
      <Professions />
      <Manifesto />
      <Anatomy />
      <ShadeFinder />
      <Collections />
      <LookbookTeaser />
      <FlatlayBand />
    </Page>
  )
}
