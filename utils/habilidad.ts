export const sanitize = (value: string): string =>
  value.replace(/[^a-zA-ZáéíóúíÁÉÍÓÚñÑ, \s]/g, "")

export const normalizeSeparators = (value: string): string =>
  value.replace(/,/g, " ")

export const extractWords = (value: string): string[] =>
  value.trim().split(/\s+/).filter(Boolean)

export const limitToTwoWords = (words: string[]): string =>
  words.slice(0, 2).join(" ")
