export function scrollToSection(selector: string) {
  const target = document.querySelector(selector)
  if (target) target.scrollIntoView({ behavior: 'smooth' })
}
