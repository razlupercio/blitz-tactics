import m from 'mithril'
import Chess from 'chess.js'

import { uciToMove } from '../../utils'

const rows = [8, 7, 6, 5, 4, 3, 2, 1]
const columns = [`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`]
const polarities = [`light`, `dark`]

function getPiece(piece) {
  const className = piece.color + piece.type
  return m(`svg.piece.${className}.${piece.color}`, { viewBox: `0 0 45 45` },
    [
      m(`use`, {
        'xlink:href': `#${className}`,
        width: `100%`,
        height: `100%`
      })
    ]
  )
}

export default class MiniChessboard {
  // options.el          - chessboard element
  // options.fen         - fen string
  // options.initialMove - uci string

  constructor(options = {}) {
    this.el = options.el
    this.cjs = new Chess()
    this.highlights = {}
    if (options.fen) {
      this.render(options.fen)
      if (options.initialMove) {
        setTimeout(() => {
          const { from, to } = this.cjs.move(uciToMove(options.initialMove))
          this.highlightSquare(from, `#fffcdd`)
          this.highlightSquare(to, `#fff79b`)
          this.render(this.cjs.fen())
        }, 1000)
      }
    }
  }

  render(fen) {
    if (fen.split(` `).length === 4) {
      fen += ` 0 1`
    }
    this.renderFen(fen)
  }

  renderFen(fen) {
    if (fen !== this.cjs.fen()) {
      this.cjs.load(fen)
    }
    requestAnimationFrame(() => m.render(this.el, this.virtualSquares()))
  }

  virtualSquares() {
    let i = 0
    const squares = []
    for (let row of rows) {
      for (let col of columns) {
        let id = col + row
        const pieces = []
        const piece = this.cjs.get(id)
        if (piece) {
          pieces.push(getPiece(piece))
        }
        const squareAttrs = {}
        if (this.highlights[id]) {
          squareAttrs.style = this.highlights[id]
        }
        squares.push(m(`div.square.${polarities[i % 2]}`, squareAttrs, pieces))
        i += 1
      }
      i += 1
    }
    return squares
  }

  highlightSquare(id, color) {
    this.highlights[id] = { background: color }
  }
}
