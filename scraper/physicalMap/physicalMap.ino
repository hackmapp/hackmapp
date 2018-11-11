#include <stdio.h>
#include <fcntl.h>

#define MAXCHAR 1000

int pwmPins[50];
int pinCount = sizeof(pwmPins);

void setup() {
  FILE *fp;
  char str[MAXCHAR];
  char* filename = "hackathonstxt.txt";
  fp = fopen(filename,"r");
  for(int i = 2;i <= 52; i++) {
    pwmPins[i] = i;
  }
  for(int thisPin = 0; thisPin < pinCount; thisPin++) {
    pinMode(pwmPins[thisPin], OUTPUT);
  }
}

void loop() {
  for(int value = 0;value <= 255;value++) {
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
  
}
