# add your save-note function here
# needs to add the new note - or update existing note - into DynamoDB

# boto3 is the aws sdk for python - to interact w/ aws services through this python function
import boto3
import json
import urllib.parse
import urllib.request

# Create a DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30147402")  # create table object


def handler(event: any, context: any):
    # backend authentication check
    # access_token = event['headers']['authentication']
    # validation_url = f'https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}'
    # response = urllib.request.urlopen(validation_url)

    # # Parse the response as JSON
    # token_info = json.loads(response.read())

    # # Check if the token is valid
    # if 'error' in token_info:
    #     return {
    #         'statusCode': 401,
    #         'body': 'Authentication error'
    #     }

    # save note to DynamoDB
    body = json.loads(event['body'])

    try:
        table.put_item(Item=body)
        return {
            "isBase64Encoded": "false",
            'statusCode': 200,
            'body': json.dumps(body)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
