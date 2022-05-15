import socketio
import signal

# standard Python
sio = socketio.Client(logger=True, engineio_logger=True)

BIN = {
    "open":False,
    "height":100,
    "weight":100,
}

def completeBinTransaction(timeout):
    BIN['open']=False
    change_height=110-BIN['height']
    change_weight=110-BIN['weight']
    sio.emit('transaction', {'height': change_height, 'weight': change_weight,"timeout":timeout}, namespace="/bin")

def handler(signum, stack):
    if(not BIN["open"]):
        return
    completeBinTransaction(timeout=True)
    

# signal.signal(signal.SIGALRM, handler)


@sio.on('open-bin',namespace="/bin")
def on_open_bin(data):
    BIN['open']=True
    BIN['height']=100
    BIN['weight']=100
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