/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageSampleTranscriptionsBucketName = process.env.STORAGE_SAMPLETRANSCRIPTIONS_BUCKETNAME

Amplify Params - DO NOT EDIT */
const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');
const transcribeservice = new AWS.TranscribeService();
const comprehend = new AWS.Comprehend();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log(JSON.stringify(event));
    
    for(const record of event.Records) {
        if(record.s3.object.key.startsWith('public/audioin')) {
            let fileName = record.s3.object.key.split('/')[2];

            let params = {
                LanguageCode: 'en-US',
                Media: { /* required */
                  MediaFileUri: `s3://${record.s3.bucket.name}/${record.s3.object.key}`
                },
                TranscriptionJobName: `${fileName}:${uuid()}`,
                OutputBucketName: record.s3.bucket.name,
                Settings: {}
              };

              try {
                  const result = await transcribeservice.startTranscriptionJob(params).promise();
              } catch(err) {
                  console.log(err);
              }
        } else if(!record.s3.object.key.startsWith('.write_access_check_file.temp')) {
            let s3Params = {
                Bucket: record.s3.bucket.name, 
                Key: record.s3.object.key
               };
            
            let file = await s3.getObject(s3Params).promise();
            let json = JSON.parse(file.Body.toString());

            let transcriptString = "";
            for(let transcript of json.results.transcripts) {
                transcriptString += transcript.transcript + " ";
            }

            if(transcriptString) {
                let comprehendParams = {
                    LanguageCode: 'en', /* required */
                    Text: transcriptString
                };

                let comprehension = await comprehend.detectKeyPhrases(comprehendParams).promise();


                let sortedPhrases = comprehension.KeyPhrases.sort((p1, p2) => {
                    if(p1.Score > p2.Score) {
                        return -1;
                    } else if(p1.Score < p2.Score) {
                        return 1;
                    } else return 0;
                }).map(p => p.Text);

                let topThreePhrases = sortedPhrases.slice(0, 3);

                console.log(JSON.stringify(topThreePhrases));

                let conversationId = record.s3.object.key.split(':')[0];
                console.log(conversationId);
            }
        }

    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Transcription job started!'),
    };
    return response;
};
