import Hero from '../components/sections/Hero'
import FeaturedWork from '../components/sections/home/FeaturedWork'
import WhatIDo from '../components/sections/home/WhatIDo'
import ExperienceSnapshot from '../components/sections/home/ExperienceSnapshot'
import Philosophy from '../components/sections/home/Philosophy'
import HomeCTA from '../components/sections/home/HomeCTA'
import ZoneTransition from '../components/ui/ZoneTransition'

export default function Home() {
  return (
    <>
      <Hero />
      <ZoneTransition variant="shore-to-shallow" />
      <FeaturedWork />
      <ZoneTransition variant="shallow-to-deep" />
      <WhatIDo />
      <ExperienceSnapshot />
      <Philosophy />
      <ZoneTransition variant="surface-to-light" />
      <HomeCTA />
    </>
  )
}
