import withPWA from 'next-pwa'

const nextConfig = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}

export default withPWA({
  ...nextConfig,
  dest: 'build',
})
