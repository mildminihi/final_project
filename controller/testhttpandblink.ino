#include <ArduinoJson.h>

#include "ESP8266WiFi.h"


//WiFi variable ------------------------------------------------------
const char* ssid = "PBMT";
const char* password = "pedbellemewtoey";
const char serverIP[] = "192.168.1.6";
const int port = 3000;


//pH variable --------------------------------------------------------
#define SensorPin A0            //pH meter Analog output to Arduino Analog Input 0
#define Offset 0.00            //deviation compensate
#define LED D4
#define samplingInterval 20
#define printInterval 800
#define ArrayLenth  40    //times of collection
int pHArray[ArrayLenth];   //Store the average value of the sensor feedback
int pHArrayIndex=0;

void setup() {
  pinMode(LED,OUTPUT);  
  Serial.begin(9600);

  //pH setup ---------------------------------------------------------
  Serial.println("pH meter experiment!");    //Test the serial monitor

  //WiFi setup -------------------------------------------------------
  Serial.println("Connecting to " + *ssid);
  WiFi.begin(ssid, password);

  while(WiFi.status() != WL_CONNECTED){
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected");
}

void loop() {
  digitalWrite(LED, HIGH);
  //pH value ---------------------------------------------------------
  static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue,voltage;
  if(millis()-samplingTime > samplingInterval){
    pHArray[pHArrayIndex++]=analogRead(SensorPin);
    if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
    voltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
    pHValue = 3.5*voltage+Offset;
    samplingTime=millis();
  }
  if(millis() - printTime > printInterval){
    //Every 800 milliseconds, print a numerical, convert the state of the LED indicator
    Serial.print("Voltage:");
    Serial.print(voltage,2);
    Serial.print("    pH value: ");
    Serial.println(pHValue,2);
    digitalWrite(LED,digitalRead(LED)^1);
    printTime=millis();

    //Convert float pH value to string --------------------------------
    double floatPHValue = pHValue;
    char charPHValue[4];
    String stringPHValue = "";
    dtostrf(floatPHValue, 4, 4, charPHValue);
    for(int i=0; i<sizeof(charPHValue); i++){
      stringPHValue += charPHValue[i];
    }

    //WiFi client send post request to server -------------------------
    WiFiClient clientGet;

    if (!clientGet.connect(serverIP, port)) {
    Serial.print("Connection failed: ");
    Serial.print(serverIP);
    } else {
      
    clientGet.println("GET /control HTTP/1.1");
    clientGet.print("Host: ");
    clientGet.println(serverIP);
    clientGet.println("User-Agent: ESP8266/1.0");
    clientGet.println("Connection: close\r\n\r\n");
    Serial.println("response: "+ clientGet.readStringUntil('\r'));
    unsigned long timeout = millis();
    while (clientGet.available() == 0){
      if (millis() - timeout > 5000) {
        Serial.println(">>> Client Timeout !");
        clientGet.stop();
        return;
      }
    }

    Serial.println(clientGet.readString());
    const size_t capacity = JSON_OBJECT_SIZE(1) + 20;
    DynamicJsonDocument doc(capacity);
    const char* json = "{\"direction\":\"stop\"}";
    deserializeJson(doc, clientGet);
    const char* directionState = doc["direction"]; // "stop"
    Serial.println(directionState);

      if(clientGet.find("direction")){
  }
    }
  }
}

//pH function
double avergearray(int* arr, int number){
  int i;
  int max,min;
  double avg;
  long amount=0;
  if(number<=0){
    Serial.println("Error number for the array to avraging!/n");
    return 0;
  }
  if(number<5){   //less than 5, calculated directly statistics
    for(i=0;i<number;i++){
      amount+=arr[i];
    }
    avg = amount/number;
    return avg;
  }else{
    if(arr[0]<arr[1]){
      min = arr[0];max=arr[1];
    }
    else{
      min=arr[1];max=arr[0];
    }
    for(i=2;i<number;i++){
      if(arr[i]<min){
        amount+=min;        //arr<min
        min=arr[i];
      }else {
        if(arr[i]>max){
          amount+=max;    //arr>max
          max=arr[i];
        }else{
          amount+=arr[i]; //min<=arr<=max
        }
      }//if
    }//for
    avg = (double)amount/(number-2);
  }//if
  return avg;
}
