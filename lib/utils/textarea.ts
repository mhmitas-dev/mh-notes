/**
 * Calculates the optimal height for a textarea based on its content
 */
export function calculateTextareaHeight(
  element: HTMLTextAreaElement,
  minHeight = 120,
  maxHeight = 400,
  padding = 16,
): number {
  // Create a temporary element to measure text height
  const temp = document.createElement("div")
  temp.style.position = "absolute"
  temp.style.visibility = "hidden"
  temp.style.height = "auto"
  temp.style.width = `${element.clientWidth}px`
  temp.style.fontSize = window.getComputedStyle(element).fontSize
  temp.style.fontFamily = window.getComputedStyle(element).fontFamily
  temp.style.lineHeight = window.getComputedStyle(element).lineHeight
  temp.style.padding = window.getComputedStyle(element).padding
  temp.style.border = window.getComputedStyle(element).border
  temp.style.boxSizing = window.getComputedStyle(element).boxSizing
  temp.style.whiteSpace = "pre-wrap"
  temp.style.wordWrap = "break-word"

  // Set the content
  temp.textContent = element.value || element.placeholder

  // Add to DOM to measure
  document.body.appendChild(temp)
  const height = temp.scrollHeight
  document.body.removeChild(temp)

  return Math.min(Math.max(height + padding, minHeight), maxHeight)
}

/**
 * Smoothly animates textarea height changes
 */
export function animateTextareaHeight(element: HTMLTextAreaElement, targetHeight: number, duration = 150): void {
  const startHeight = element.offsetHeight
  const heightDiff = targetHeight - startHeight
  const startTime = performance.now()

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Use easeOutQuart easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentHeight = startHeight + heightDiff * easeOutQuart

    element.style.height = `${currentHeight}px`

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}
