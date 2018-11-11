#include <stdio.h>
#include <fcntl.h>

int pwmPins[50];
int pinCount = sizeof(pwmPins);
int dates[24] = {12, 13, 19, 19, 19 , 19, 20, 20, 32, 33, 33, 39, 40, 40, 40, 40, 46, 46, 47, 122, 129, 151}; //Converted dates to some pseudodates
//string states[24] = {"MI", "NC", "IN", "GA", "IA", "KS", "OH", "IL", "WA", "TN", "TX", "VA", "AZ", "MA", "NJ", "WI", "MD", "UT", "NY", "CA", "CT", "AL", "OK", "MO"};
int today = 40;

//What it does: Loops through the array of dates, then find the its map of states, then use state as key to find its pin number

void setup() {
  Serial.begin(9600);
  for (int i = 2; i <= 52; i++) {
    pwmPins[i] = i;
  }
  for (int thisPin = 0; thisPin < pinCount; thisPin++) {
    pinMode(pwmPins[thisPin], OUTPUT);
  }
  for (int i = 0; i < sizeof(dates); i++) {
    int brightness = 256 - abs(dates[i] - today) * 6; //Set brightness to 256 - dDays
    Serial.println(brightness);
    analogWrite(pwmPins[i+2], brightness); //Set brightness
  }
}

void loop() {
  
}
