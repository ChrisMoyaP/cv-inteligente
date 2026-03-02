const sanitize = (value: string): string =>
  value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\s]/g, "")

const normalizeSeparators = (value: string): string => value.replace(/,/g, " ")

const extractWords = (value: string): string[] =>
  value.trim().split(/\s+/).filter(Boolean)

const limitToTwoWords = (words: string[]): string => words.slice(0, 2).join(" ")

export const buildHabilidad = (value: string) => {
  const clean = sanitize(value)
  const normalized = normalizeSeparators(clean)
  const words = extractWords(normalized)
  const uniqueWords = [...new Set(words)]

  return {
    limpia: normalized,
    palabras: uniqueWords,
    limitada: limitToTwoWords(uniqueWords),
  }
}
