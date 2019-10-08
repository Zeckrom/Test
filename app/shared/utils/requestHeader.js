export const requestHeader = options => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Accept-Language': `en-US`,
    ...options,
  },
})
export const getToken = () => localStorage.getItem('token')
