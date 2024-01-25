export interface LanguageOption {
  id: number,
  name: string,
  label: string,
  value: string
}

export const languageOptions: LanguageOption[] = [
    {
      id: 91,
      name: "Java (JDK 17.0.6)",
      label: "Java (JDK 17.0.6)",
      value: "java",
    },
    {
      id: 51,
      name: "C# (Mono 6.6.0.161)",
      label: "C# (Mono 6.6.0.161)",
      value: "csharp",
    },
]