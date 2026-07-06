import { onRequest as __api___route___ts_onRequest } from "C:\\Users\\Adnan\\Desktop\\baby_pen_house\\functions\\api\\[[route]].ts"
import { onRequest as __product___slug___ts_onRequest } from "C:\\Users\\Adnan\\Desktop\\baby_pen_house\\functions\\product\\[[slug]].ts"

export const routes = [
    {
      routePath: "/api/:route*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___route___ts_onRequest],
    },
  {
      routePath: "/product/:slug*",
      mountPath: "/product",
      method: "",
      middlewares: [],
      modules: [__product___slug___ts_onRequest],
    },
  ]