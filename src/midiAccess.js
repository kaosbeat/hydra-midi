// @ts-check

import { ccValues, playingNotes } from './state'
import { envelopes } from './transforms/adsr'
import { MidiAccess } from './lib/MidiAccess'
import { logMidiMessage, showInputs } from './gui'

export const midiAccess = new MidiAccess()

/**
 * @param {number|string} value
 * @param {number|string} channel
 * @param {number|string} input
 * @returns
 */
export const getMidiId = (value, channel = 0, input) => {
  if (input !== undefined) {
    return `${value}/${channel}/${input ?? midiAccess.getInputId(0)}`
  }
}

/**
 * @param {number} value
 * @param {number} channel
 * @param {string} input
 * @returns
 */
export const getMidiWildcards = (value, channel, input) => [
  getMidiId('*', '*', '*'),
  getMidiId(value, '*', '*'),
  getMidiId('*', channel, '*'),
  getMidiId('*', '*', input),
  getMidiId(value, channel, '*'),
  getMidiId('*', channel, input),
  getMidiId(value, '*', input)
]

export const start = async () => {
  await midiAccess.start()
  midiAccess.access.addEventListener('statechange', () => {
    showInputs(midiAccess.access.inputs)
  })
}

export const pause = midiAccess.pause

midiAccess.on(MidiAccess.TypeControlChange, ({ data, channel, input }) => {
  const [index, value] = data
  const ccId = getMidiId(index, channel, input.id)
  const normalizedValue = value / 127

  ccValues[ccId] = normalizedValue
  getMidiWildcards(index, channel, input.id).forEach(
    wildcard => (ccValues[wildcard] = normalizedValue)
  )

  logMidiMessage({ input, type: 'cc', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOn, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.add(noteId)
  envelopes[noteId]?.trigger()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.add(wildcard)
    envelopes[wildcard]?.trigger()
  })

  logMidiMessage({ input, type: 'on', channel, data })
})

midiAccess.on(MidiAccess.TypeNoteOff, ({ data, channel, input }) => {
  const [note] = data
  const noteId = getMidiId(note, channel, input.id)
  playingNotes.delete(noteId)
  envelopes[noteId]?.stop()

  getMidiWildcards(note, channel, input.id).forEach(wildcard => {
    playingNotes.delete(wildcard)
    envelopes[wildcard]?.stop()
  })

  logMidiMessage({ input, type: 'off', channel, data })
})

midiAccess.on(MidiAccess.TypePitchBend, ({ input, data, channel }) => {
  const value = ((data[1] << 7) + data[0] - 8192) / 8192
  const displayValue = +value.toFixed(2)
  logMidiMessage({ input, type: 'bnd', channel, data: [displayValue] })
})

midiAccess.on(MidiAccess.TypeAfterTouchChannel, ({ input, data, channel }) => {
  logMidiMessage({ input, type: 'aft', channel, data })
})

midiAccess.on(MidiAccess.TypeAfterTouchPoly, ({ input, data, channel }) => {
  logMidiMessage({ input, type: 'aft', channel, data })
})
