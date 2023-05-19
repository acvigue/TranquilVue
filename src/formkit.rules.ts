import { type FormKitNode } from '@formkit/core'

export const sisbotid = function (node: FormKitNode): boolean {
  const regex = /(pi_|PI_)[0-9a-fA-F]{16}/
  return regex.test(node.value as string)
}

export const macaddress = function (node: FormKitNode): boolean {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  return regex.test(node.value as string)
}
