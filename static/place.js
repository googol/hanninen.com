const script = document.createElement('script')
const code = `
const xLimits = [0, 1499]
const yLimits = [0, 999]
const colors = {
  RED: 2,
  ORANGE: 3,
  YELLOW: 4,
  GREEN: 6,
  BLUE: 13,
  PURPLE: 19,
  BLACK: 27,
  WHITE: 31,
}
const directions = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
}

const embed = document.querySelector('garlic-bread-embed')

const canvas = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-canvas').shadowRoot.querySelector('canvas')
const statusPill = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-status-pill')
const colorPicker = document.querySelector('garlic-bread-embed').shadowRoot.querySelector('garlic-bread-share-container').querySelector('garlic-bread-color-picker')

const initialState = {
  pixel: {
    x: 1224, y: 807
  },
  direction: directions.RIGHT,
}

let currentState = initialState

const mutationObserver = new MutationObserver(() => {
  sendPixel()
})

mutationObserver.observe(statusPill, { attributes: true })

sendPixel()

function sendPixel() {
  if (statusPill.getAttribute('next-tile-available-in') === '0') {
    const color = colors.PURPLE
    embed.selectPixel(currentState.pixel)
    colorPicker.selectColor(color)
    colorPicker.confirmPixel()
    const nextState = chooseNextState(currentState)
    console.log('sent pixel', { currentState, nextState, color })
    currentState = nextState
  }
}

function chooseNextState(currentState) {
  return {
    pixel: calculateNextPixel(currentState.pixel, currentState.direction),
    direction: calculateNextDirection(currentState.direction),
  }
}

function calculateNextPixel(pixel, direction) {
  switch (direction) {
    case directions.UP:
      return {
        x: clampX(pixel.x - 1),
        y: clampY(pixel.y),
      }
    case directions.RIGHT:
      return {
        x: clampX(pixel.x),
        y: clampY(pixel.y + 1),
      }
    case directions.DOWN:
      return {
        x: clampX(pixel.x + 1),
        y: clampY(pixel.y),
      }
    case directions.LEFT:
      return {
        x: clampX(pixel.x),
        y: clampY(pixel.y - 1),
      }
  }
}

function calculateNextDirection(currentDirection) {
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
`

script.appendChild(document.createTextNode(code))
document.head.appendChild(script)
