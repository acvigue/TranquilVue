// formkit.config.ts
import { type DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import theme from './formkit.theme'

const config: DefaultConfigOptions = {
  config: {
    classes: generateClasses(theme)
  }
}

export default config
