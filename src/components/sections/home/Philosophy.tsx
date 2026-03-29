import { useRevealOnScroll } from '../../../hooks/useIntersectionObserver'

export default function Philosophy() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="philosophy" id="philosophy">
      <div
        ref={ref}
        className={`section-content philosophy-content${isVisible ? ' visible' : ''}`}
      >
        <p className="philosophy-quote">Great design is not loud.</p>
        <p className="philosophy-sub">
          It doesn&apos;t demand attention — it earns trust.
        </p>
        <p className="philosophy-body">
          I believe in reducing friction, simplifying complexity, and designing
          systems that feel effortless.
        </p>
      </div>
    </section>
  )
}
