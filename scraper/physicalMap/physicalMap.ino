#include <stdio.h>
#include <fcntl.h>
#include <map>
#include <string>

int pwmPins[50];
int pinCount = sizeof(pwmPins);
map<string, int> locPin;  //Maps pins with locations
map<int, string> dateLoc; //Maps dates with locations
int dates[24] = {12, 13, 19, 19, 19 , 19, 20, 20, 32, 33, 33, 39, 40, 40, 40, 40, 46, 46, 47, 122, 129, 151}; //Converted dates to some pseudodates
string states[24] = {"MI", "NC", "IN", "GA", "IA", "KS", "OH", "IL", "WA", "TN", "TX", "VA", "AZ", "MA", "NJ", "WI", "MD", "UT", "NY", "CA", "CT", "AL", "OK", "MO"};
int today = 40;

//What it does: Loops through the array of dates, then find the its map of states, then use state as key to find its pin number

void setup() {
  for (int i = 2; i <= 52; i++) {
    pwmPins[i] = i;
  }
  for (int thisPin = 0; thisPin < pinCount; thisPin++) {
    pinMode(pwmPins[thisPin], OUTPUT);
  }
  for (int i = 0; i < sizeOf(dates); i++) {
    dateLoc.insert(pair <int, string> (dates[i], states[i])); //Maps dates to states
    locPin.insert(pair <string, int> (states[i], i);  //Maps states to pin num
  }
  for (int i = 0; i < sizeOf(dates); i++) {
    int brightness = 256 - abs(dates[i] - today); //Set brightness to 256 - dDays
    int pinNum = locPin.find(dateLoc.find(dates[i])); //Finds pinNum through mapping dates to states and states to pinNum
    analogWrite(pwmPins[], brightness); //Set brightness
  }
}

void loop() {
  /**Test codes
    for(int value = 0; value <= 255; value++) {
    for(int thisPin = 0; thisPin < pinCount; thisPin++) {
      analogWrite(pwmPins[thisPin],value);
    }
    delay(10);
    }
    delay(50);
    for(int value = 255;value >= 0;value--) {
    for(int thisPin = 0; thisPin < pinCount; thisPin++) {
      analogWrite(pwmPins[thisPin],value);
    }
    delay(10);
    }
    delay(50);
  **/
}
