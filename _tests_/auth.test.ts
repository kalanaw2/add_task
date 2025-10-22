import { supabase } from '../lib/utils'

jest.mock('../lib/utils', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  },
}))

describe('Auth service', () => {
  it('logs in user with correct credentials', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: '123', email: 'user@test.com' } },
      error: null,
    })

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@test.com',
      password: '123456',
    })

    expect(error).toBeNull()
    expect(data.user?.email).toBe('user@test.com')
  })

  it('returns error on invalid password', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login' },
    })

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@test.com',
      password: 'wrong',
    })

    expect(data.user).toBeNull()
    expect(error?.message).toBe('Invalid login')
  })
})
