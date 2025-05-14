export default function onNextGesture(cb: () => void) {
  const wrappedCb = () => {
    cb()
    document.removeEventListener('click', wrappedCb)
  }

  document.addEventListener('click', wrappedCb)
}