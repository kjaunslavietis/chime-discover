/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageSampleTranscriptionsBucketName = process.env.STORAGE_SAMPLETRANSCRIPTIONS_BUCKETNAME

Amplify Params - DO NOT EDIT */

exports.handler = async (event) => {
    let base64 = event.arguments.base64;
    let blob = await fetch(base64).then(res => res.blob());

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(blob),
    };
    return response;
};
