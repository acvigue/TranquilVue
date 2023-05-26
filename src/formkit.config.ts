// formkit.config.ts
import { type DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import theme from '@/formkit.theme'
import proPlugin from '@/formkit.pro'

const config: DefaultConfigOptions = {
  config: {
    classes: generateClasses(theme)
  },
  plugins: [proPlugin]
}

export default config
