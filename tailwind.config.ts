import type {Config} from 'tailwindcss'

export default <Partial<Config>>{
    theme:{
        extend: {
            colors: {
                danger: '#ff0000',
                // primary: '#'
            },
            keyframes: {
                pulseOpacity: {
                  '0%': { opacity: '0.5' },
                  '50%': { opacity: '1' },
                  '100%': { opacity: '0.5' },
                },
              },
              animation: {
                pulseOpacity: 'pulseOpacity 1s infinite',
              },
        }
    }
}
