import { useRevealOnScroll } from '../../hooks/useIntersectionObserver'
import SkillPebble from '../ui/SkillPebble'
import { skills } from '../../data/skills'

export default function About() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="about" id="about">
      <div
        ref={ref}
        className={`section-content about-content${isVisible ? ' visible' : ''}`}
      >
        <div className="about-visual">
          <div className="about-image-frame" />
          <div className="about-decoration" />
        </div>

        <div className="about-text">
          <h3>A Quiet Cove</h3>
          <h2>I design experiences that breathe</h2>
          <p>
            I&apos;m a UX designer who believes the best interfaces feel like nature — intuitive,
            unhurried, and effortlessly beautiful. With 8 years of crafting digital experiences,
            I bring a philosophy of calm to every pixel.
          </p>
          <p>
            When I&apos;m not designing, you&apos;ll find me freediving, photographing tide
            pools, or listening to the rain.
          </p>
          <div className="about-skills">
            {skills.map(skill => (
              <SkillPebble key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
