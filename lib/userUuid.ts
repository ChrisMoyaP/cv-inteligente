export function getUserUuid(): string {
    const stored = localStorage.getItem("user_uuid")
    if (stored) return stored

    const newUuid = crypto.randomUUID()
    localStorage.setItem("user_uuid", newUuid)
    return newUuid
}
