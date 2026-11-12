import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // 로컬 개발: /api 요청을 백엔드로 프록시해서 배포 환경(same-origin)과 같은 경로로 호출한다.
  // 기본은 로컬 Spring(localhost:8080), 다른 서버를 쓰려면 .env.local 에 DEV_API_PROXY_TARGET 지정
  const apiTarget = env.DEV_API_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
