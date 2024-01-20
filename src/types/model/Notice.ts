export interface Notice {
    title: string,
    topic?: string,
    content: string,
    imageUrl?: string,
    data?: Record<string, string>,
    deviceTokens: string[]
}