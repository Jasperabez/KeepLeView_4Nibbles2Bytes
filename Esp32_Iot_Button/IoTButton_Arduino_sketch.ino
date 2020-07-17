#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "ArduinoJson.h"

#define LED_PIN 2
#define BUTTON_PIN 21 


/* Change the following configuration options */
const char* ssid = "Your wifi id";
const char* password = "Wifi Pass";
const char* aws_iot_hostname = "";
const char* aws_iot_sub_topic = "";
const char* aws_iot_pub_topic = "";
const char* aws_iot_pub_message = "Acknowledged.";
const char* client_id = "MyIoT";

const char* ca_certificate = ""; //Own certificate
const char* iot_privatekey = ""; //Own private key
boolean buttonstate = false;
#define SSID_HAS_PASSWORD //comment this line if your SSID does not have a password

/* Global Variables */
WiFiClientSecure client;
PubSubClient mqtt(client);
char buffer[200];
//  StaticJsonDocument<200> aws_json_payload;
  DynamicJsonDocument aws_json_payload(200);

  
/* Functions */
void sub_callback(const char* topic, byte* payload, unsigned int length) {
  Serial.print("Topic: ");
  Serial.println(topic);

  Serial.print("Message: ");
  for (int i = 0; i < length; i++)
    Serial.print((char) payload[i]);
  Serial.println();

  if ((char) payload[0] == '1')
    digitalWrite(LED_PIN, HIGH);
  else if ((char) payload[0] == '0')
    digitalWrite(LED_PIN, LOW);

  mqtt.publish(aws_iot_pub_topic, aws_iot_pub_message);
 
}

void setup() {
  //Initializations
  Serial.begin(9600);
  Serial.print("Attempting WiFi connection on SSID: ");
  Serial.print(ssid);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // WiFi
  #ifdef SSID_HAS_PASSWORD
  WiFi.begin(ssid, password);
  #else
  WiFi.begin(ssid);
  #endif

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.print("\nWiFi connection succeeded.\n");

  client.setCACert(ca_certificate);
  client.setCertificate(iot_certificate);
  client.setPrivateKey(iot_privatekey);
  aws_json_payload["button_id"] = "testButton1";
  // AWS IoT MQTT uses port 8883
  mqtt.setServer(aws_iot_hostname, 8883);
  mqtt.setCallback(sub_callback);
}

void loop() {
  // reconnect on disconnect
  while (!mqtt.connected()) {
    Serial.print("Now connecting to AWS IoT: ");
    if (mqtt.connect(client_id)) {
      Serial.println("connected!");
      mqtt.subscribe(aws_iot_sub_topic); //subscribe to the topic
    } else {
      Serial.print("failed with status code ");
      Serial.print(mqtt.state());
      Serial.println(" trying again in 5 seconds...");
      delay(5000);
    }

  }



if (digitalRead(BUTTON_PIN) == HIGH){// Wait for button to be released
Serial.println("button pressed");
digitalWrite(LED_PIN, HIGH); // Turn on LED
aws_json_payload["mode"] =1;
serializeJson(aws_json_payload, buffer);
// send text message
    mqtt.publish(aws_iot_pub_topic, buffer);
    delay(3000);

digitalWrite(LED_PIN, LOW); // Turn off LED

buttonstate = true;
}

if(digitalRead(BUTTON_PIN) == HIGH && buttonstate==true){
Serial.println("long button pressed");
digitalWrite(LED_PIN, HIGH); // Turn on LED
aws_json_payload["mode"] =2;
serializeJson(aws_json_payload, buffer);
// send text message
    mqtt.publish(aws_iot_pub_topic, buffer);
// the app
    delay(5000);

digitalWrite(LED_PIN, LOW); // Turn off LED

}





  mqtt.loop();
}
