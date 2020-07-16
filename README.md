# KeepLeView_4Nibbles2Bytes
Democratize food distribution filling stomachs of all

# Code Deployment

**This reposistory only exposes the code used in KeepLeView, automated deployment scripts are not provided due to time limitations**

## Webapp Frontend Deployment

1. Link amplify app Frontend to this reposistory folder called `frontend`

## Webapp Backend Deployment

1. Create tables with the Table Names mentioned in `Lambda_backend/dynamodb_accesor_rec.py` and the Secondary Index
2. Upload code in `Lambda_backend` to a lambda function, and assign it a role with the appropriate permissions (Dynamodb table access)

## IoT Button Deployment

1. Create thing in Aws Iot Core
2. Copy and paste certificates in the Arduino sketch provided in `Esp32_Iot_Button\IoTButton_Arduino_sketch.ino` and upload the code to a Esp32 with appropriate buttons wired up
3. Upload code in `Esp32_Iot_Button/IoTButton_Lambda_Logic.py` to a lambda function with appropriate permissions (Dynamodb table access)
4. Create an Iot rule pointing to the given topic in the sketch in **Step 2**, with Sql rule `SELECT * FROM (given topic) WHERE mode > 0` and attach the lambda function in **Step 3** as the primary action

