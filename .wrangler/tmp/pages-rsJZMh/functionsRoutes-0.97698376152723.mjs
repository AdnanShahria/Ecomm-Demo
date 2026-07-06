import { onRequest as __api_app_ts_onRequest } from "C:\\Users\\Adnan\\Desktop\\Projects\\baby_pen_house\\functions\\api\\app.ts"
import { onRequest as __api___route___ts_onRequest } from "C:\\Users\\Adnan\\Desktop\\Projects\\baby_pen_house\\functions\\api\\[[route]].ts"
import { onRequest as __product___slug___ts_onRequest } from "C:\\Users\\Adnan\\Desktop\\Projects\\baby_pen_house\\functions\\product\\[[slug]].ts"

export const routes = [
    {
      routePath: "/api/app",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_app_ts_onRequest],
    },
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