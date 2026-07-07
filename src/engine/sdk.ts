let currentModel = process.env.ANTHROPIC_MODEL || 'deepseek-v4-pro'

export function setModel(model: string) {
  currentModel = model
}

export function getModel(): string {
  return currentModel
}
