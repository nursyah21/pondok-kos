import type {Config} from 'tailwindcss'

export default <Partial<Config>>{
    theme:{
        extend: {
            colors: {
                danger: '#ff0000',
                // primary: '#'
            }
        }
    }
}