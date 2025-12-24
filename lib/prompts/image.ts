export const IMAGE_STYLES = {
  workout: "realistic, 8k, highly detailed, professional photography, cinematic lighting, gym setting, fitness",
  meal: "gourmet food photography, 8k, high resolution, delicious, soft lighting, 50mm lens",
}

export function generateImagePrompt(subject: string, type: "workout" | "meal"): string {
  const base = type === "workout" ? IMAGE_STYLES.workout : IMAGE_STYLES.meal;
  return \`\${subject}, \${base}, no text, no watermark\`;
}
