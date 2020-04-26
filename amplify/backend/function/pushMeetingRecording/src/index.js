/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageSampleTranscriptionsBucketName = process.env.STORAGE_SAMPLETRANSCRIPTIONS_BUCKETNAME

Amplify Params - DO NOT EDIT */

const webmToMp3Converter = require('./W3Module')

exports.handler = async (event) => {
    let base64WebM = event.arguments.base64;
    let blobWebM = await fetch(base64WebM).then(res => res.blob());

    let blobMP3 = await webmToMp3Converter.convertWebmToMP3(blobWebM);
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(blobMP3),
    };
    return response;
};
