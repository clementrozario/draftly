import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
  return c.text('signup route!')
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route!')
})

app.post('/api/v1/blog', (c) => {
  return c.text('adding blog route')
})

app.put('/api/v1/blog', (c) => {
  return c.text('editing blog!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('getting particular blog!')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Getting all blogs!')
})

export default app
