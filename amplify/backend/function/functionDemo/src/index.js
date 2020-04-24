

exports.handler = async (event) => {
    let eventInput = event.input;

    if(!eventInput) {
        return {
            statusCode: 500,
            body: 'u messed up',
            result: 9999
        }
    }

    let result = eventInput * 2;

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
        result: result
    };
    return response;
};
