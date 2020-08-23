/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const load = element => {
  if (element.getAttribute("data-src")) {
    element.src = element.getAttribute("data-src")
  }
}

const isLoaded = element => element.getAttribute("data-loaded") === "true"

const setLoaded = element => element.setAttribute("data-loaded", true)

const pikaLazy = options => {
  let observer
  if (typeof window !== "undefined" && window.IntersectionObserver) {
    observer = new IntersectionObserver(
      (entries, originalObserver) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0 || entry.isIntersecting) {
            originalObserver.unobserve(entry.target)
            if (!isLoaded(entry.target)) {
              load(entry.target)
              setLoaded(entry.target)
            }
          }
        })
      },
      {
        ...options,
        rootMargin: "0px",
        threshold: 0,
      },
    )
  }

  return {
    lazyObserver: () => {
      const eles = document.querySelectorAll(".pika-lazy")
      for (const ele of Array.from(eles)) {
        if (observer) {
          observer.observe(ele)
          continue
        }
        if (isLoaded(ele)) continue

        load(ele)
        setLoaded(ele)
      }
    },
  }
}

export default pikaLazy
