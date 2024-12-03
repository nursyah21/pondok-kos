import { S3 } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {    
    const data = await readMultipartFormData(event)
    const accessKeyId = useRuntimeConfig().r2AccessKey
    const secretAccessKey = useRuntimeConfig().r2SecretKey
    const bucketName = useRuntimeConfig().r2Bucket
    const endpoint = useRuntimeConfig().r2Endpoint
    const publicPath = useRuntimeConfig().r2PublicPath

    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    
    const s3 = new S3({
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        region: 'auto',
        endpoint,
        forcePathStyle: true
    })
    console.log({endpoint, publicPath,accessKeyId})
    console.log(process.env)

    if (data?.length) {
        const id = await $fetch('/api/auth/verify', {
            headers: {
                Authorization: `Bearer ${token}`
            }, method: 'get',
        })
        
        if(id.status == 'fail') {
            throw new Error('you must login to upload file')
        }

        // @ts-ignore
        const id_owner = id.data._id
        const file = data[0].data
        const prefix = generateName()
        const name = prefix+data[0].filename?.replaceAll(' ','-')
        const type = data[0].type

        const size = file.length
        
        if (size > 1024 * 1024 * 2) {    
            throw new Error(`max 2mb, you have upload file with size ${(file.length / 1024 ** 2).toFixed(2)}mb`)        
        }

        try {
            
            await s3.putObject({                
                Bucket: bucketName,
                Key: name, // Use the original file name
                Body: file,
                ContentType: type
            })
            
            const link = `${publicPath}/${name}`            

            await Files.create({ name, type, link, id_owner, size })            

            //  delete previos data
            let status = 'upload data success'
            if(data[1] && data[1].name == 'link'){
                const resetFile = data[1].data.toString()
                const key = resetFile.split('/').pop()
                await s3.deleteObject({Bucket: bucketName, Key: key})
                const res = await Files.findOneAndDelete({link: resetFile})
                if(res){
                    status = 'upload data and delete previous data success'
                }
            }

            return { message: link, size, status }
        } catch (error) {
            event.node.res.statusCode = 400
            console.error('Error uploading file:' + error)
            return { message: 'Failed to upload file.', error }
        }

    }

    return { status: 'fail' }
})
