import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>()

blogRouter.use("/*", async (c, next) => {
    // extract userid
    // pass it down to the route handler
    next()
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
    
        }).$extends(withAccelerate())
        try {
            const blog = await prisma.post.create({
                data: {
                    title: body.title,
                    content: body.content,
                    authorId: '1'
                }
            })
            return c.json({
                id:blog.id
            })
        } catch (e) {
            c.status(411)
            return c.json({ error: 'error while creating blog' })
        }
    })


blogRouter.put('/', async(c) => {
        const body = await c.req.json()
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,

        }).$extends(withAccelerate())
        try {
            const blog = await prisma.post.update({
                where: {
                    id: body.id
                },
                data: {
                    title: body.title,
                    content: body.content
                }
            })
            return c.json({
                id: blog.id
            })
        } catch (e) {
            c.status(411)
            return c.json({ error: 'error while updating blog' })
        }
    })

blogRouter.get('/', async (c) => {
        const body = await c.req.json()
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,

        }).$extends(withAccelerate())
        try {
            const blog = await prisma.post.findFirst({
                where: {
                    id: body.id
                },
            })
            return c.json({
                blog
            });
        } catch (e) {
            c.status(411)
            return c.json({ error: 'error while fetching blog posts' })
        }
    })

// todo: pagination
blogRouter.get('/bulk', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    const blogs = prisma.post.findMany()

    return c.json({
        blogs
    })
})