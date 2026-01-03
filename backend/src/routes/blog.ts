import { Hono } from "hono";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>()

blogRouter.post('/', (c) => {
    return c.text('adding blog route')
})

blogRouter.put('/', (c) => {
    return c.text('editing blog!')
})

blogRouter.get('/', (c) => {
    return c.text('getting particular blog!')
})

blogRouter.get('/bulk', (c) => {
    return c.text('Getting all blogs!')
})