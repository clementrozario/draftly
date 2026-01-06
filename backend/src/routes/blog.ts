import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from 'hono/jwt'
import { Hono } from "hono";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>()

blogRouter.use("/*", async (c, next) => {
    const jwt = c.req.header("authorization");
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const payload = await verify(jwt, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401)
        return c.json({
            error: 'unauthorized'
        })
    }
    c.set('userId', payload.id as string);
    await next()
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json()
    const authorId = c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId
            }
        })
        return c.json({
            id: blog.id
        })
    } catch (e) {
        c.status(411)
        return c.json({ error: 'error while creating blog' })
    }
})


blogRouter.put('/', async (c) => {
    const body = await c.req.json()
    const userId = c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    try {
        const existingBlog = await prisma.post.findFirst({
            where: { id: body.id }
        })
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

blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id
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
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,

    }).$extends(withAccelerate())
    const blogs = await prisma.post.findMany()

    return c.json({
        blogs
    })
})