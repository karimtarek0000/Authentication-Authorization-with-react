import type { Product as ProductSchema } from './product'
import type { User as UserSchema } from './user'

declare global {
  interface User extends UserSchema {
    readonly __userInterfaceBrand?: never
  }

  interface Product extends ProductSchema {
    readonly __productInterfaceBrand?: never
  }
}

export {}
