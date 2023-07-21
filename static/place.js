const script = document.createElement('script')
const code = `
const xLimits = [0, 1499]
const yLimits = [0, 999]

const embed = document.querySelector('garlic-bread-embed')

const canvas = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-canvas').shadowRoot.querySelector('canvas')
const statusPill = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-status-pill')
const colorPicker = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-color-picker')

const initialState = {
  pixel: {
    x: 1275, y: 242
  },
  direction: 1, // right
}

let currentState = initialState

const mutationObserver = new MutationObserver((records, observer) => {
  if (statusPill.getAttribute('next-tile-available-in') === '0') {
    embed.selectPixel(currentState.pixel)
    colorPicker.selectColor(19)
    colorPicker.confirmPixel()
    currentState = chooseNextState(currentState)
    console.log('sent pixel')
  } else {
    console.log('Not ready yet')
  }
})

mutationObserver.observe(statusPill, { attributes: true })

function chooseNextState(currentState) {
  const pixel = calculateNextPixel(currentState.pixel, currentState.direction)
  return {
    pixel,
    direction: calculateNextDirection(direction, pixel),
  }
}

function calculateNextPixel(pixel, direction) {
  switch (direction) {
    case 0: // up
      return {
        x: clampX(pixel.x - 1),
        y: clampY(pixel.y),
      }
    case 1: // right
      return {
        x: clampX(pixel.x),
        y: clampY(pixel.y + 1),
      }
    case 2: // down
      return {
        x: clampX(pixel.x + 1),
        y: clampY(pixel.y),
      }
    case 3: // left
      return {
        x: clampX(pixel.x),
        y: clampY(pixel.y - 1),
      }
  }
}

function calculateNextDirection(currentDirection, nextPixel) {
  const direction = [-1, 0, 1][Math.floor(Math.random() * 4)]

  const newDirection = currentDirection + direction
  if (newDirection < 0) {
    return 4 + newDirection
  } else {
    return newDirection % 4
  }
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val))
}

function clampX(x) {
  return clamp(x, xLimits[0], xLimits[1])
}

function clampY(y) {
  return clamp(y, yLimits[0], yLimits[1])
}

console.log(embed, canvas, statusPill, colorPicker)
`

script.appendChild(document.createTextNode(code))
document.head.appendChild(script)
