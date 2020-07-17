import json
import random
import uuid
import time
from botocore.exceptions import ClientError
import boto3

lambda_client = boto3.client("lambda")
dynamodb_client = boto3.client("dynamodb")

def getRecommendedFoods(BeneficiaryId):
    inputParams = {
        "BeneficiaryId": BeneficiaryId
    }
    response = lambda_client.invoke(
        FunctionName = "(placeholder arn resource)",
        InvocationType = "RequestReponse",
        Payload = json.dumps(inputParams)
    )
    return response['Payload']['FoodName']

def JsonPacker(status_code,body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body)
    }
                            
def MissionProcessor(items,mission_format=None):
    briefAttributes = ['ConciseLocation','MissionType','MissionId']
    reprocessed_items = list()
    for item in items:
        reprocessed_item = dict()
        if mission_format == 'brief':
            for key in briefAttributes:
                reprocessed_item[key] = list(item[key].values())[0]
        else:
            for key in item.keys():
                reprocessed_item[key] = list(item[key].values())[0]
        reprocessed_items.append(reprocessed_item)
    return reprocessed_items
    
def lambda_handler(event, context):
    print(event)
    response = dynamodb_client.query(
                TableName="BeneficiariesTable",
                IndexName="ButtonId-index",
                KeyConditionExpression='ButtonId = :ButtonId',
                ExpressionAttributeValues={
                    ':ButtonId': {'S': event['button_id']}
                }
            )
    processed_response = MissionProcessor(response['Items'],None)
    help_kind_map = {1:"Deliver Food",2:"Need Help; Donate Food"}
    if len(processed_response) > 0:
        MissionId = "M-"+str(uuid.uuid4())
        Mission = {
                    'MissionId':{'S': MissionId},
                    'RequestUnixTime':{'S': str(int(time.time()))},
                    'ConciseLocation':{'S': processed_response[0]['ConciseLocation']},
                    'BeneficiaryId':{'S': processed_response[0]['BeneficiaryId']},
                    'MissionType':{'S': help_kind_map[event['mode']]},
                    'IsTaken':{'BOOL': False},
                    'IsCompleted':{'BOOL': False}
            }
        if event['mode'] == 1:
            Mission.update({"FoodName":{'S': getRecommendedFoods(BeneficiaryId}}),
        response = dynamodb_client.put_item(
            TableName='MissionsTable', 
            Item=Mission
        )
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            return JsonPacker(200,{"message":"Successfully added mission",
                                    "MissionId": MissionId})
        else:
            return JsonPacker(400,{"message":"Database error; alert administrator"})
    else:
        return JsonPacker(400,{"message":"Invalid Payload; ButtonId does not exist (query)"})
