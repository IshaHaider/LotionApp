# add your get-notes function here
# needs to retrieve the notes from DynamoDB

# boto3 is the aws sdk for python - to interact w/ aws services through this python function
import boto3
import json
import urllib.parse
import urllib.request
from boto3.dynamodb.conditions import Key, Attr

# Create a DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("lotion-30147402")  # create table object


def handler(event: any, context: any):
    # # backend authentication check
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

    try:
        email = event['queryStringParameters']['email']
        response = table.query(KeyConditionExpression=Key('email').eq(email))

        if response['Count'] == 0:
            response = {
                "statusCode": 200,
                "body": json.dumps({
                    'message': "Success",
                    'data': []
                })
            }
            return response
        response = {
            "statusCode": 200,
            "body": json.dumps({
                'message': "Success",
                'data': response['Items']
            })
        }
        return response

    except Exception as e:
        response = {
            "statusCode": 404,
            "body": json.dumps(
                {
                    'message': "Its not working"
                }
            )
        }
        return response
