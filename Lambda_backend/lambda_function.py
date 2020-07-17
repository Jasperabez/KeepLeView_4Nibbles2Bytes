from dynamodb_accesor_rec import GetMission, VolunteerAcceptMission, VolunteerCompleteMission, CreateNewMission, GetBeneficiary
from lambda_tooling import JsonPacker
import re
import json

volunteer_id_pattern = re.compile("^[V]-[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$")
beneficiary_id_pattern = re.compile("^[B]-[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$")
mission_id_pattern = re.compile("^[M]-[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$")


def lambda_handler(event, context):
    print(event)
    rest_payload = event
    rest_http_method =  rest_payload['httpMethod']
    try:
        SelectedHandler = valid_http_method[rest_http_method]
        rest_payload.pop('httpMethod')
        return_payload = SelectedHandler(rest_payload,context)
    except KeyError:
        return_payload = JsonPacker(400,{"message":"Invalid Path : failed at Lambda handler"})    
    return return_payload

def GetMethodHandler(event,context):
    req_path =  str(event['path'])
    req_path_split = req_path.split('/')[1:]
    try:
        SelectedHandler = valid_GET_path_func[req_path_split[0]]
        event.pop('path')
        return_payload = SelectedHandler(event,context,req_path_split)
    except KeyError:
        return_payload = JsonPacker(400,{"message":"Invalid Path : failed at Get Method Handler"})
    return return_payload

def PostMethodHandler(event,context):
    req_path =  str(event['path'])
    req_path_split = req_path.split('/')[1:]
    try:
        SelectedHandler = valid_POST_path_func[req_path_split[0]]
        event.pop('path')
        return_payload = SelectedHandler(event,context,req_path_split)
    except KeyError:
        return_payload = JsonPacker(400,{"message":"Invalid Path : failed at Get Method Handler"})
    return return_payload

def PatchMethodHandler(event,context):
    req_path =  str(event['path'])
    req_path_split = req_path.split('/')[1:]
    try:
        SelectedHandler = valid_PATCH_path_fuc[req_path_split[0]]
        event.pop('path')
        return_payload = SelectedHandler(event,context,req_path_split)
    except KeyError:
        return_payload = JsonPacker(400,{"message":"Invalid Path : failed at Patch Method Handler"})
    return return_payload

def GetBeneficiaryHandler(event,context,req_path_split):
    if beneficiary_id_pattern.match(req_path_split[1]):
        return_payload = JsonPacker(200,GetBeneficiary(req_path_split[1]))
    else:
        return_payload = JsonPacker(400,{"message":"Invalid Path : Failed at Get Beneficiary Handler"})
    return return_payload

def GetMissionHandler(event,context,req_path_split):
    try:
        mission_format = event['queryStringParameters']['formatting']
        if mission_format not in ('brief','detailed'):
            mission_format = 'brief'
    except (KeyError, TypeError):
        mission_format = 'brief'
    try:
        mission_status = event['queryStringParameters']['status']
        if mission_status not in ('ongoing','completed'):
            mission_status = 'ongoing'
    except (KeyError, TypeError):
        mission_status = 'ongoing'
    if req_path_split[1] == 'allNotTaken':
        return_payload = JsonPacker(200,GetMission(req_path_split[1],"category",mission_format))
    elif mission_id_pattern.match(req_path_split[1]):
        return_payload = JsonPacker(200,GetMission(req_path_split[1],"MissionId",mission_format))
    elif  volunteer_id_pattern.match(req_path_split[1]):
        return_payload = JsonPacker(200,GetMission(req_path_split[1],"VolunteerId",mission_format,mission_status))
    else:
        return_payload = JsonPacker(400,{"message":"Invalid Path : Failed at Get Mission Handler"})
    return return_payload

def PostMissionHandler(event,context,req_path_split):
    event['body'] = json.loads(event['body'])
    if req_path_split[1] == 'create':
        if beneficiary_id_pattern.match(event['body']['BeneficiaryId']):
            return_payload = CreateNewMission(event['body']['BeneficiaryId'])
        else:
            return_payload = JsonPacker(400,{"message":"Invalid Payload : BeneficiaryId does not exist (pattern)"})
    else:
        return_payload =  JsonPacker(400,{"message":"Invalid Path : Failed at Post Mission Handler"})
    return return_payload

def PostFoodHandler(event,context):
    return  JsonPacker(400,{"message":"Invalid Path : Failed at Post Food Handler"})

def PatchMissionHandler(event,context,req_path_split):
    event['body'] = json.loads(event['body'])
    if mission_id_pattern.match(req_path_split[1]):
        try:
            if volunteer_id_pattern.match(event['body']['VolunteerId']):
                if event['body']['PatchType'] == 'AcceptMission':
                    return_payload = VolunteerAcceptMission(req_path_split[1],event['body']['VolunteerId'])
                elif event['body']['PatchType'] == 'CompleteMission':
                    return_payload = VolunteerCompleteMission(req_path_split[1],event['body']['VolunteerId'])
            else:
                return_payload = JsonPacker(400,{"message":"Invalid Payload; VolunteerId does not exist"})
        except KeyError:
            return_payload = JsonPacker(400,{"message":"Invalid Payload; PatchType not included"})
    else:
        return_payload = JsonPacker(400,{"message":"Invalid Path : Failed at Patch Mission Handler"})
    return return_payload


valid_http_method = {"GET":GetMethodHandler, "POST":PostMethodHandler, "PATCH":PatchMethodHandler}
valid_GET_path_func = {"mission":GetMissionHandler,"beneficiary":GetBeneficiaryHandler}
valid_POST_path_func = {"mission":PostMissionHandler,"food":PostFoodHandler}
valid_PATCH_path_fuc = {"mission":PatchMissionHandler}

