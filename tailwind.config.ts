import type {Config} from 'tailwindcss'

export default <Partial<Config>>{
    theme:{
        extend: {
            colors: {
                danger: {
                     600: '#ff0000'
                }
            }
        }
    }
}