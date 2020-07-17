import boto3
from botocore.exceptions import ClientError
from lambda_tooling import JsonPacker
import time
import json
import uuid
import random

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

def GetMission(identifier,identifier_type,mission_format="brief",mission_status="ongoing"):
    if identifier_type == 'category':
        if identifier == "allNotTaken":
            response = dynamodb_client.scan(
                TableName='MissionsTable',
                FilterExpression="((IsTaken = :IsTaken OR attribute_not_exists(IsTaken)) AND (IsCompleted = :IsCompleted OR attribute_not_exists(IsCompleted)))",
                ExpressionAttributeValues={
                    ':IsTaken' : {'BOOL': False},
                    ':IsCompleted' : {'BOOL': False}
                }
            )
            return MissionProcessor(response['Items'],mission_format)
    elif identifier_type == 'VolunteerId':
        status_mapping = {"ongoing":False,"completed":True}
        response = dynamodb_client.query(
            TableName="MissionsTable",
            IndexName="VolunteerId-AcceptUnixTime-index",
            FilterExpression="(IsCompleted = :IsCompleted OR attribute_not_exists(IsCompleted))",
            KeyConditionExpression='VolunteerId = :VolunteerId',
            ExpressionAttributeValues={
                ':VolunteerId': {'S': identifier},
                ':IsCompleted': {'BOOL': status_mapping[mission_status]}
            }
        )
        return MissionProcessor(response['Items'],mission_format)
    elif identifier_type == 'MissionId':
        response = dynamodb_client.query(
            TableName="MissionsTable",
            KeyConditionExpression='MissionId = :MissionId',
            ExpressionAttributeValues={
                ':MissionId': {'S': identifier}
            }
        )
        return MissionProcessor(response['Items'],mission_format)

def VolunteerAcceptMission(MissionId,VolunteerId):
    try:
        response = GetMission(MissionId,"MissionId",'detailed')[0]
        response_sort_key = response['RequestUnixTime']
        if response['IsTaken'] or response['IsCompleted']:
            response = JsonPacker(400, {"message":"Failed to assign Mission; had been taken or completed"})
        else:
            response = dynamodb_client.update_item(
            TableName='MissionsTable',
            Key={
                'MissionId': {"S": MissionId},
                'RequestUnixTime': {"S": response_sort_key}
            },
            UpdateExpression="SET IsTaken = :IsTaken, AcceptUnixTime = :AcceptUnixTime, VolunteerId = :VolunteerId",
            ExpressionAttributeValues={
                ':IsTaken': {"BOOL": True},
                ':AcceptUnixTime': {"S": str(int(time.time()))},
                ':VolunteerId': {"S": VolunteerId}
            },
            ReturnValues="UPDATED_NEW")
            if response['Attributes']['VolunteerId']['S'] == VolunteerId and response['Attributes']['IsTaken']['BOOL'] == True:
                return JsonPacker(200,{"message":"Successfully assigned mission"})
            else:
                return JsonPacker(400,{"message":"Database error; alert administrator"})
    except IndexError:
        response = JsonPacker(400,{"message":"Invalid MissionId ; does not exist"})
    return response
    
def VolunteerCompleteMission(MissionId,VolunteerId):
    try:
        response = GetMission(MissionId,"MissionId","detailed")[0]
        response_sort_key = response['RequestUnixTime']
        if (not response['IsTaken']) or response['IsCompleted']:
            response = JsonPacker(400, {"message":"Failed to complete Mission; is not taken or is completed"})
        elif response['VolunteerId'] != VolunteerId:
            response = JsonPacker(400, {"message":"Failed to complete Mission; VolunteerId mismatch"})
        else:
            response = dynamodb_client.update_item(
            TableName='MissionsTable',
            Key={
                'MissionId': {"S": MissionId},
                'RequestUnixTime': {"S": response_sort_key}
            },
            UpdateExpression="SET IsTaken = :IsTaken, IsCompleted = :IsCompleted",
            ExpressionAttributeValues={
                ':IsCompleted': {"BOOL": True},
                ':IsTaken': {"BOOL": False}
            },
            ReturnValues="UPDATED_NEW")
            if response['Attributes']['IsCompleted']['BOOL'] == True:
                return JsonPacker(200,{"message":"Successfully completed mission"})
            else:
                return JsonPacker(400,{"message":"Database error; alert administrator"})
    except IndexError:
        response = JsonPacker(400,{"message":"Invalid MissionId ; does not exist"})
    return response

def CreateNewMission(BeneficiaryId):
    response = dynamodb_client.query(
                TableName="BeneficiariesTable",
                KeyConditionExpression='BeneficiaryId = :BeneficiaryId',
                ExpressionAttributeValues={
                    ':BeneficiaryId': {'S': BeneficiaryId}
                }
            )
    processed_response = MissionProcessor(response['Items'],None)
    if len(processed_response) > 0:
        MissionId = "M-"+str(uuid.uuid4())
        Mission = {
                    'MissionId':{'S': MissionId},
                    'RequestUnixTime':{'S': str(int(time.time()))},
                    'ConciseLocation':{'S': processed_response[0]['ConciseLocation']},
                    'BeneficiaryId':{'S': BeneficiaryId},
                    'MissionType':{'S': "Deliver Food"},
                    'FoodName': {'S': getRecommendedFoods(BeneficiaryId)[0]},
                    'IsTaken':{'BOOL': False},
                    'IsCompleted':{'BOOL': False}
            }
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
        return JsonPacker(400,{"message":"Invalid Payload; BeneficiaryId does not exist (query)"})

def GetBeneficiary(BeneficiaryId):
    response = dynamodb_client.query(
        TableName="BeneficiariesTable",
        KeyConditionExpression='BeneficiaryId = :BeneficiaryId',
        ExpressionAttributeValues={
            ':BeneficiaryId': {'S': BeneficiaryId}
        }
    )
    response = MissionProcessor(response['Items'])
    return response