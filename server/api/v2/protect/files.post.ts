import { S3 } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
    const data = await readMultipartFormData(event)
    const accessKeyId = useRuntimeConfig().r2AccessKey
    const secretAccessKey = useRuntimeConfig().r2SecretKey
    const bucketName = useRuntimeConfig().r2Bucket
    const endpoint = useRuntimeConfig().r2Endpoint

    const authorizationHeader = event.node.req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1]
    
    const s3 = new S3({
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        region: 'auto',
        endpoint,
    })
    

    if (data?.length) {
        
        const id = await $fetch('/api/v2/public/verify', {
            headers: {
                Authorization: `Bearer ${token}`
            }, method: 'post',
        })
        
        if(id.status == 'fail') {
            event.node.res.statusCode = 400
            return {status: 'fail', message: 'you must login to upload file'}
        }

        // @ts-ignore
        const id_owner = id.data._id
        const file = data[0].data
        const prefix = generateName()
        const name = prefix+data[0].filename?.replaceAll(' ','-')
        const type = name.split('.').pop()

        const size = file.length
        
        if (size > 1024 * 1024 * 10) {
            return { message: `max 10mb, you have upload file with size ${(file.length / 1024 ** 2).toFixed(2)}mb` }
        }

        try {
            
            await s3.putObject({
                Bucket: bucketName,
                Key: name, // Use the original file name
                Body: file,
                ContentType: type
            })
            const link = `https://pub-042cd08660454da9bd23468fc74cf82f.r2.dev/${name}`

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
