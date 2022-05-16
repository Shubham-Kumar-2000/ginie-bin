import socketio
import signal
import time
import RPi.GPIO as GPIO
import time
import requests
import json
import sys
from hx711 import HX711

DHT_PIN = 24
#Libraries

GPIO.setwarnings(False)

#GPIO Mode (BOARD / BCM)
GPIO.setmode(GPIO.BCM)



#set GPIO Pins
GPIO_TRIGGER = 27
GPIO_ECHO = 22

#set GPIO direction (IN / OUT)
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

hx= HX711(dout_pin=5,pd_sck_pin=6,gain=128)
# hx.set_reading_format("MSB","MSB")
# hx.set_reference_unit(1)

hx.reset()
# hx.tare()
weight_ref=20380/50
def getWeight():
    weightdata = hx.get_raw_data()
    weight = sum(weightdata)/len(weightdata)
    return weight/weight_ref
initial_weight = getWeight()

def distance():
    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)

    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    StartTime = time.time()
    StopTime = time.time()

    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()

    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()

    # time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    distance = (TimeElapsed * 34300) / 2

    return distance

# standard Python
sio = socketio.Client()

BIN = {
    "open":False,
    "height":distance(),
    "weight":initial_weight,
}

def completeBinTransaction(timeout):
    BIN['open']=False
    change_height=distance()-BIN['height']
    change_weight=getWeight()-BIN['weight']
    sio.emit('transaction', {'height': change_height, 'weight': change_weight,"timeout":timeout}, namespace="/bin")

def handler(signum, stack):
    if(not BIN["open"]):
        return
    completeBinTransaction(timeout=True)


signal.signal(signal.SIGALRM, handler)


@sio.on('open-bin',namespace="/bin")
def on_open_bin(data):
    BIN['open']=True
    BIN['height']=distance()
    BIN['weight']=getWeight()
    signal.alarm(60*5)
    print("Bin is open")

@sio.on('open-close',namespace="/bin")
def on_open_close(data):
    if(not BIN['open']):
        return
    completeBinTransaction(timeout=False)
    signal.alarm(0)
    print("Bin is close")

@sio.event
def connect():
    print("I'm connected!")

@sio.event
async def disconnect():
    print('disconnected from server')

@sio.event
def connect_error(data):
    print(data)
    print("The connection failed!")

token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjc4MzBiMTQ1MWY2YWIyZjVmNDljM2EiLCJuYW1lIjoiQ2l0eSBDZW50ZXIgQmluIiwiaWF0IjoxNjUyMDQzOTU0fQ.PFeR55deuIgHH3xe5J1tx38wrfrHbCcRGpJul2Ms4tg"

sio.connect("https://rocky-sierra-25987.herokuapp.com/bin?authorization="+token+"&height="+str(BIN["height"]),namespaces=['/bin'])
# sio.wait()
print("Connected")