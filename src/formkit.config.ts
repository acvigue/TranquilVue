// formkit.config.ts
import { type DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import theme from './formkit.theme'
import {sisbotid, macaddress} from './formkit.rules'

const config: DefaultConfigOptions = {
  config: {
    classes: generateClasses(theme)
  },
  rules: {
    sisbotid,
    macaddress
  }
}

export default config
